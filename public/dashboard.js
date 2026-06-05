// ── Greeting & Date ──────────────────────────────────────────────────────────
(function initGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const greet = hour < 11 ? 'Good Morning' : hour < 15 ? 'Good Afternoon' : hour < 18 ? 'Good Evening' : 'Good Night';
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('greetText').textContent = `${greet}, Lokalin! ☕`;
    document.getElementById('dateText').textContent = dateStr;
})();

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtRp(n) {
    if (n >= 1_000_000) return 'Rp ' + (n / 1_000_000).toFixed(1) + 'jt';
    if (n >= 1_000)     return 'Rp ' + Math.round(n / 1_000) + 'rb';
    return 'Rp ' + n;
}

function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ── Fetch with fallback ───────────────────────────────────────────────────────
async function fetchJSON(url) {
    try {
        const res = await fetch(url);
        if (res.ok) return await res.json();
    } catch(e) {}
    return null;
}

// ── Load Today's Report ───────────────────────────────────────────────────────
async function loadTodayReport() {
    // Ambil total order dari API (dari paid orders Supabase)
    const data = await fetchJSON('/api/reports/today');
    if (data && data.success) {
        setEl('stat-orders', data.totalOrders ?? 0);
    } else {
        setEl('stat-orders', '—');
    }

    // Ambil omzet dari Sales Draft (input laporan penjualan manual)
    const draft = await fetchJSON('/api/sales/draft');
    if (draft && typeof draft.todayOmzet === 'number' && draft.todayOmzet > 0) {
        setEl('stat-revenue', fmtRp(draft.todayOmzet));
    } else if (data && data.success && data.totalRevenue > 0) {
        // Fallback ke omzet dari paid orders jika sales draft belum ada data
        setEl('stat-revenue', fmtRp(data.totalRevenue));
    } else {
        setEl('stat-revenue', 'Rp 0');
    }
}

// ── Load Active Orders ────────────────────────────────────────────────────────
async function loadActiveOrders() {
    const list = await fetchJSON('/api/orders/active');
    setEl('stat-active', Array.isArray(list) ? list.length : '—');

    const container = document.getElementById('active-orders-list');
    if (!Array.isArray(list) || list.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:20px 0;color:var(--text-muted);font-size:0.85rem;">No active orders currently.</div>`;
        return;
    }

    container.innerHTML = list.map(o => {
        const allItems = [...(o.foodItems || []), ...(o.drinkItems || [])];
        const itemsText = allItems.slice(0, 3).map(i => `${i.name}${i.qty > 1 ? ' ×'+i.qty : ''}`).join(', ')
            + (allItems.length > 3 ? ` +${allItems.length - 3} more` : '');
        const dotClass = o.drinkStatus === 'ready' ? 'dot-ready' : o.drinkStatus === 'in-progress' ? 'dot-progress' : 'dot-pending';
        const time = new Date(o.timestamp).toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
        return `
        <div class="order-item">
            <div class="order-table">M${o.tableNumber}</div>
            <div class="order-items-list">${itemsText || '—'}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">${time}</div>
            <div class="order-status-dot ${dotClass}" title="${o.drinkStatus}"></div>
        </div>`;
    }).join('');
}

