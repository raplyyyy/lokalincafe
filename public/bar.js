// ─── State ────────────────────────────────────────────────────────────────────
let orders = {};   // { orderId: orderObj }
let ws = null;

// ─── Init ─────────────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  connectWS();
  loadInitialOrders();
});

// ─── WebSocket ────────────────────────────────────────────────────────────────
function connectWS() {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  ws = new WebSocket(`${proto}//${location.host}`);

  ws.addEventListener("open", () => {
    setWsStatus(true);
  });

  ws.addEventListener("close", () => {
    setWsStatus(false);
    // Reconnect after 3s
    setTimeout(connectWS, 3000);
  });

  ws.addEventListener("error", () => {
    setWsStatus(false);
  });

  ws.addEventListener("message", (e) => {
    try {
      const msg = JSON.parse(e.data);
      handleMessage(msg);
    } catch {}
  });
}

function setWsStatus(connected) {
  document.getElementById("ws-dot").classList.toggle("connected", connected);
  document.getElementById("ws-label").textContent = connected ? "Connected" : "Disconnected…";
}

function handleMessage(msg) {
  if (msg.type === "NEW_ORDER") {
    const order = msg.order;
    if (order.drinkItems && order.drinkItems.length > 0) {
      orders[order.id] = order;
      renderAll();
      playNotif();
    }
  } else if (msg.type === "STATUS_UPDATE") {
    if (orders[msg.orderId]) {
      orders[msg.orderId].drinkStatus = msg.drinkStatus;
      renderAll();
    }
  } else if (msg.type === "ORDER_PAID") {
    delete orders[msg.orderId];
    renderAll();
  }
}

// ─── Load Initial Data ────────────────────────────────────────────────────────
async function loadInitialOrders() {
  try {
    const res = await fetch("/api/orders/active");
    const list = await res.json();
    orders = {};
    for (const o of list) {
      if (o.drinkItems && o.drinkItems.length > 0) {
        orders[o.id] = o;
      }
    }
    renderAll();
  } catch (err) {
    console.error("Failed to load orders:", err);
  }
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderAll() {
  const pending  = Object.values(orders).filter(o => o.drinkStatus === "pending");
  const progress = Object.values(orders).filter(o => o.drinkStatus === "in-progress");
  const ready    = Object.values(orders).filter(o => o.drinkStatus === "ready");

  renderColumn("cards-pending",  "count-pending",  pending,  "pending");
  renderColumn("cards-progress", "count-progress", progress, "in-progress");
  renderColumn("cards-ready",    "count-ready",    ready,    "ready");

  const total = Object.keys(orders).length;
  document.getElementById("active-count").textContent = total;
  document.getElementById("active-count-summary").textContent = total;
  document.getElementById("count-pending-summary").textContent = pending.length;
  document.getElementById("count-progress-summary").textContent = progress.length;
  document.getElementById("count-ready-summary").textContent = ready.length;
}

function renderColumn(cardsId, countId, items, status) {
  document.getElementById(countId).textContent = items.length;
  const container = document.getElementById(cardsId);

  if (items.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:24px 0;color:var(--text-muted);font-size:0.85rem;">—</div>`;
    return;
  }

  container.innerHTML = items
    .sort((a, b) => a.tableNumber - b.tableNumber)
    .map(o => cardHTML(o, status))
    .join("");
}

function cardHTML(order, status) {
  const time = new Date(order.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const drinks = order.drinkItems.map(d =>
    `<div class="drink-row">
      <span class="dname">🍹 ${escHtml(d.name)}</span>
      <span class="dqty">×${d.qty}</span>
    </div>`
  ).join("");

  let btn = "";
  if (status === "pending") {
    btn = `<button class="status-btn to-progress" onclick="updateStatus(${order.id}, 'in-progress')">⚡ Start Making</button>`;
  } else if (status === "in-progress") {
    btn = `<button class="status-btn to-ready" onclick="updateStatus(${order.id}, 'ready')">✅ Ready to Serve</button>`;
  } else {
    btn = `<button class="status-btn done" disabled>✔ Done</button>`;
  }

  return `
    <div class="bar-card" id="bar-card-${order.id}">
      <div class="card-top">
        <span class="table-num">Table ${order.tableNumber}</span>
        <span class="card-time">🕐 ${time}</span>
      </div>
      <div class="drink-list">${drinks}</div>
      ${btn}
    </div>`;
}

// ─── Update Status ────────────────────────────────────────────────────────────
async function updateStatus(orderId, newStatus) {
  try {
    await fetch(`/api/orders/${orderId}/drink-status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drinkStatus: newStatus }),
    });
    // WS broadcast will update state; also update locally for speed
    if (orders[orderId]) {
      orders[orderId].drinkStatus = newStatus;
      renderAll();
    }
  } catch (err) {
    alert("❌ Failed to update status. Check connection.");
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

function toggleSidebar() {
  document.getElementById('sidebar-nav').classList.toggle('show');
  document.getElementById('sidebar-overlay').classList.toggle('show');
}

function escHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
