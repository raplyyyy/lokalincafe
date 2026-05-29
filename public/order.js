// ─── State ────────────────────────────────────────────────────────────────────
let tableNumber = null;
let cart = {};      // { itemId_Hot / itemId_Cold / itemId: { ...item, qty } }
let menu = { food: [], drinks: [] };

// Hot/cold pending state
let pendingHotCold = null; // { item, delta }
let pendingVariant = null;

const FOOD_FALLBACKS = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`
];

const DRINK_FALLBACKS = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2"/><path d="M10 2v2"/><path d="M14 2v2"/></svg>`
];

// ─── Init ─────────────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  tableNumber = parseInt(params.get("table"));
  
  if (!tableNumber || isNaN(tableNumber)) {
      promptTableNumber();
  } else {
      document.getElementById("table-display").textContent = tableNumber;
      document.getElementById("confirm-table").textContent = `Meja ${tableNumber}`;
  }

  await loadMenu();
});

function promptTableNumber() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay show';
    overlay.innerHTML = `
        <div class="checkout-panel show" style="max-width: 320px; opacity: 1 !important; transform: none !important;">
            <div style="font-size: 3rem; margin-bottom: 12px;">🍽️</div>
            <h2 style="margin-bottom: 16px; font-family: 'Outfit';">Selamat Datang!</h2>
            <p style="color: var(--text-muted); margin-bottom: 24px;">Silakan masukkan nomor meja Anda.</p>
            <input type="number" id="manual-table-input" class="modal-textarea" placeholder="Contoh: 5" style="height: 50px; text-align: center; font-size: 1.2rem; font-weight: bold;" min="1" max="100">
            <button class="btn btn-primary" onclick="submitManualTable()" style="width: 100%; margin-top: 16px;">Mulai Memesan</button>
        </div>
    `;
    document.body.appendChild(overlay);
    
    window.submitManualTable = function() {
        const val = parseInt(document.getElementById('manual-table-input').value);
        if (val > 0) {
            window.location.href = '/order?table=' + val;
        } else {
            alert("Mohon masukkan nomor meja yang valid (angka).");
        }
    }
}

