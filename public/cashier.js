// ─── State ────────────────────────────────────────────────────────────────────
let activeOrders = [];
let selectedOrderId = null;
let ws = null;
let currentTab = 'cashier';
let _cashierOrderOpen = true; // local mirror of server order status

// ─── Init ─────────────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  loadOrders();
  connectWS();
  loadOrderStatus(); // load open/close state on start
  if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
  // Auto-refresh every 30s
  setInterval(loadOrders, 30000);
});

// ─── Order Open / Close ───────────────────────────────────────────────────────
async function loadOrderStatus() {
  try {
    const res = await fetch('/api/order-status');
    const data = await res.json();
    _cashierOrderOpen = data.open;
    updateToggleBtn(_cashierOrderOpen);
  } catch (e) {
    console.warn('[Cashier] Could not fetch order status', e);
  }
}

function updateToggleBtn(isOpen) {
  const btn   = document.getElementById('order-toggle-btn');
  const label = document.getElementById('order-toggle-label');
  if (!btn || !label) return;
  if (isOpen) {
    btn.className = 'open';
    label.textContent = 'Order: OPEN';
  } else {
    btn.className = 'closed';
    label.textContent = 'Order: CLOSED';
  }
}

async function toggleOrderStatus() {
  const newState = !_cashierOrderOpen;
  const msg = newState
    ? '✅ Open ordering — customers can place orders again?'
    : '🔒 Close ordering — customers will not be able to order?';

  if (!confirm(msg)) return;

  try {
    const res = await fetch('/api/order-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ open: newState })
    });
    if (!res.ok) throw new Error('Server error');
    _cashierOrderOpen = newState;
    updateToggleBtn(_cashierOrderOpen);
    showToast(newState ? '✅ Order is now OPEN' : '🔒 Order is now CLOSED');
  } catch (e) {
    showToast('❌ Failed to update order status');
  }
}


// ─── Stock Management ───────────────────────────────────────────────────────
async function loadStock() {
  try {
    const res = await fetch('/api/menu');
    const menu = await res.json();
    renderStockList(menu);
  } catch (err) {
    console.error('Failed to load stock', err);
  }
}

function renderStockList(menu) {
  const container = document.getElementById('stock-list');
  const countEl = document.getElementById('stock-count');
  const countLabelEl = document.getElementById('stock-count-label');
  const foodItems = (menu.food || []).map(i => ({ ...i, type: 'food' }));
  const drinkItems = (menu.drinks || []).map(i => ({ ...i, type: 'drinks' }));
  const allItems = [...foodItems, ...drinkItems];
  
  countEl.textContent = allItems.length;
  if (countLabelEl) countLabelEl.textContent = allItems.length;
  container.innerHTML = allItems.map(item => {
    const inStock = item.inStock !== false;
    const btnLabel = inStock ? 'In Stock' : 'Out of Stock';
    const btnClass = inStock ? 'stock-btn in' : 'stock-btn out';
    const stockVal = item.stock !== undefined ? item.stock : 100;
    
    return `
      <div class="stock-item">
        <div style="flex:1;">
          <div style="font-weight:600; font-size: 0.95rem;">${escHtml(item.name)}</div>
          <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
            <button class="qty-btn" style="width:28px; height:28px;" onclick="updateStockCount('${item.type}', '${item.id}', ${stockVal}, -1)">−</button>
            <input type="number" value="${stockVal}" 
                   onchange="setStockCount('${item.type}', '${item.id}', this.value)"
                   style="font-size:0.9rem; font-family:'Outfit', sans-serif; font-weight:700; width:44px; text-align:center; background:var(--bg-input); border:1px solid var(--border); color:var(--text-primary); border-radius:4px; padding:2px;" 
            />
            <button class="qty-btn" style="width:28px; height:28px;" onclick="updateStockCount('${item.type}', '${item.id}', ${stockVal}, 1)">+</button>
            <span style="font-size:0.8rem; color:var(--text-muted); margin-left:4px;">left</span>
          </div>
        </div>
        <button class="${btnClass}" onclick="toggleStock('${item.type}', '${item.id}', ${!inStock})">${btnLabel}</button>
      </div>`;
  }).join('');
}

async function toggleStock(category, id, newState) {
  try {
    const res = await fetch(`/api/menu/${category}/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: newState })
    });
    if (!res.ok) throw new Error('Update failed');
    loadStock();
  } catch (err) {
    console.error('Failed to toggle stock', err);
  }
}

async function updateStockCount(category, id, currentStock, delta) {
  const newStock = Math.max(0, currentStock + delta);
  setStockCount(category, id, newStock);
}

async function setStockCount(category, id, newStockVal) {
  const newStock = Math.max(0, parseInt(newStockVal, 10) || 0);
  try {
    const res = await fetch(`/api/menu/${category}/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: newStock })
    });
    if (!res.ok) throw new Error('Update failed');
    loadStock();
  } catch (err) {
    console.error('Failed to set stock count', err);
  }
}

