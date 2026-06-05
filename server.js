const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const config = require("./config");
const { initDB, createOrder, getAllActiveOrders, getOrderById, markAsPaid, updateDrinkStatus, supabase } = require("./db");
const { printKitchenOrder } = require("./printer");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ─── Clean URL Routes ─────────────────────────────────────────────────────────
app.get("/order",     (req, res) => res.sendFile(path.join(__dirname, "public/order.html")));
app.get("/bar",       (req, res) => res.redirect("/cashier"));
app.get("/cashier",   (req, res) => res.sendFile(path.join(__dirname, "public/cashier.html")));
app.get("/admin",     (req, res) => res.sendFile(path.join(__dirname, "public/admin.html")));
app.get("/stock",     (req, res) => res.sendFile(path.join(__dirname, "public/stock.html")));
app.get("/sales",     (req, res) => res.sendFile(path.join(__dirname, "public/sales.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "public/dashboard.html")));
app.get("/qrcodes",   (req, res) => res.sendFile(path.join(__dirname, "public/qrcodes.html")));

// ─── WebSocket ────────────────────────────────────────────────────────────────

const clients = new Set();

wss.on("connection", (ws, req) => {
  clients.add(ws);
  console.log(`[WS] Client connected (${clients.size} total)`);

  ws.on("close", () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected (${clients.size} remaining)`);
  });

  ws.on("error", (err) => {
    console.error("[WS] Error:", err.message);
    clients.delete(ws);
  });
});

function broadcast(data) {
  const payload = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

// ─── API Routes (Supabase Backed) ─────────────────────────────────────────────

// GET /api/menu → fetch from Supabase
app.get("/api/menu", async (req, res) => {
  try {
    const { data, error } = await supabase.from('menu').select('*').order('id', { ascending: true });
    if (error) throw error;
    
    // Group into { food: [], drinks: [] } for frontend
    // Filter out all system/internal entries (SYS_STOCK_*, SYS_SALES_*, category: System)
    // IMPORTANT: This whitelist must stay in sync with DRINK_CATEGORIES in admin.html
    const DRINK_CATEGORY_WHITELIST = new Set([
      'coffee', 'non-coffee', 'kopi', 'drink', 'minuman',
      'tea', 'teh', 'juice', 'jus', 'blend',
      'squash', 'water', 'other drink'
    ]);
    const menu = { food: [], drinks: [] };
    for (const item of data) {
      if (item.id.startsWith('SYS_')) continue;
      if (item.category === 'System') continue;
      const cat = (item.category || "").toLowerCase().trim();
      if (DRINK_CATEGORY_WHITELIST.has(cat) || [...DRINK_CATEGORY_WHITELIST].some(k => cat.includes(k))) {
        menu.drinks.push(item);
      } else {
        menu.food.push(item);
      }
    }
    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load menu" });
  }
});

// POST /api/order → create new order
app.post("/api/order", async (req, res) => {
  try {
    const { tableNumber, foodItems, drinkItems, totalPrice, note } = req.body;

    if (!tableNumber || (!foodItems?.length && !drinkItems?.length)) {
      return res.status(400).json({ error: "tableNumber and at least one item required" });
    }

    const allItems = [...(foodItems || []), ...(drinkItems || [])];
    
    // Check & decrement stock in Supabase (sequentially for safety)
    for (const ordered of allItems) {
      const { data: menuItem, error } = await supabase.from('menu').select('*').eq('id', ordered.id).single();
      if (error || !menuItem) return res.status(400).json({ error: `Item ${ordered.id} not found` });
      
      if (menuItem.inStock === false) {
        return res.status(400).json({ error: `${menuItem.name} is out of stock` });
      }
      
      const available = menuItem.stock ?? 100;
      if (ordered.qty > available) {
        return res.status(400).json({ error: `${menuItem.name} out of stock` });
      }
      
      // Decrement
      await supabase.from('menu').update({ stock: available - ordered.qty }).eq('id', ordered.id);
    }

    const order = await createOrder({ tableNumber, foodItems: foodItems || [], drinkItems: drinkItems || [], totalPrice: totalPrice || 0, note });

    if (drinkItems && drinkItems.length > 0) {
      broadcast({ type: "NEW_ORDER", order });
    }

    if (foodItems && foodItems.length > 0) {
      printKitchenOrder(order).catch(() => {});
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("[API] POST /api/order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// GET /api/orders/active
app.get("/api/orders/active", async (req, res) => {
  try {
    const orders = await getAllActiveOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/:id
app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await getOrderById(parseInt(req.params.id));
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// PATCH /api/orders/:id/pay
app.patch("/api/orders/:id/pay", async (req, res) => {
  try {
    const order = await markAsPaid(parseInt(req.params.id));
    if (!order) return res.status(404).json({ error: "Order not found" });
    broadcast({ type: "ORDER_PAID", orderId: order.id });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

// PATCH /api/orders/:id/drink-status
app.patch("/api/orders/:id/drink-status", async (req, res) => {
  try {
    const { drinkStatus } = req.body;
    const validStatuses = ["pending", "in-progress", "ready"];
    if (!validStatuses.includes(drinkStatus)) {
      return res.status(400).json({ error: "Invalid drinkStatus" });
    }
    const order = await updateDrinkStatus(parseInt(req.params.id), drinkStatus);
    if (!order) return res.status(404).json({ error: "Order not found" });
    broadcast({ type: "STATUS_UPDATE", orderId: order.id, drinkStatus: order.drinkStatus });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: "Failed to update drink status" });
  }
});

// PATCH /api/menu/:category/:id/stock → toggle inStock in Supabase
app.patch("/api/menu/:category/:id/stock", async (req, res) => {
  try {
    const { id } = req.params;
    const { inStock, stock } = req.body;
    
    const updates = {};
    if (inStock !== undefined) updates.inStock = !!inStock;
    if (stock !== undefined) updates.stock = parseInt(stock, 10);
    
    const { data, error } = await supabase.from('menu').update(updates).eq('id', id).select().single();
    if (error || !data) return res.status(404).json({ error: "Item not found" });
    
    res.json({ success: true, item: data });
  } catch (err) {
    console.error("[API] PATCH stock error:", err);
    res.status(500).json({ error: "Failed to update stock" });
  }
});

// POST /api/menu/item → add item
app.post("/api/menu/item", async (req, res) => {
  try {
    const { category, subcategory, item } = req.body; // frontend category: 'food' | 'drinks', subcategory: e.g. 'Main Food', 'Snack', 'Coffee'
    if (!["food", "drinks"].includes(category) || !item?.name || !item?.price) {
      return res.status(400).json({ error: "Missing properties" });
    }
    
    // Determine the Supabase category value
    let supabaseCategory;
    if (subcategory) {
      supabaseCategory = subcategory;
    } else {
      supabaseCategory = category === 'food' ? 'Main Food' : 'Coffee';
    }

    // Get highest ID for the prefix
    const prefix = category === "food" ? "f" : "d";
    const { data: existing } = await supabase.from('menu').select('id').like('id', `${prefix}%`);
    
    const idNumbers = existing?.map(i => parseInt(i.id.replace(prefix, ""))).filter(Boolean) || [];
    const nextId = idNumbers.length ? Math.max(...idNumbers) + 1 : 1;
    item.id = `${prefix}${nextId}`;
    
    const { error } = await supabase.from('menu').insert({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: supabaseCategory,
      image: item.image,
      inStock: true,
      stock: item.stock || 100,
      hotCold: item.hotCold || false
    });
    
    if (error) throw error;
    res.json({ success: true, item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

// PATCH /api/menu/item/:id/category → update an item's category (subcategory)
app.patch("/api/menu/item/:id/category", async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    if (!category) return res.status(400).json({ error: "category is required" });
    const { data, error } = await supabase.from('menu').update({ category }).eq('id', id).select().single();
    if (error || !data) return res.status(404).json({ error: "Item not found" });
    res.json({ success: true, item: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update category" });
  }
});

// DELETE /api/menu/item/:category/:id
app.delete("/api/menu/item/:category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('menu').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

// GET /api/reports/today
app.get("/api/reports/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('isPaid', true)
      .gte('createdAt', today.toISOString());
      
    if (error) throw error;
    
    let totalRevenue = 0;
    const itemCounts = {};
    
    orders.forEach(order => {
      totalRevenue += (order.totalPrice || 0);
      const items = [...(order.foodItems || []), ...(order.drinkItems || [])];
      items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.qty || 1);
      });
    });
    
    // Sort items by popularity
    const popularItems = Object.entries(itemCounts)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty);
      
    res.json({ success: true, totalRevenue, totalOrders: orders.length, popularItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load reports" });
  }
});

// GET /api/reports/date?date=YYYY-MM-DD  (or ?month=YYYY-MM for monthly)
app.get("/api/reports/date", async (req, res) => {
  try {
    const { date, month } = req.query;
    let startISO, endISO;

    if (month) {
      // Monthly: e.g. 2026-05
      const [y, m] = month.split('-').map(Number);
      const start = new Date(y, m - 1, 1);
      const end   = new Date(y, m, 1);
      startISO = start.toISOString();
      endISO   = end.toISOString();
    } else if (date) {
      // Daily: e.g. 2026-05-27
      const [y, m, d] = date.split('-').map(Number);
      const start = new Date(y, m - 1, d);
      const end   = new Date(y, m - 1, d + 1);
      startISO = start.toISOString();
      endISO   = end.toISOString();
    } else {
      return res.status(400).json({ error: 'Provide ?date=YYYY-MM-DD or ?month=YYYY-MM' });
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('isPaid', true)
      .gte('createdAt', startISO)
      .lt('createdAt', endISO);

    if (error) throw error;

    let totalRevenue = 0;
    const itemCounts = {};

    orders.forEach(order => {
      totalRevenue += (order.totalPrice || 0);
      const items = [...(order.foodItems || []), ...(order.drinkItems || [])];
      items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.qty || 1);
      });
    });

    const popularItems = Object.entries(itemCounts)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty);

    res.json({ success: true, totalRevenue, totalOrders: orders.length, popularItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load reports" });
  }
});

// ─── Frontend Redirect ────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.redirect("/order");
});


// --- Sales Report Sync Endpoints (same pattern as stock) ---
app.get("/api/sales/:key", async (req, res) => {
  try {
    const key = `SYS_SALES_${req.params.key.toUpperCase()}`;
    const { data, error } = await supabase.from('menu').select('description').eq('id', key).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data || !data.description) return res.json(null);
    res.json(JSON.parse(data.description));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sales data" });
  }
});

app.post("/api/sales/:key", async (req, res) => {
  try {
    const key = `SYS_SALES_${req.params.key.toUpperCase()}`;
    const payload = JSON.stringify(req.body);
    const { error } = await supabase.from('menu').upsert({
      id: key,
      name: `System Data: ${key}`,
      description: payload,
      price: 0,
      category: 'System'
    }, { onConflict: 'id' });
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save sales data" });
  }
});

// --- Stock Sync Endpoints ---
app.get("/api/stock/:key", async (req, res) => {
  try {
    // Prevent any browser/proxy caching of stock data
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.set('Pragma', 'no-cache');
    const key = `SYS_STOCK_${req.params.key.toUpperCase()}`;
    const { data, error } = await supabase.from('menu').select('description').eq('id', key).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data || !data.description) return res.json(null);
    res.json(JSON.parse(data.description));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stock" });
  }
});

app.post("/api/stock/:key", async (req, res) => {
  try {
    const key = `SYS_STOCK_${req.params.key.toUpperCase()}`;
    const payload = JSON.stringify(req.body);
    const { error } = await supabase.from('menu').upsert({
      id: key,
      name: `System Data: ${key}`,
      description: payload,
      price: 0,
      category: 'System'
    }, { onConflict: 'id' });
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save stock" });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────

async function start() {
  await initDB();
  server.listen(config.serverPort, "0.0.0.0", () => {
    console.log("");
    console.log("╔══════════════════════════════════════════════════╗");
    console.log("║        🍽️  LOKALIN Restaurant Server v1.0         ║");
    console.log("╠══════════════════════════════════════════════════╣");
    console.log(`║  Server running on port ${config.serverPort}                    ║`);
    console.log(`║                                                  ║`);
    console.log(`║  Customer : http://localhost:${config.serverPort}/order?table=X ║`);
    console.log(`║  Bar/Kasir: http://localhost:${config.serverPort}/cashier        ║`);
    console.log(`║  Admin    : http://localhost:${config.serverPort}/admin          ║`);
    console.log("╚══════════════════════════════════════════════════╝");
    console.log("");
  });
}

if (process.env.VERCEL) {
  // Export Express App for Vercel Serverless Environment
  module.exports = app;
} else {
  // Local/Standard Environment
  start().catch((err) => {
    console.error("[FATAL] Failed to start server:", err);
    process.exit(1);
  });
}