async function loadMenu() {
  try {
    const res = await fetch("/api/menu");
    menu = await res.json();
    renderMenuList("food-list",   menu.food,   FOOD_FALLBACKS);
    renderMenuList("drinks-list", menu.drinks, DRINK_FALLBACKS);
  } catch (err) {
    document.getElementById("food-list").innerHTML =
      `<div class="empty-state"><div class="empty-icon">⚠️</div><h3>Gagal memuat menu</h3><p>Coba refresh halaman</p></div>`;
  }
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderMenuList(containerId, items, icons) {
  const el = document.getElementById(containerId);
  if (!items || items.length === 0) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">🍽️</div><h3>Menu kosong</h3></div>`;
    return;
  }

  const grouped = {};
  items.forEach(item => {
    const cat = item.category || "Lainnya";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  let pillsHtml = `<div class="category-pills">`;
  for (const cat of Object.keys(grouped)) {
    const catId = `cat-${cat.replace(/\s+/g, '-')}`;
    pillsHtml += `<button class="pill-btn" onclick="document.getElementById('${catId}').scrollIntoView({behavior:'smooth', block:'start'})">${escHtml(cat)}</button>`;
  }
  pillsHtml += `</div>`;

  let html = "";
  let iconIndex = 0;

  for (const [cat, catItems] of Object.entries(grouped)) {
    const catId = `cat-${cat.replace(/\s+/g, '-')}`;
    html += `<div class="category-header" id="${catId}" style="scroll-margin-top: 140px;">${escHtml(cat)}</div>`;
    for (const item of catItems) {
      html += menuItemHTML(item, icons[iconIndex % icons.length]);
      iconIndex++;
    }
  }

  el.innerHTML = pillsHtml + html;
}

function menuItemHTML(item, fallbackIconSvg) {
  const media = item.image
    ? `<div class="item-image" style="background-image: url('${item.image}')"></div>`
    : `<div class="item-icon">${fallbackIconSvg}</div>`;

  // For hotCold items, the qty display shows combined qty of both variants
  const qtyDisplay = `<span class="qty-value" id="qty-val-${item.id}">0</span>`;

  // Hot/cold badge (uses CSS class for consistent padding/alignment)
  const tempBadge = item.hotCold
    ? `<span class="hotcold-badge">🔥 Hot / 🧊 Cold</span>`
    : ``;

  const isOutOfStock = item.inStock === false || item.stock === 0;
  const outClass = isOutOfStock ? " out-of-stock" : "";
  const controlHTML = isOutOfStock
    ? `<span class="badge-out-of-stock">Habis</span>`
    : `
        <div class="qty-control" id="qty-ctrl-${item.id}">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)" aria-label="Kurang">−</button>
          ${qtyDisplay}
          <button class="qty-btn" onclick="changeQty('${item.id}', +1)" aria-label="Tambah">+</button>
        </div>`;

  return `
    <div class="menu-item${outClass}" id="card-${item.id}">
      ${media}
      <div class="item-info">
        <div class="item-name">${escHtml(item.name)}${tempBadge}</div>
        <div class="item-desc">${escHtml(item.description)}</div>
        <div class="item-price">${formatRupiah(item.price)}</div>
      </div>
      <div class="item-control">
        ${controlHTML}
      </div>
    </div>`;
}

// ─── Cart Logic ───────────────────────────────────────────────────────────────
function changeQty(itemId, delta) {
  let parsed = menu.food.find(i => i.id == itemId) || menu.drinks.find(i => i.id == itemId);
  if (!parsed) return;

  // If item supports hot/cold and user is ADDING (+1), show modal
  if (parsed.hotCold && delta > 0) {
    pendingHotCold = { item: parsed, delta };
    openHotColdModal(parsed);
    return;
  }

  // If item is Paket Nongkrong (f14) and user is ADDING (+1)
  if (parsed.id === 'f14' && delta > 0) {
    pendingVariant = { item: parsed, delta };
    openVariantModal(parsed);
    return;
  }

  // For decrease (-1) on hotCold items: reduce the most recent variant
  if (parsed.hotCold && delta < 0) {
    const hotKey  = itemId + "_Hot";
    const coldKey = itemId + "_Cold";
    const hotQty  = cart[hotKey]?.qty  || 0;
    const coldQty = cart[coldKey]?.qty || 0;

    if (hotQty === 0 && coldQty === 0) return;

    // Remove from whichever has qty (prefer cold first, then hot)
    if (coldQty > 0) {
      applyQtyChange(coldKey, -1, { ...parsed, name: parsed.name + " (Cold)" });
    } else {
      applyQtyChange(hotKey, -1, { ...parsed, name: parsed.name + " (Hot)" });
    }

    // Update shared display
    updateHotColdDisplay(itemId);
    updateCartBar();
    return;
  }

  // For decrease (-1) on Paket Nongkrong (f14)
  if (parsed.id === 'f14' && delta < 0) {
    const variants = ["Original", "Coklat Keju", "Coklat", "Keju"];
    for (const v of variants) {
      const vKey = parsed.id + "_" + v;
      if (cart[vKey] && cart[vKey].qty > 0) {
        applyQtyChange(vKey, -1, { ...parsed, name: parsed.name + " (" + v + ")" });
        updateVariantDisplay(parsed.id);
        updateCartBar();
        return; 
      }
    }
    return;
  }

  // Normal item (no hotCold)
  applyQtyChange(itemId, delta, parsed);
  updateCartBar();
}

function applyQtyChange(cartKey, delta, itemData) {
  if (!cart[cartKey]) cart[cartKey] = { ...itemData, qty: 0 };
  cart[cartKey].qty = Math.max(0, cart[cartKey].qty + delta);
  if (cart[cartKey].qty === 0) delete cart[cartKey];

  // Update qty display for non-hotCold items
  if (!itemData.hotCold) {
    const valEl = document.getElementById(`qty-val-${itemData.id}`);
    if (valEl) valEl.textContent = cart[cartKey]?.qty ?? 0;
    const cardEl = document.getElementById(`card-${itemData.id}`);
    if (cardEl) cardEl.classList.toggle("in-cart", !!(cart[cartKey]?.qty > 0));
  }
}

// ─── Hot/Cold Modal ───────────────────────────────────────────────────────────
function openHotColdModal(item) {
  const modal = document.getElementById("hotcold-modal");
  const panel = document.getElementById("hotcold-panel");
  document.getElementById("hotcold-item-name").textContent = item.name;

  // Pick icon based on category
  const isCoffee = item.category?.toLowerCase().includes("coffee");
  document.getElementById("hotcold-item-icon").textContent = isCoffee ? "☕" : "🍵";

  modal.style.display = "flex";
  setTimeout(() => {
    panel.style.transform = "scale(1)";
    panel.style.opacity = "1";
  }, 10);
}

function closeHotColdModal() {
  const modal = document.getElementById("hotcold-modal");
  const panel = document.getElementById("hotcold-panel");
  panel.style.transform = "scale(0.85)";
  panel.style.opacity = "0";
  setTimeout(() => {
    modal.style.display = "none";
    pendingHotCold = null;
  }, 300);
}

function confirmHotCold(temp) {
  if (!pendingHotCold) return;
  const { item } = pendingHotCold;
  const cartKey = item.id + "_" + temp;
  const label   = temp === "Hot" ? "🔥 Hot" : "🧊 Cold";
  const itemWithTemp = {
    ...item,
    name: item.name + ` (${label})`,
    hotCold: false // prevent re-triggering modal
  };

  applyQtyChange(cartKey, +1, itemWithTemp);
  updateHotColdDisplay(item.id);
  updateCartBar();
  closeHotColdModal();
}

function updateHotColdDisplay(baseId) {
  const hotQty  = cart[baseId + "_Hot"]?.qty  || 0;
  const coldQty = cart[baseId + "_Cold"]?.qty || 0;
  const total   = hotQty + coldQty;

  const valEl  = document.getElementById(`qty-val-${baseId}`);
  const cardEl = document.getElementById(`card-${baseId}`);
  if (valEl)  valEl.textContent = total;
  if (cardEl) cardEl.classList.toggle("in-cart", total > 0);
}

// ─── Variant Modal ────────────────────────────────────────────────────────────
function openVariantModal(item) {
  const modal = document.getElementById("variant-modal");
  const panel = document.getElementById("variant-panel");
  modal.style.display = "flex";
  setTimeout(() => {
    panel.style.transform = "scale(1)";
    panel.style.opacity = "1";
  }, 10);
}

function closeVariantModal() {
  const modal = document.getElementById("variant-modal");
  const panel = document.getElementById("variant-panel");
  panel.style.transform = "scale(0.85)";
  panel.style.opacity = "0";
  setTimeout(() => {
    modal.style.display = "none";
    pendingVariant = null;
  }, 300);
}

function confirmVariant(variantName) {
  if (!pendingVariant) return;
  const { item } = pendingVariant;
  const cartKey = item.id + "_" + variantName;
  const itemWithVariant = {
    ...item,
    name: item.name + ` (${variantName})`
  };

  applyQtyChange(cartKey, +1, itemWithVariant);
  updateVariantDisplay(item.id);
  updateCartBar();
  closeVariantModal();
}

function updateVariantDisplay(baseId) {
  const variants = ["Original", "Coklat Keju", "Coklat", "Keju"];
  let total = 0;
  for (const v of variants) {
    if (cart[baseId + "_" + v]) total += cart[baseId + "_" + v].qty;
  }

  const valEl  = document.getElementById(`qty-val-${baseId}`);
  const cardEl = document.getElementById(`card-${baseId}`);
  if (valEl)  valEl.textContent = total;
  if (cardEl) cardEl.classList.toggle("in-cart", total > 0);
}

function updateCartBar() {
  const entries = Object.values(cart);
  const totalQty = entries.reduce((s, e) => s + e.qty, 0);
  const subtotal = entries.reduce((s, e) => s + e.qty * e.price, 0);
  const tax = Math.round(subtotal * 0.11);
  const totalPrice = subtotal + tax;

  document.getElementById("cart-count").textContent = `${totalQty} item${totalQty !== 1 ? 's' : ''}`;
  const taxEl = document.getElementById("cart-tax");
  if(taxEl) taxEl.textContent = `+ Tax 11%: ${formatRupiah(tax)}`;
  document.getElementById("cart-total").textContent = formatRupiah(totalPrice);

  const btn = document.getElementById("place-order-btn");
  btn.disabled = totalQty === 0;
}

// ─── Tab Switching ────────────────────────────────────────────────────────────
function switchTab(tab) {
  document.getElementById("panel-food").classList.toggle("hidden", tab !== "food");
  document.getElementById("panel-drinks").classList.toggle("hidden", tab !== "drinks");
  document.getElementById("tab-food").classList.toggle("active", tab === "food");
  document.getElementById("tab-drinks").classList.toggle("active", tab === "drinks");
}

// ─── Place Order ──────────────────────────────────────────────────────────────
async function placeOrder() {
  const entries = Object.values(cart);
  if (!entries.length) return;

  const foodItems  = entries.filter(e => e.id.startsWith("f") || e.id.includes("f")).map(e => ({ name: e.name, qty: e.qty, price: e.price }));
  const drinkItems = entries.filter(e => !e.id.startsWith("f") && !e.id.includes("f")).map(e => ({ name: e.name, qty: e.qty, price: e.price }));

  // Re-filter by original id prefix
  const allFood   = entries.filter(e => {
    const baseId = e.id.replace(/_Hot$|_Cold$|_[A-Za-z ]+$/, "");
    return baseId.startsWith("f");
  }).map(e => ({ id: e.id.replace(/_Hot$|_Cold$|_[A-Za-z ]+$/, ""), name: e.name, qty: e.qty, price: e.price }));
  const allDrinks = entries.filter(e => {
    const baseId = e.id.replace(/_Hot$|_Cold$|_[A-Za-z ]+$/, "");
    return baseId.startsWith("d");
  }).map(e => ({ id: e.id.replace(/_Hot$|_Cold$|_[A-Za-z ]+$/, ""), name: e.name, qty: e.qty, price: e.price }));

  const subtotal = entries.reduce((s, e) => s + e.qty * e.price, 0);
  const tax = Math.round(subtotal * 0.11);
  const totalPrice = subtotal + tax;

  const btn = document.getElementById("place-order-btn");
  btn.disabled = true;
  btn.textContent = "⏳ Sending...";

  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        tableNumber, 
        foodItems: allFood, 
        drinkItems: allDrinks, 
        totalPrice,
        note: document.getElementById('modal-note')?.value || ""
      }),
    });

    if (!res.ok) throw new Error("Server error");

    closeCheckoutModal();
    document.getElementById("confirm-screen").classList.add("show");
    cart = {};
    updateCartBar();
  } catch (err) {
    alert("Failed to send order. Please try again.");
    btn.disabled = false;
    btn.textContent = "🛒 Order Now";
  }
}