function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));

  document.getElementById('tab-' + tabId).classList.add('active');
  document.getElementById('view-' + tabId).classList.add('active');

  if (tabId === 'stock') {
    loadStock();
  }
}



// ─── WebSocket (for real-time paid/new updates) ───────────────────────────────
function connectWS() {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  ws = new WebSocket(`${proto}//${location.host}`);
  
  ws.addEventListener("open", () => {
    document.getElementById("ws-dot").classList.add("connected");
    document.getElementById("ws-label").textContent = "Connected";
  });

  ws.addEventListener("message", (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.type === "NEW_ORDER" || msg.type === "ORDER_PAID" || msg.type === "STATUS_UPDATE") {
        if (msg.type === "NEW_ORDER") {
          playNotif();
          if ("Notification" in window && Notification.permission === "granted") {
            const meja = msg.order ? msg.order.tableNumber : "?";
            new Notification("New Order!", { 
              body: `New order from Table ${meja}. Check the Cashier page immediately.`,
              icon: "https://cdn-icons-png.flaticon.com/512/3566/3566083.png" 
            });
          }
        }
        loadOrders();
      } else if (msg.type === "ORDER_STATUS") {
        // Sync toggle button if changed from another device
        _cashierOrderOpen = msg.open;
        updateToggleBtn(_cashierOrderOpen);
      } else if (msg.type === "ORDER_CANCELLED") {
        // Remove the cancelled order from local list immediately
        activeOrders = activeOrders.filter(o => o.id !== msg.orderId);
        renderOrderList();
        renderKanban();
        // Close detail panel if it was open for the cancelled order
        if (selectedOrderId === msg.orderId) closeDetail();
      }
    } catch {}
  });

  ws.addEventListener("close", () => {
    document.getElementById("ws-dot").classList.remove("connected");
    document.getElementById("ws-label").textContent = "Disconnected…";
    setTimeout(connectWS, 3000);
  });
  
  ws.addEventListener("error", () => {
    document.getElementById("ws-dot").classList.remove("connected");
    document.getElementById("ws-label").textContent = "Disconnected…";
  });
}

// ─── Load Orders ──────────────────────────────────────────────────────────────
async function loadOrders() {
  const btn = document.getElementById("refresh-btn");
  btn.classList.add("spinning");

  try {
    const res = await fetch("/api/orders/active");
    activeOrders = await res.json();
    renderOrderList();
    renderKanban();
  } catch (err) {
    showToast("❌ Failed to load orders");
  } finally {
    btn.classList.remove("spinning");
  }
}

