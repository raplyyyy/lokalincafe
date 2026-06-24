const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lzawrtsjxeeznskspapw.supabase.co';
const supabaseKey = 'sb_publishable_infzH1M3iygZqnBDYVdVyQ_IYcxLPGA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function initDB() {
  console.log("[DB] Supabase database ready.");
}

async function createOrder({ tableNumber, foodItems, drinkItems, totalPrice, note }) {
  const { data: order, error } = await supabase.from('orders').insert({
    tableNumber,
    foodItems: foodItems || [],
    drinkItems: drinkItems || [],
    totalPrice,
    isPaid: false,
    drinkStatus: 'pending',
    note: note || ""
  }).select().single();

  if (error) {
    console.error('Create order error:', error);
    throw error;
  }
  
  return mapOrder(order);
}

async function getAllActiveOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('isPaid', false)
    .order('tableNumber', { ascending: true });

  if (error) {
    console.error('Get active orders error:', error);
    throw error;
  }
  
  return data.map(mapOrder);
}

async function getOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Get order by id error:', error);
    throw error;
  }
  
  return mapOrder(data);
}

async function markAsPaid(id) {
  const { data, error } = await supabase
    .from('orders')
    .update({ isPaid: true })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Mark as paid error:', error);
    throw error;
  }
  
  return mapOrder(data);
}

async function updateDrinkStatus(id, drinkStatus) {
  const { data, error } = await supabase
    .from('orders')
    .update({ drinkStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Update drink status error:', error);
    throw error;
  }
  
  return mapOrder(data);
}

async function cancelOrder(id) {
  // 1. Fetch the order first to know which items to restore
  const order = await getOrderById(id);
  if (!order) throw new Error('Order not found');

  const allItems = [...(order.foodItems || []), ...(order.drinkItems || [])];

  // 2. Restore stock for each item (best-effort, non-blocking on individual failures)
  for (const ordered of allItems) {
    try {
      const baseId = ordered.id
        ? ordered.id.replace(/_Hot$|_Cold$|_[A-Za-z ]+$/, '')
        : null;
      if (!baseId) continue;

      const { data: menuItem } = await supabase
        .from('menu').select('stock').eq('id', baseId).single();

      if (menuItem) {
        const restoredStock = (menuItem.stock ?? 0) + (ordered.qty || 1);
        await supabase.from('menu')
          .update({ stock: restoredStock })
          .eq('id', baseId);
      }
    } catch (e) {
      console.warn(`[cancelOrder] Could not restore stock for item ${ordered.id}:`, e.message);
    }
  }

  // 3. Delete the order
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) {
    console.error('Cancel order error:', error);
    throw error;
  }

  return { success: true, cancelledId: id };
}

// Helper to map Supabase naming to expected frontend naming
function mapOrder(order) {
  return {
    id: order.id,
    tableNumber: order.tableNumber,
    foodItems: order.foodItems || [],
    drinkItems: order.drinkItems || [],
    totalPrice: order.totalPrice,
    status: order.isPaid ? 'paid' : 'unpaid',
    drinkStatus: order.drinkStatus,
    timestamp: order.createdAt,
    note: order.note || ""
  };
}

module.exports = { initDB, createOrder, getAllActiveOrders, getOrderById, markAsPaid, updateDrinkStatus, cancelOrder, supabase };