// ── Load Stock Alerts ─────────────────────────────────────────────────────────
async function loadStockAlerts() {
    const container = document.getElementById('stock-alert-list');
    const data = await fetchJSON('/api/stock/data');

    if (!data || (!Array.isArray(data.kitchen) && !Array.isArray(data.bar))) {
        container.innerHTML = `<div style="text-align:center;padding:20px 0;color:var(--text-muted);font-size:0.85rem;">Cannot load stock.</div>`;
        return;
    }

    const alerts = [];
    const calcFinal = item => (item.initial || 0) + (item.in || 0) - (item.out || 0) - (item.spoil || 0);

    [...(data.kitchen || []), ...(data.bar || [])].forEach(item => {
        const final = calcFinal(item);
        if (final <= 0) alerts.push({ name: item.name, final, danger: final < 0 });
    });

    setEl('stat-critical', alerts.length);

    if (alerts.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:20px 0;color:var(--green);font-size:0.85rem;font-weight:600;">✅ All stock is safe!</div>`;
        return;
    }

    container.innerHTML = alerts.slice(0, 8).map(a => `
        <div class="alert-item">
            <span class="alert-name">${a.name}</span>
            <span class="alert-badge ${a.danger ? 'badge-danger' : 'badge-warning'}">${a.final}</span>
        </div>`).join('');

    if (alerts.length > 8) {
        container.innerHTML += `<div style="text-align:center;padding:8px 0;font-size:0.8rem;color:var(--text-muted);">+${alerts.length - 8} more items → <a href="/stock" style="color:var(--accent);">View Stock</a></div>`;
    }
}

// ── Load Today's Sales ────────────────────────────────────────────────────────
async function loadTodaySales() {
    const container = document.getElementById('sales-today-list');
    const draft = await fetchJSON('/api/sales/draft');

    if (!draft || !draft.todayEntries) {
        container.innerHTML = `<div style="text-align:center;padding:20px 0;color:var(--text-muted);font-size:0.85rem;">No sales input today.</div>`;
        return;
    }

    // Combine makanan + minuman entries
    const allEntries = { ...draft.todayEntries.makanan, ...draft.todayEntries.minuman };
    const sorted = Object.entries(allEntries)
        .filter(([, qty]) => qty > 0)
        .sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:20px 0;color:var(--text-muted);font-size:0.85rem;">No sales input today.</div>`;
        return;
    }

    // Need product names — build a map from PRODUCTS
    const PRODUCT_MAP = {};
    const makanan = [
        [1,"NASI GORENG LOKALIN"],[2,"NASI GORENG SEAFOOD"],[3,"MIE GORENG LOKALIN"],
        [4,"AYAM GORENG RICA"],[5,"AYAM PALEKKO"],[6,"PARU RICA"],[7,"BEEF BLACKPEPPER"],
        [8,"SALTED EGG SHRIMP"],[9,"CHEESE MELT BURGER"],[10,"PISANG GORENG"],
        [11,"PISANG GORENG COKLAT"],[12,"PISANG GORENG KEJU"],[13,"PISANG GORENG COKLAT KEJU"],
        [14,"CHICKEN WINGS AROMATIC"],[15,"CHICKEN WINGS BBQ"],[16,"FRENCH FRIES"],
        [17,"UBI GORENG"],[18,"BARONGKO"]
    ];
    const minuman = [
        [101,"AMERICANO"],[102,"BANANA COFFEE"],[103,"CAPPUCINO"],[104,"CARAMEL COFFEE"],
        [105,"CHOCO BANANA"],[106,"CHOCOLATE"],[107,"COFFEE BUTTERSCOTCH"],[108,"COFFEE LATTE"],
        [109,"COFFEE LOKALIN"],[110,"COLD SWEET COFFEE"],[111,"HAZELNUT COFFEE"],[112,"KOPI SUSU"],
        [113,"LEMON SQUASH"],[114,"LEMON TEA"],[115,"LYCHEE SQUASH"],[116,"LYCHEE TEA"],
        [117,"MARKISA SQUASH"],[118,"MATCHA"],[119,"MINERAL WATER"],[120,"MOCHACINO"],
        [121,"ORANGE JUICE"],[122,"PANDAN COFFEE"],[123,"PEACH SQUASH"],[124,"PEACH TEA"],
        [125,"RED VELVET"],[126,"SUMMER PARADISE"],[127,"TEA"],[128,"THAI TEA"],
        [129,"VANILLA COFFEE"],[130,"SALTED CARAMEL"]
    ];
    [...makanan, ...minuman].forEach(([id, name]) => { PRODUCT_MAP[id] = name; });
    // Also check custom products
    if (draft.customProducts) {
        [...(draft.customProducts.makanan || []), ...(draft.customProducts.minuman || [])].forEach(p => {
            PRODUCT_MAP[p.id] = p.name;
        });
    }

    const totalSold = sorted.reduce((s, [, q]) => s + q, 0);
    const rows = sorted.slice(0, 8).map(([id, qty]) => `
        <div class="sales-item">
            <span class="sales-item-name">${PRODUCT_MAP[id] || 'Product #' + id}</span>
            <span class="sales-item-qty">${qty}</span>
        </div>`).join('');

    container.innerHTML = rows;
    if (sorted.length > 8) {
        container.innerHTML += `<div style="text-align:center;padding:8px 0;font-size:0.8rem;color:var(--text-muted);">+${sorted.length - 8} more items → <a href="/sales" style="color:var(--accent);">View All</a></div>`;
    }
    container.innerHTML += `<div style="padding-top:10px;border-top:1px solid var(--border);font-size:0.85rem;font-weight:700;color:var(--text-secondary);">Total sold: <span style="color:var(--accent)">${totalSold} items</span></div>`;
}