// ─── Cashier View Render ──────────────────────────────────────────────────────
function renderOrderList() {
  const container = document.getElementById("order-list");
  document.getElementById("order-count").textContent = activeOrders.length;
  const orderCountLabel = document.getElementById("order-count-label");
  if (orderCountLabel) orderCountLabel.textContent = activeOrders.length;

  if (activeOrders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎉</div>
        <h3>No active orders</h3>
        <p>All orders have been paid</p>
      </div>`;
    return;
  }

  container.innerHTML = activeOrders.map(order => {
    const allItems = [...(order.foodItems || []), ...(order.drinkItems || [])];
    const summary = allItems.map(i => `${i.name} ×${i.qty}`).join(", ");
    const time = new Date(order.timestamp).toLocaleTimeString("id-ID", { hour:"2-digit", minute:"2-digit" });
    const date = new Date(order.timestamp).toLocaleDateString("id-ID", { day:"2-digit", month:"short" });
    const noteBadge = order.note ? `<div style="margin-top:8px; font-size:0.75rem; color:var(--orange); background:var(--bg-input); padding:4px 8px; border-radius:4px; border:1px solid rgba(245,158,11,0.2);">📝 ${escHtml(order.note)}</div>` : '';

    return `
      <div class="order-card" onclick="openDetail(${order.id})" id="order-card-${order.id}">
        <div class="card-table-badge">
          <span class="label">Table</span>
          <span class="num">${order.tableNumber}</span>
        </div>
        <div class="card-meta">
          <div class="font-bold" style="font-size:0.95rem">Table ${order.tableNumber}</div>
          <div class="card-summary">${escHtml(summary)}</div>
          <div class="card-time">🕐 ${date}, ${time}</div>
          ${noteBadge}
        </div>
        <div class="card-total-right">
          <div class="amount">${formatRupiah(order.totalPrice)}</div>
        </div>
        <div class="card-chevron">›</div>
      </div>`;
  }).join("");
}

// ─── Bar View Render ──────────────────────────────────────────────────────────
function renderKanban() {
  // Hanya tampilkan yang belum selesai (pending/in-progress kita anggap sama)
  const drinkOrders = activeOrders.filter(o => 
    o.drinkItems && o.drinkItems.length > 0 && o.drinkStatus !== "ready"
  );
  
  document.getElementById("active-count").textContent = drinkOrders.length;

  const container = document.getElementById("cards-bar");
  if (drinkOrders.length === 0) {
    container.innerHTML = `<div style="text-align:center; grid-column: 1 / -1; padding:24px 0;color:var(--text-muted);font-size:0.85rem;">— No drink queue —</div>`;
    return;
  }

  container.innerHTML = drinkOrders
    .sort((a, b) => a.tableNumber - b.tableNumber)
    .map(o => cardHTML(o))
    .join("");
}

function cardHTML(order) {
  const time = new Date(order.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const drinks = order.drinkItems.map(d =>
    `<div class="drink-row">
      <span class="dname">🍹 ${escHtml(d.name)}</span>
      <span class="dqty">×${d.qty}</span>
    </div>`
  ).join("");
  const noteBadge = order.note ? `<div style="margin-top:8px; font-size:0.75rem; color:var(--orange); background:var(--bg-base); padding:6px; border-radius:4px; border:1px dashed var(--border-accent);">📝 Note: ${escHtml(order.note)}</div>` : '';

  const btn = `<button class="status-btn to-ready" onclick="updateStatus(${order.id}, 'ready', event)">✅ Finished Making</button>`;

  return `
    <div class="bar-card" id="bar-card-${order.id}">
      <div class="card-top">
        <span class="table-num">Table ${order.tableNumber}</span>
        <span class="card-time">🕐 ${time}</span>
      </div>
      <div class="drink-list">${drinks}</div>
      ${noteBadge}
      ${btn}
    </div>`;
}

async function updateStatus(orderId, newStatus, event) {
  if (event) event.stopPropagation();
  try {
    await fetch(`/api/orders/${orderId}/drink-status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drinkStatus: newStatus }),
    });
    // Optimistic local update
    const order = activeOrders.find(o => o.id === orderId);
    if (order) {
      order.drinkStatus = newStatus;
      renderKanban();
    }
  } catch (err) {
    alert("❌ Failed to update status. Check connection.");
  }
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function openDetail(orderId) {
  const order = activeOrders.find(o => o.id === orderId);
  if (!order) return;
  selectedOrderId = orderId;

  document.getElementById("panel-table").textContent = `Table ${order.tableNumber}`;
  const ts = new Date(order.timestamp);
  document.getElementById("panel-time").textContent =
    `Order received: ${ts.toLocaleDateString("en-US", { day:"2-digit", month:"long", year:"numeric" })} ${ts.toLocaleTimeString("en-US", {hour:"2-digit",minute:"2-digit"})}`;

  // Food items
  const foodSection = document.getElementById("section-food");
  const foodContainer = document.getElementById("panel-food-items");
  if (order.foodItems && order.foodItems.length) {
    foodSection.style.display = "";
    foodContainer.innerHTML = order.foodItems.map(item =>
      detailItemHTML(item, "🍽️")
    ).join("");
  } else {
    foodSection.style.display = "none";
  }

  // Drink items
  const drinkSection = document.getElementById("section-drinks");
  const drinkContainer = document.getElementById("panel-drink-items");
  if (order.drinkItems && order.drinkItems.length) {
    drinkSection.style.display = "";
    drinkContainer.innerHTML = order.drinkItems.map(item =>
      detailItemHTML(item, "🍹")
    ).join("");

    // Status badge
    const statusEl = document.getElementById("panel-drink-status");
    const statusMap = {
      "pending":     { cls: "badge-pending",  label: "⏳ Pending" },
      "in-progress": { cls: "badge-progress", label: "⚡ In Progress" },
      "ready":       { cls: "badge-ready",    label: "✅ Ready" },
    };
    const s = statusMap[order.drinkStatus] || statusMap["pending"];
    statusEl.className = `badge ${s.cls}`;
    statusEl.textContent = s.label;
  } else {
    drinkSection.style.display = "none";
  }

  // Note
  const notePanel = document.getElementById("panel-note");
  if (order.note && order.note.trim() !== "") {
    notePanel.style.display = "";
    document.getElementById("panel-note-text").textContent = order.note;
  } else {
    notePanel.style.display = "none";
  }

  const allItems = [...(order.foodItems || []), ...(order.drinkItems || [])];
  const subtotal = allItems.reduce((s, e) => s + e.qty * e.price, 0);
  const tax = Math.round(subtotal * 0.11);

  document.getElementById("panel-subtotal").textContent = formatRupiah(subtotal);
  document.getElementById("panel-tax").textContent = formatRupiah(tax);
  document.getElementById("panel-total").textContent = formatRupiah(order.totalPrice);

  // Show panel
  document.getElementById("detail-overlay").classList.add("show");
  document.getElementById("detail-panel").classList.add("show");
}