function openCheckoutModal() {
  if (Object.keys(cart).length === 0) return;
  
  const items = Object.values(cart);
  const placeholders = [];
  
  for (let i = 0; i < Math.min(2, items.length); i++) {
    const item = items[i];
    const name = item.name.split(' (')[0]; // Remove variant text for brevity
    
    if (item.id.startsWith("d")) {
      placeholders.push(`${name} less sugar/es dipisah`);
    } else if (name.toLowerCase().includes("nasi") || name.toLowerCase().includes("mie")) {
      placeholders.push(`${name} pedas sedang`);
    } else {
      placeholders.push(`${name} ekstra saos/pisahkan`);
    }
  }
  
  const textarea = document.getElementById("modal-note");
  if (textarea) {
    textarea.placeholder = "Misal: " + placeholders.join(", ") + "...";
    textarea.value = ""; // clear previous note
  }
  
  const listEl = document.getElementById("checkout-items-list");
  if (listEl) {
    listEl.innerHTML = items.map(item => `
      <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-input); padding:10px 14px; border-radius:8px; border:1px solid var(--border);">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-weight:800; color:var(--accent); background:rgba(255,94,58,0.1); padding:4px 8px; border-radius:6px; font-size:0.85rem;">x${item.qty}</span>
          <span style="font-weight:600; color:var(--text-primary); font-size:0.95rem;">${escHtml(item.name)}</span>
        </div>
        <div style="font-weight:700; color:var(--text-secondary); font-size:0.9rem;">${formatRupiah(item.qty * item.price)}</div>
      </div>
    `).join("");
  }
  
  const modal = document.getElementById('checkout-modal');
  const panel = document.getElementById('checkout-panel');
  modal.style.display = 'flex';
  setTimeout(() => {
    panel.style.transform = 'translateY(0)';
    panel.style.opacity = '1';
  }, 10);
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const panel = document.getElementById('checkout-panel');
  panel.style.transform = 'translateY(100%)';
  panel.style.opacity = '0';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 400);
}

function resetApp() {
  document.getElementById("confirm-screen").classList.remove("show");
  document.querySelectorAll(".qty-value").forEach(el => el.textContent = "0");
  document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("in-cart"));
  const btn = document.getElementById("place-order-btn");
  btn.disabled = true;
  btn.textContent = "🛒 Order Now";
  updateCartBar();
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}
function escHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