// ── Chart Penjualan ─────────────────────────────────────────────────────────────
let salesChartInstance = null;

async function loadChartData() {
    const [histMak, histMin] = await Promise.all([
        fetchJSON('/api/sales/history_makanan'),
        fetchJSON('/api/sales/history_minuman')
    ]);
    
    const arrMak = Array.isArray(histMak) ? histMak : [];
    const arrMin = Array.isArray(histMin) ? histMin : [];
    
    const totalsByDate = {};
    
    [...arrMak, ...arrMin].forEach(record => {
        if (!record || !record.dateKey || !record.entries) return;
        const totalQty = Object.values(record.entries).reduce((sum, qty) => sum + (qty || 0), 0);
        if (!totalsByDate[record.dateKey]) totalsByDate[record.dateKey] = 0;
        totalsByDate[record.dateKey] += totalQty;
    });
    
    const sortedDates = Object.keys(totalsByDate).sort();
    const last7Dates = sortedDates.slice(-7);
    
    const chartLabels = last7Dates.map(d => {
        const parts = d.split('-'); // 2026-05-29 -> 29/05
        return `${parts[2]}/${parts[1]}`;
    });
    const chartData = last7Dates.map(d => totalsByDate[d]);
    
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    if (salesChartInstance) salesChartInstance.destroy();
    
    salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels.length ? chartLabels : ['Empty'],
            datasets: [{
                label: 'Items Sold',
                data: chartData.length ? chartData : [0],
                borderColor: '#ff725e',
                backgroundColor: 'rgba(255, 114, 94, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#ff725e',
                pointBorderColor: '#fff',
                pointRadius: 4,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(11, 13, 22, 0.95)',
                    titleFont: { family: 'Outfit', size: 13 },
                    bodyFont: { family: 'Outfit', size: 15, weight: 'bold' },
                    padding: 12,
                    cornerRadius: 12,
                    displayColors: false
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false }, 
                    ticks: { color: 'rgba(255, 255, 255, 0.4)', padding: 10, stepSize: 5 } 
                },
                x: { 
                    grid: { display: false }, 
                    ticks: { color: 'rgba(255, 255, 255, 0.5)', padding: 10 } 
                }
            }
        }
    });
}

// ── Load All ──────────────────────────────────────────────────────────────────
async function loadAll() {
    const btn = document.getElementById('refreshTopBtn');
    if (btn) { btn.textContent = '⏳'; btn.disabled = true; }

    await Promise.all([
        loadTodayReport(),
        loadActiveOrders(),
        loadStockAlerts(),
        loadTodaySales(),
        loadChartData()
    ]);

    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setEl('lastUpdated', `Last updated: ${now}`);
    if (btn) { btn.textContent = '🔄 Refresh'; btn.disabled = false; }
}

// ── Auto Refresh every 30s ────────────────────────────────────────────────────
loadAll();
setInterval(loadAll, 30_000);