function detailItemHTML(item, emoji) {
  const subtotal = item.qty * item.price;
  return `
    <div class="detail-item">
      <div class="di-left">
        <span class="di-qty">×${item.qty}</span>
        <div>
          <div class="di-name">${emoji} ${escHtml(item.name)}</div>
          <div class="di-price">${formatRupiah(item.price)} / pcs</div>
        </div>
      </div>
      <div style="font-weight:700;color:var(--text-primary)">${formatRupiah(subtotal)}</div>
    </div>`;
}

function closeDetail() {
  document.getElementById("detail-overlay").classList.remove("show");
  document.getElementById("detail-panel").classList.remove("show");
  selectedOrderId = null;
}

// ─── Mark as Paid ─────────────────────────────────────────────────────────────
async function markPaid() {
  if (!selectedOrderId) return;

  const btn = document.getElementById("pay-btn");
  btn.disabled = true;
  btn.textContent = "⏳ Processing…";

  try {
    const res = await fetch(`/api/orders/${selectedOrderId}/pay`, { method: "PATCH" });
    if (!res.ok) throw new Error("Server error");

    closeDetail();
    await loadOrders();
    showToast("✅ Order marked as paid!");
  } catch (err) {
    showToast("❌ Failed to update status");
  } finally {
    btn.disabled = false;
    btn.textContent = "✅ Paid — Mark as Paid";
  }
}

// ─── Cancel Order ─────────────────────────────────────────────────────────────
async function cancelOrder() {
  if (!selectedOrderId) return;

  const order = activeOrders.find(o => o.id === selectedOrderId);
  if (!order) return;

  // Build a short summary for the confirm dialog
  const allItems = [...(order.foodItems || []), ...(order.drinkItems || [])];
  const summary = allItems.map(i => `${i.name} ×${i.qty}`).join(', ');
  const msg = `❗ Cancel order for Table ${order.tableNumber}?\n\nItems: ${summary}\n\nStock will be restored automatically.`;

  if (!confirm(msg)) return;

  const payBtn    = document.getElementById('pay-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) { cancelBtn.disabled = true; cancelBtn.textContent = '⏳ Cancelling…'; }
  if (payBtn)    { payBtn.disabled = true; }

  try {
    const res = await fetch(`/api/orders/${selectedOrderId}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Server error');
    }
    closeDetail();
    await loadOrders();
    showToast(`🗑️ Order Table ${order.tableNumber} cancelled & stock restored`);
  } catch (err) {
    showToast(`❌ Failed to cancel: ${err.message}`);
    if (cancelBtn) { cancelBtn.disabled = false; cancelBtn.textContent = '🗑️ Cancel Order'; }
    if (payBtn)    { payBtn.disabled = false; }
  }
}


// ─── Notification Sound ───────────────────────────────────────────────────────
let audioUnlocked = false;

function initAudio() {
  if (audioUnlocked) return;
  let audioEl = document.getElementById('notifAudio');
  if (!audioEl) {
    audioEl = document.createElement('audio');
    audioEl.id = 'notifAudio';
    audioEl.src = '/notif.wav';
    audioEl.preload = 'auto';
    document.body.appendChild(audioEl);
  }
  
  // Unlock audio for iOS Safari
  audioEl.volume = 0; // mute during unlock
  audioEl.play().then(() => {
    audioEl.pause();
    audioEl.currentTime = 0;
    audioEl.volume = 1; // restore volume
    audioUnlocked = true;
  }).catch(e => console.warn('Audio unlock failed:', e));
}

// Browser mewajibkan interaksi user untuk bisa play suara
window.addEventListener('click', initAudio, { once: true });
window.addEventListener('touchstart', initAudio, { once: true });

function playNotif() {
  try {
    let audioEl = document.getElementById('notifAudio');
    if (!audioEl) {
      initAudio();
      audioEl = document.getElementById('notifAudio');
    }
    if (audioEl) {
      audioEl.volume = 1;
      audioEl.currentTime = 0;
      audioEl.play().catch(e => console.warn('Failed to play notif:', e));
    }
  } catch (e) {
    console.warn('Gagal putar notif:', e);
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar-nav').classList.toggle('show');
  document.getElementById('sidebar-overlay').classList.toggle('show');
}
function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}
function escHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function showToast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
