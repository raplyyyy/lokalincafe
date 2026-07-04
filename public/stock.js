// Data Model
let currentTab = 'kitchen';

let stockData = {
    kitchen: [
        { id: 1, name: "AYAM NASI GORENG", initial: 2, in: 0, out: 0, spoil: 0 },
        { id: 2, name: "AYAM MIE GORENG", initial: 21, in: 0, out: 0, spoil: 0 },
        { id: 3, name: "AYAM PALLEKO", initial: 5, in: 0, out: 0, spoil: 0 },
        { id: 4, name: "AYAM RICA", initial: 0, in: 0, out: 0, spoil: 0 },
        { id: 5, name: "BAKSO IKAN", initial: 9, in: 0, out: 0, spoil: 0 },
        { id: 6, name: "BAKSO SAPI", initial: 23, in: 0, out: 0, spoil: 0 },
        { id: 7, name: "BEEF BLACKPEPPER", initial: 13, in: 0, out: 0, spoil: 0 },
        { id: 8, name: "BUN BURGER", initial: 6, in: 0, out: 0, spoil: 0 },
        { id: 9, name: "CHICKEN WING", initial: 1, in: 0, out: 0, spoil: 0 },
        { id: 10, name: "CUMI NASI GORENG", initial: 12, in: 0, out: 0, spoil: 0 },
        { id: 11, name: "FRENCH FRIES", initial: 5, in: 0, out: 0, spoil: 0 },
        { id: 12, name: "MIE KUNING", initial: 10, in: 0, out: 0, spoil: 0 },
        { id: 13, name: "MIX VEGETABLE", initial: 14, in: 0, out: 0, spoil: 0 },
        { id: 14, name: "MIX VEGETABLE RICA", initial: 1, in: 0, out: 0, spoil: 0 },
        { id: 15, name: "PARU RICA", initial: 0, in: 0, out: 0, spoil: 0 },
        { id: 16, name: "PATTY BURGER", initial: 12, in: 0, out: 0, spoil: 0 },
        { id: 17, name: "PISANG KEPOK", initial: 9, in: 0, out: 0, spoil: 0 },
        { id: 18, name: "TAHU", initial: 11, in: 0, out: 0, spoil: 0 },
        { id: 19, name: "TELUR", initial: 27, in: 0, out: 0, spoil: 0 },
        { id: 20, name: "TEMPE", initial: 15, in: 0, out: 0, spoil: 0 },
        { id: 21, name: "UBI GORENG", initial: 6, in: 0, out: 0, spoil: 0 },
        { id: 22, name: "UDANG NASI GORENG", initial: 6, in: 0, out: 0, spoil: 0 },
        { id: 23, name: "UDANG TELUR ASIN", initial: 5, in: 0, out: 0, spoil: 0 },
        { id: 24, name: "SAUCE BBQ", initial: 0, in: 0, out: 0, spoil: 0 },
        { id: 25, name: "SAUCE SALTED EGG", initial: 0, in: 0, out: 0, spoil: 0 },
        { id: 26, name: "SAUCE BLACKPEPPER", initial: 0, in: 0, out: 0, spoil: 0 },
        { id: 27, name: "SAMBEL RICA", initial: 0, in: 0, out: 0, spoil: 0 },
        { id: 28, name: "SAMBEL PARU RICA", initial: 0, in: 0, out: 0, spoil: 0 },
        { id: 29, name: "SAMBEL TERASI", initial: 0, in: 0, out: 0, spoil: 0 },
        { id: 30, name: "BARONGKO", initial: 0, in: 0, out: 0, spoil: 0 },
        { id: 31, name: "Sauce Nasi Goreng", initial: 2, in: 0, out: 0, spoil: 0 }
    ],
    bar: [
        { id: 101, name: "BEANS (gr)", initial: 630, in: 0, out: 0, spoil: 0 },
        { id: 102, name: "COLD COFFEE LOKALIN (btl)", initial: 10, in: 0, out: 0, spoil: 0 },
        { id: 103, name: "COLD COFFEE BUTTERSCOTCH (btl)", initial: 10, in: 0, out: 0, spoil: 0 },
        { id: 104, name: "LIPTON TEA (pcs)", initial: 68, in: 0, out: 0, spoil: 0 },
        { id: 105, name: "VANILLA SYRUP (ml)", initial: 663, in: 0, out: 0, spoil: 0 },
        { id: 106, name: "CARAMEL SYRUP (ml)", initial: 843, in: 0, out: 0, spoil: 0 },
        { id: 107, name: "HAZELNUT SYRUP (ml)", initial: 1006, in: 0, out: 0, spoil: 0 },
        { id: 108, name: "LYCHEE SYRUP (ml)", initial: 1104, in: 0, out: 0, spoil: 0 },
        { id: 109, name: "PEACH SYRUP (ml)", initial: 1280, in: 0, out: 0, spoil: 0 },
        { id: 110, name: "LEMON SYRUP (ml)", initial: 1133, in: 0, out: 0, spoil: 0 },
        { id: 111, name: "MARKISA SYRUP (ml)", initial: 0, in: 0, out: 0, spoil: 0 },
        { id: 112, name: "PANDAN SYRUP (ml)", initial: 394, in: 0, out: 0, spoil: 0 },
        { id: 113, name: "BUTTERSCOTCH SYRUP (ml)", initial: 642, in: 0, out: 0, spoil: 0 },
        { id: 114, name: "BANANA SYRUP (ml)", initial: 361, in: 0, out: 0, spoil: 0 },
        { id: 115, name: "MINT SYRUP (ml)", initial: 1144, in: 0, out: 0, spoil: 0 },
        { id: 116, name: "SODA WATER (klg)", initial: 3, in: 0, out: 0, spoil: 0 },
        { id: 117, name: "SKM (klg)", initial: 1, in: 0, out: 0, spoil: 0 },
        { id: 118, name: "FRESH MILK (ltr)", initial: 9, in: 0, out: 0, spoil: 0 },
        { id: 119, name: "MINERAL WATER (btl)", initial: 32, in: 0, out: 0, spoil: 0 },
        { id: 120, name: "BOTOL (btl)", initial: 84, in: 0, out: 0, spoil: 0 },
        { id: 121, name: "PEACH KALENG (klg)", initial: 1, in: 0, out: 0, spoil: 0 },
        { id: 122, name: "LYCHEE KALENG (klg)", initial: 0, in: 0, out: 0, spoil: 0 },
        { id: 123, name: "GULA AREN (ltr)", initial: 4556, in: 0, out: 0, spoil: 0 },
        { id: 124, name: "GULA PASIR (gr)", initial: 143, in: 0, out: 0, spoil: 0 },
        { id: 125, name: "CHOCOLATE POWDER (gr)", initial: 955, in: 0, out: 0, spoil: 0 },
        { id: 126, name: "RED VELVET POWDER (gr)", initial: 635, in: 0, out: 0, spoil: 0 },
        { id: 127, name: "MATCHA POWDER (gr)", initial: 824, in: 0, out: 0, spoil: 0 },
        { id: 128, name: "THAI TEA (gr)", initial: 409, in: 0, out: 0, spoil: 0 },
        { id: 129, name: "CREAMER NON DAIRY (gr)", initial: 1343, in: 0, out: 0, spoil: 0 },
        { id: 130, name: "ORANGE FRUIT (gr)", initial: 0, in: 0, out: 0, spoil: 0 },
        { id: 131, name: "LEMON FRUIT (gr)", initial: 2, in: 0, out: 0, spoil: 0 },
        { id: 132, name: "SALTED CARAMEL SYRUP (gr)", initial: 1132, in: 0, out: 0, spoil: 0 }
    ]
};

function getBusinessDate() {
    const d = new Date();
    if (d.getHours() < 5) d.setDate(d.getDate() - 1);
    return d;
}

// ─── Cloud Sync Initialization ────────────────────────────────────────────────
function parseTimestampSafe(ts) {
    // Fix corrupted timestamps where colons are replaced with dots (e.g. T11.16.17)
    if (!ts) return 0;
    const fixed = String(ts).replace(/T(\d{2})\.(\d{2})\.(\d{2})/, 'T$1:$2:$3');
    const ms = new Date(fixed).getTime();
    return isNaN(ms) ? 0 : ms;
}

function readLocalTab(key) {
    try {
        const str = localStorage.getItem(key);
        if (str) {
            const data = JSON.parse(str);
            // New format: { items: [...], savedAt: '...' }
            if (data && data.items && Array.isArray(data.items) && data.items.length > 0) {
                return { items: data.items, savedAt: parseTimestampSafe(data.savedAt) };
            }
            // Old format: plain array — treat as very old (savedAt=1) so cloud always wins
            if (Array.isArray(data) && data.length > 0) {
                return { items: data, savedAt: 1 };
            }
        }
    } catch (e) { }
    return null;
}

async function fetchCloudTab(url) {
    try {
        const res = await fetch(url + '?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            if (data && data.items && Array.isArray(data.items) && data.items.length > 0) {
                return { items: data.items, savedAt: parseTimestampSafe(data.savedAt) };
            }
        }
    } catch (e) { }
    return null;
}

function writeLocal(key, items, savedAt) {
    localStorage.setItem(key, JSON.stringify({ items, savedAt }));
}

async function pushToCloud(url, items, savedAt) {
    const payload = { items, savedAt };
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(() => { });
        return payload;
    } catch (e) { }
    return null;
}

async function initStockData() {
    // ── 1. Fetch cloud + local in parallel
    const [cloudKitchen, cloudBar, oldKitchen, oldBar] = await Promise.all([
        fetchCloudTab('/api/stock/data_kitchen'),
        fetchCloudTab('/api/stock/data_bar'),
        Promise.resolve(readLocalTab('lokalin_kitchen_stock_data')),
        Promise.resolve(readLocalTab('lokalin_bar_stock_data_v2'))
    ]);

    // ── 2. Resolve kitchen: newest timestamp wins.
    //    If local is newer (e.g. cloud push failed earlier), use local AND push to cloud.
    //    Old-format local data has savedAt=1 so cloud always beats it.
    function resolveTab(cloud, local, localKey, cloudUrl) {
        const cloudTs = cloud ? (cloud.savedAt || 0) : 0;
        const localTs = local ? (local.savedAt || 0) : 0;

        if (cloud && cloudTs >= localTs) {
            // Cloud is newest → use it, update local cache
            writeLocal(localKey, cloud.items, new Date().toISOString());
            return cloud.items;
        } else if (local && localTs > cloudTs) {
            // Local is strictly newer → use local, push to cloud to share with other devices
            pushToCloud(cloudUrl, local.items, new Date().toISOString());
            return local.items;
        } else if (cloud) {
            // Equal timestamp or no local → prefer cloud
            writeLocal(localKey, cloud.items, new Date().toISOString());
            return cloud.items;
        } else if (local) {
            // No cloud at all → use local, try to push
            pushToCloud(cloudUrl, local.items, new Date().toISOString());
            return local.items;
        }
        return null; // both empty → keep defaults
    }

    const kitchenItems = resolveTab(cloudKitchen, oldKitchen,
        'lokalin_kitchen_stock_data', '/api/stock/data_kitchen');
    const barItems = resolveTab(cloudBar, oldBar,
        'lokalin_bar_stock_data_v2', '/api/stock/data_bar');

    if (kitchenItems) stockData.kitchen = kitchenItems;
    if (barItems) stockData.bar = barItems;

    // ── 3. Last-resort: migrate from old combined endpoint if both are empty
    if (!kitchenItems && !barItems) {
        try {
            const res = await fetch('/api/stock/data');
            if (res.ok) {
                const old = await res.json();
                if (old.kitchen && old.kitchen.length > 0) {
                    stockData.kitchen = old.kitchen;
                    writeLocal('lokalin_kitchen_stock_data', old.kitchen, new Date().toISOString());
                    pushToCloud('/api/stock/data_kitchen', old.kitchen, new Date().toISOString());
                }
                if (old.bar && old.bar.length > 0) {
                    stockData.bar = old.bar;
                    writeLocal('lokalin_bar_stock_data_v2', old.bar, new Date().toISOString());
                    pushToCloud('/api/stock/data_bar', old.bar, new Date().toISOString());
                }
            }
        } catch (e) { }
    }

    renderTable();
}

// ── Flush on page close or hide (sendBeacon ensures delivery even during unload)
function flushOnExit() {
    clearTimeout(syncTimeout);
    const savedAt = new Date().toISOString();
    writeLocal('lokalin_kitchen_stock_data', stockData.kitchen, savedAt);
    writeLocal('lokalin_bar_stock_data_v2', stockData.bar, savedAt);
    const kitchenBlob = new Blob([JSON.stringify({ items: stockData.kitchen, savedAt })], { type: 'application/json' });
    const barBlob = new Blob([JSON.stringify({ items: stockData.bar, savedAt })], { type: 'application/json' });
    navigator.sendBeacon('/api/stock/data_kitchen', kitchenBlob);
    navigator.sendBeacon('/api/stock/data_bar', barBlob);
}

window.addEventListener('beforeunload', flushOnExit);
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        flushOnExit();
    }
});


// Elements
const tableBody = document.getElementById('stockTableBody');
const alertContainer = document.getElementById('alertContainer');
const closeDayBtn = document.getElementById('closeDayBtn');
const saveDraftBtn = document.getElementById('saveDraftBtn');
const viewHistoryBtn = document.getElementById('viewHistoryBtn');

// Utility to save to local storage and sync to cloud
let syncTimeout = null;
function saveData() {
    const tab = currentTab;
    const savedAt = new Date().toISOString();
    const items = tab === 'kitchen' ? stockData.kitchen : stockData.bar;
    const localKey = tab === 'kitchen' ? 'lokalin_kitchen_stock_data' : 'lokalin_bar_stock_data_v2';

    // Write to localStorage with timestamp
    writeLocal(localKey, items, savedAt);

    // Sync to cloud (debounced)
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(async () => {
        try {
            const url = tab === 'kitchen' ? '/api/stock/data_kitchen' : '/api/stock/data_bar';
            await pushToCloud(url, items, savedAt);
            document.getElementById('add-title').innerHTML = tab === 'kitchen'
                ? '🍳 Add Menu (Synced ☁️)'
                : '🍹 Add Menu (Synced ☁️)';
        } catch (e) { console.error('Cloud sync failed'); }
    }, 2000);
}

// Immediately flush any pending save to localStorage + cloud (bypass debounce)
async function flushSave() {
    clearTimeout(syncTimeout);
    syncTimeout = null;

    const savedAt = new Date().toISOString();
    writeLocal('lokalin_kitchen_stock_data', stockData.kitchen, savedAt);
    writeLocal('lokalin_bar_stock_data_v2', stockData.bar, savedAt);

    await Promise.all([
        pushToCloud('/api/stock/data_kitchen', stockData.kitchen, savedAt),
        pushToCloud('/api/stock/data_bar', stockData.bar, savedAt)
    ]);
}

if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', async () => {
        saveDraftBtn.disabled = true;
        const originalText = saveDraftBtn.innerHTML;
        saveDraftBtn.innerHTML = '☁️ Saving...';
        await flushSave();
        saveDraftBtn.innerHTML = '✅ Saved';
        setTimeout(() => {
            saveDraftBtn.disabled = false;
            saveDraftBtn.innerHTML = originalText;
        }, 1500);
    });
}

function calculateFinalStock(item) {
    return (item.initial || 0) + (item.in || 0) - (item.out || 0) - (item.spoil || 0);
}

function calculateExpectedBar(item) {
    return (item.initial || 0) + (item.in || 0) - (item.out || 0);
}

// Tab Switching
window.switchStockTab = function (tab) {
    currentTab = tab;
    document.querySelectorAll(".tab-btn").forEach((btn, i) => {
        btn.classList.toggle("active", (i === 0 && tab === "kitchen") || (i === 1 && tab === "bar"));
    });

    // Update title
    document.getElementById('add-title').innerHTML = tab === 'kitchen'
        ? '🍳 Add Menu to Kitchen Stock'
        : '🍹 Add Menu to Bar Stock';

    renderTable();
}

// Render Table
function renderTable() {
    const thead = document.querySelector('.stock-table thead');
    if (currentTab === 'bar') {
        thead.innerHTML = `
        <tr>
          <th>Menu Name</th>
          <th>Initial</th>
          <th>IN</th>
          <th>OUT</th>
          <th>Balance</th>
          <th class="text-center">Est. Final</th>
          <th class="text-center">Action</th>
        </tr>`;
    } else {
        thead.innerHTML = `
        <tr>
          <th>Menu Name</th>
          <th>Initial</th>
          <th>IN</th>
          <th>OUT</th>
          <th>Spoil</th>
          <th class="text-center">Final</th>
          <th class="text-center">Action</th>
        </tr>`;
    }

    tableBody.innerHTML = '';
    const currentData = stockData[currentTab];

    if (currentData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="color:var(--text-muted); padding:24px;">No items in ${currentTab} stock yet.</td></tr>`;
    }

    currentData.forEach((item, index) => {
        let barBalanceValue = item.spoil === "" || item.spoil === null || item.spoil === undefined ? "" : item.spoil;
        const expectedBar = calculateExpectedBar(item);
        const finalStock = currentTab === 'bar' ? (barBalanceValue === "" ? expectedBar : barBalanceValue) : calculateFinalStock(item);

        let stockClass = 'stock-normal';
        if (finalStock < 0) {
            stockClass = 'stock-danger';
        } else if (finalStock === 0) {
            stockClass = 'stock-warning';
        }

        const tr = document.createElement('tr');
        if (currentTab === 'bar') {
            tr.innerHTML = `
                <td class="item-name" style="font-weight:700;">${item.name}</td>
                <td><input type="number" class="initial-input" data-index="${index}" value="${item.initial}" min="0"></td>
                <td><input type="number" class="in-input" data-index="${index}" value="${item.in}" min="0"></td>
                <td><input type="number" class="out-input" data-index="${index}" value="${item.out}" min="0"></td>
                <td><input type="number" class="spoil-input" data-index="${index}" value="${barBalanceValue}" placeholder="${expectedBar}" min="0" style="background:var(--bg-card); border-color:var(--accent);" title="Actual Physical Balance. Leave empty if same as Est. Final."></td>
                <td class="text-center"><span class="stock-akhir-badge ${stockClass}" title="Estimated Final (Initial + IN - OUT)">${expectedBar}</span></td>
                <td class="text-center"><button class="icon-btn-del delete-btn" data-index="${index}" title="Delete Menu">🗑</button></td>
            `;
        } else {
            tr.innerHTML = `
                <td class="item-name" style="font-weight:700;">${item.name}</td>
                <td><input type="number" class="initial-input" data-index="${index}" value="${item.initial}" min="0"></td>
                <td><input type="number" class="in-input" data-index="${index}" value="${item.in}" min="0"></td>
                <td><input type="number" class="out-input" data-index="${index}" value="${item.out}" min="0"></td>
                <td><input type="number" class="spoil-input" data-index="${index}" value="${item.spoil}" min="0"></td>
                <td class="text-center"><span class="stock-akhir-badge ${stockClass}">${finalStock}</span></td>
                <td class="text-center"><button class="icon-btn-del delete-btn" data-index="${index}" title="Delete Menu">🗑</button></td>
            `;
        }
        tableBody.appendChild(tr);
    });

    attachInputListeners();
    checkAllAlerts();
    renderCards(); // Mobile card view
}

function renderCards() {
    const cardsEl = document.getElementById('stockCards');
    if (!cardsEl) return;
    const currentData = stockData[currentTab];

    if (currentData.length === 0) {
        cardsEl.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);">No items yet.</div>`;
        return;
    }

    cardsEl.innerHTML = currentData.map((item, index) => {
        const expectedBar = calculateExpectedBar(item);
        const finalStock = currentTab === 'bar' ? expectedBar : calculateFinalStock(item);
        let stockClass = finalStock < 0 ? 'stock-danger' : finalStock === 0 ? 'stock-warning' : 'stock-normal';
        const barBalanceValue = item.spoil === '' || item.spoil === null || item.spoil === undefined ? '' : item.spoil;

        const spoilField = currentTab === 'bar'
            ? `<div class="stock-card-field">
                <label>Physical Balance</label>
                <input type="number" class="spoil-input" data-index="${index}" value="${barBalanceValue}" placeholder="${expectedBar}" min="0" style="border-color:var(--accent);" />
               </div>`
            : `<div class="stock-card-field">
                <label>Spoil</label>
                <input type="number" class="spoil-input" data-index="${index}" value="${item.spoil}" min="0" />
               </div>`;

        return `
        <div class="stock-card">
          <div class="stock-card-header">
            <div class="stock-card-name">${item.name}</div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span class="stock-akhir-badge ${stockClass}">${finalStock}</span>
              <button class="icon-btn-del delete-btn" data-index="${index}" title="Delete">🗑</button>
            </div>
          </div>
          <div class="stock-card-grid">
            <div class="stock-card-field">
              <label>Initial</label>
              <input type="number" class="initial-input" data-index="${index}" value="${item.initial}" min="0" />
            </div>
            <div class="stock-card-field">
              <label>IN</label>
              <input type="number" class="in-input" data-index="${index}" value="${item.in}" min="0" />
            </div>
            <div class="stock-card-field">
              <label>OUT</label>
              <input type="number" class="out-input" data-index="${index}" value="${item.out}" min="0" />
            </div>
            ${spoilField}
          </div>
        </div>`;
    }).join('');

    // Reattach listeners for card inputs too
    cardsEl.querySelectorAll('.initial-input').forEach(input => {
        input.addEventListener('change', e => {
            const idx = parseInt(e.target.dataset.index);
            stockData[currentTab][idx].initial = parseFloat(e.target.value) || 0;
            saveData(); renderCards();
        });
    });
    cardsEl.querySelectorAll('.in-input').forEach(input => {
        input.addEventListener('change', e => {
            const idx = parseInt(e.target.dataset.index);
            stockData[currentTab][idx].in = parseFloat(e.target.value) || 0;
            saveData(); renderCards();
        });
    });
    cardsEl.querySelectorAll('.out-input').forEach(input => {
        input.addEventListener('change', e => {
            const idx = parseInt(e.target.dataset.index);
            stockData[currentTab][idx].out = parseFloat(e.target.value) || 0;
            saveData(); renderCards();
        });
    });
    cardsEl.querySelectorAll('.spoil-input').forEach(input => {
        input.addEventListener('change', e => {
            const idx = parseInt(e.target.dataset.index);
            const val = e.target.value === '' ? '' : parseFloat(e.target.value) || 0;
            stockData[currentTab][idx].spoil = val;
            saveData(); renderCards();
        });
    });
    cardsEl.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = parseInt(e.currentTarget.dataset.index);
            if (confirm(`Delete "${stockData[currentTab][idx].name}"?`)) {
                stockData[currentTab].splice(idx, 1);
                saveData(); renderTable();
            }
        });
    });
}

function updateRowUI(index) {
    const item = stockData[currentTab][index];
    let barBalanceValue = item.spoil === "" || item.spoil === null || item.spoil === undefined ? "" : item.spoil;
    const expectedBar = calculateExpectedBar(item);
    const finalStock = currentTab === 'bar' ? expectedBar : calculateFinalStock(item);

    const row = tableBody.querySelectorAll('tr')[index];
    if (!row) return;

    const finalStockBadge = row.querySelector('.stock-akhir-badge');
    if (finalStockBadge) {
        finalStockBadge.textContent = finalStock;

        finalStockBadge.className = 'stock-akhir-badge';
        if (finalStock < 0) {
            finalStockBadge.classList.add('stock-danger');
        } else if (finalStock === 0) {
            finalStockBadge.classList.add('stock-warning');
        } else {
            finalStockBadge.classList.add('stock-normal');
        }
    }

    if (currentTab === 'bar') {
        const spoilInput = row.querySelector('.spoil-input');
        if (spoilInput) {
            spoilInput.placeholder = expectedBar;
        }
    }
}

function checkAllAlerts() {
    alertContainer.innerHTML = '';
    stockData[currentTab].forEach(item => {
        let finalStock;
        if (currentTab === 'bar') {
            const expectedBar = calculateExpectedBar(item);
            finalStock = (item.spoil === '' || item.spoil === null || item.spoil === undefined) ? expectedBar : item.spoil;
        } else {
            finalStock = calculateFinalStock(item);
        }

        if (finalStock < 0) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert-banner';
            alertDiv.innerHTML = `
                <span>⚠️</span>
                <span>Warning: Final Stock of <strong>${item.name}</strong> (${currentTab.toUpperCase()}) is less than 0!</span>
            `;
            alertContainer.appendChild(alertDiv);
        }
    });
}

function attachInputListeners() {
    const handleInput = (e, field) => {
        let valStr = e.target.value;
        let value = parseInt(valStr);

        if (isNaN(value) || value < 0) {
            if (valStr === "") {
                value = "";
            } else {
                value = 0;
                e.target.value = 0;
            }
        }

        const index = e.target.getAttribute('data-index');
        stockData[currentTab][index][field] = value;
        saveData();
        updateRowUI(index);
        checkAllAlerts();
    };

    const handleBlur = (e, field) => {
        if (e.target.value === "") {
            if (currentTab === 'bar' && field === 'spoil') {
                // Allow empty for bar balance (defaults to expected)
            } else {
                e.target.value = 0;
                const index = e.target.getAttribute('data-index');
                stockData[currentTab][index][field] = 0;
                saveData();
                updateRowUI(index);
                checkAllAlerts();
            }
        }
    };

    const attach = (selector, field) => {
        document.querySelectorAll(selector).forEach(input => {
            input.addEventListener('input', (e) => handleInput(e, field));
            input.addEventListener('blur', (e) => handleBlur(e, field));
        });
    };

    attach('.initial-input', 'initial');
    attach('.in-input', 'in');
    attach('.out-input', 'out');
    attach('.spoil-input', 'spoil');

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.getAttribute('data-index');
            if (confirm(`Are you sure you want to delete ${stockData[currentTab][index].name}?`)) {
                stockData[currentTab].splice(index, 1);
                saveData();
                renderTable();
            }
        });
    });
}

// Add Form Handlers
window.addStockItem = function () {
    const nameInput = document.getElementById('inp-name');
    const initialInput = document.getElementById('inp-initial');
    const name = nameInput.value.trim();
    const initial = parseInt(initialInput.value) || 0;

    if (!name) {
        alert("Menu name cannot be empty.");
        return;
    }

    stockData[currentTab].push({
        id: Date.now(),
        name: name,
        initial: Math.max(0, initial),
        in: 0,
        out: 0,
        spoil: 0
    });

    saveData();
    renderTable();
    clearForm();
};

window.clearForm = function () {
    document.getElementById('inp-name').value = '';
    document.getElementById('inp-initial').value = '0';
};

// ── Add Past Stock Record ──────────────────────────────────────────────────────
window.openPastStockEntry = function () {
    const d = new Date();
    d.setDate(d.getDate() - 1); // default yesterday
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(d - tzOffset)).toISOString().slice(0, 16);
    document.getElementById('pastStockDate').value = localISOTime;
    document.getElementById('pastStockTitle').textContent = `🕰️ Add Past Stock Data (${currentTab.toUpperCase()})`;

    const thead = document.getElementById('pastStockHead');
    if (currentTab === 'bar') {
        thead.innerHTML = `<tr><th>Menu Name</th><th>Initial</th><th>IN</th><th>OUT</th><th>Balance</th><th class="text-center">Final</th></tr>`;
    } else {
        thead.innerHTML = `<tr><th>Menu Name</th><th>Initial</th><th>IN</th><th>OUT</th><th>Spoil</th><th class="text-center">Final</th></tr>`;
    }

    const tbody = document.getElementById('pastStockBody');
    const items = stockData[currentTab];

    tbody.innerHTML = items.map((item, idx) => {
        return `
        <tr>
            <td style="font-weight:700;">${item.name}</td>
            <td><input type="number" class="initial-input p-init" data-idx="${idx}" value="0" min="0" style="width:56px;padding:6px;"></td>
            <td><input type="number" class="in-input p-in" data-idx="${idx}" value="0" min="0" style="width:56px;padding:6px;"></td>
            <td><input type="number" class="out-input p-out" data-idx="${idx}" value="0" min="0" style="width:56px;padding:6px;"></td>
            <td><input type="number" class="spoil-input p-spoil" data-idx="${idx}" value="0" min="0" style="width:56px;padding:6px;"></td>
            <td class="text-center">-</td>
        </tr>`;
    }).join('');

    document.getElementById('pastStockModal').classList.add('show');
};

window.savePastStockRecord = async function () {
    const dateInput = document.getElementById('pastStockDate').value;
    if (!dateInput) return alert("Please select a date first!");

    const selectedDate = new Date(dateInput);
    const dateStr = selectedDate.toLocaleString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const items = stockData[currentTab];
    const snapshot = [];

    const rows = document.getElementById('pastStockBody').querySelectorAll('tr');
    rows.forEach((row, i) => {
        const init = parseInt(row.querySelector('.p-init').value) || 0;
        const inQty = parseInt(row.querySelector('.p-in').value) || 0;
        const outQty = parseInt(row.querySelector('.p-out').value) || 0;
        const spoil = parseInt(row.querySelector('.p-spoil').value) || 0;

        let finalStock;
        if (currentTab === 'bar') {
            finalStock = spoil; // In Bar, spoil is the actual physical balance
        } else {
            finalStock = init + inQty - outQty - spoil;
        }

        snapshot.push({
            name: items[i].name,
            initial: init,
            in: inQty,
            out: outQty,
            spoil: spoil,
            final: finalStock
        });
    });

    const btn = document.querySelector('#pastStockModal .btn-primary');
    btn.disabled = true;
    btn.innerHTML = '☁️ Saving...';

    const history = await getHistory();
    history.push({ date: dateStr, items: snapshot });

    function parseFullLocaleDate(dateStr) {
        try {
            const parts = dateStr.replace(' pukul ', ' ').replace(',', '').split(' ');
            if (parts.length < 5) return null;
            const day = parts[1].padStart(2, '0');
            const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            let month = (monthNames.indexOf(parts[2]) + 1).toString().padStart(2, '0');
            const year = parts[3];
            const time = parts[4].replace('.', ':');
            return `${year}-${month}-${day}T${time}:00`;
        } catch (e) { return null; }
    }

    history.sort((a, b) => {
        const da = parseFullLocaleDate(a.date);
        const db = parseFullLocaleDate(b.date);
        // Newest first: if both parsed, compare strings (YYYY-MM-DDTHH:mm:ss sorts correctly)
        if (da && db) return db.localeCompare(da);
        // Fallback: entries with unparseable dates go to the end
        if (da) return -1;
        if (db) return 1;
        return 0;
    });

    await saveHistory(history);

    btn.disabled = false;
    btn.innerHTML = '💾 Save Past Record';
    document.getElementById('pastStockModal').classList.remove('show');
    alert("✅ Past stock record added successfully!");

    // Refresh history modal if it's already open
    if (document.getElementById('historyModal').classList.contains('show')) {
        viewHistoryBtn.click();
    }
};

// Export Excel Logic
window.openExportModal = function () {
    document.getElementById('exportModal').classList.add('show');
    toggleExportInputs();
}

window.closeExportModal = function () {
    document.getElementById('exportModal').classList.remove('show');
}

window.toggleExportInputs = function () {
    const val = document.getElementById('export-type').value;
    document.getElementById('export-date-group').style.display = (val === 'harian') ? 'block' : 'none';
    document.getElementById('export-month-group').style.display = (val === 'bulanan') ? 'block' : 'none';
}

function parseLocaleDate(dateStr) {
    // Basic parser for "Selasa, 26 Mei 2026 pukul 01.10"
    try {
        const parts = dateStr.replace(' pukul ', ' ').replace(',', '').split(' ');
        if (parts.length < 5) return null;
        // Parts: [Selasa, 26, Mei, 2026, 01.10]
        const day = parts[1].padStart(2, '0');
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        let month = (monthNames.indexOf(parts[2]) + 1).toString().padStart(2, '0');
        const year = parts[3];
        return `${year}-${month}-${day}`;
    } catch (e) { return null; }
}

window.processExportExcel = async function () {
    const type = document.getElementById('export-type').value;
    const history = await getHistory();
    const currentData = stockData[currentTab];
    let dataToExport = [];
    let title = "Stock";

    if (type === 'hari_ini') {
        title = `Today's Recap (Not Closed) - ${currentTab.toUpperCase()}`;
        dataToExport = currentData.map(item => ({
            "Menu Name": item.name,
            "Initial": item.initial,
            "IN": item.in,
            "OUT": item.out,
            "Spoil / Physical Balance": currentTab === 'bar' && (item.spoil === "" || item.spoil == null) ? calculateExpectedBar(item) : item.spoil,
            "Final / Used": currentTab === 'bar' ? calculateExpectedBar(item) : calculateFinalStock(item)
        }));
    }
    else if (type === 'harian') {
        const dateInput = document.getElementById('export-date').value; // YYYY-MM-DD
        if (!dateInput) return alert("Please select a date first!");

        let found = history.filter(h => parseLocaleDate(h.date) === dateInput);
        if (found.length === 0) return alert("No recap data for that date.");

        title = `Daily Report ${dateInput} - ${currentTab.toUpperCase()}`;
        found.forEach(h => {
            h.items.forEach(item => {
                dataToExport.push({
                    "Recap Date": h.date,
                    "Menu Name": item.name,
                    "Initial": item.initial,
                    "IN": item.in,
                    "OUT": item.out,
                    "Spoil / Physical Balance": item.spoil,
                    "Final / Used": item.final
                });
            });
        });
    }
    else if (type === 'bulanan') {
        const monthInput = document.getElementById('export-month').value; // YYYY-MM
        if (!monthInput) return alert("Please select a month first!");

        let found = history.filter(h => {
            let parsed = parseLocaleDate(h.date);
            return parsed && parsed.startsWith(monthInput);
        });
        if (found.length === 0) return alert("No recap data for that month.");

        title = `Monthly Report ${monthInput} - ${currentTab.toUpperCase()}`;
        found.forEach(h => {
            h.items.forEach(item => {
                dataToExport.push({
                    "Recap Date": h.date,
                    "Menu Name": item.name,
                    "Initial": item.initial,
                    "IN": item.in,
                    "OUT": item.out,
                    "Spoil / Physical Balance": item.spoil,
                    "Final / Used": item.final
                });
            });
        });
    }
    else if (type === 'semua') {
        if (history.length === 0) return alert("No saved recap history yet.");
        title = `All History - ${currentTab.toUpperCase()}`;
        history.forEach(h => {
            h.items.forEach(item => {
                dataToExport.push({
                    "Recap Date": h.date,
                    "Menu Name": item.name,
                    "Initial": item.initial,
                    "IN": item.in,
                    "OUT": item.out,
                    "Spoil / Physical Balance": item.spoil,
                    "Final / Used": item.final
                });
            });
        });
    }

    if (dataToExport.length === 0) return alert("Data is empty.");

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock Report");

    // Download
    XLSX.writeFile(wb, `${title}.xlsx`);
    closeExportModal();
}

// Close Day & Recap Logic
function getHistoryLocal() {
    const key = currentTab === 'kitchen' ? 'lokalin_kitchen_stock_history' : 'lokalin_bar_stock_history';
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
}

// Read-only: fetch from cloud, fallback to local (no auto-save/migrate side effects)
async function getHistory() {
    try {
        const res = await fetch(`/api/stock/history_${currentTab}`);
        if (res.ok) {
            const cloudData = await res.json();
            if (Array.isArray(cloudData) && cloudData.length > 0) return cloudData;
        }
    } catch (e) { }
    // Fallback to local storage only (no migrate/save here to avoid race conditions)
    return getHistoryLocal();
}

async function saveHistory(historyArray) {
    const key = currentTab === 'kitchen' ? 'lokalin_kitchen_stock_history' : 'lokalin_bar_stock_history';
    localStorage.setItem(key, JSON.stringify(historyArray));
    try {
        await fetch(`/api/stock/history_${currentTab}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(historyArray)
        });
    } catch (e) { }
}

closeDayBtn.addEventListener('click', async () => {
    const confirmClose = confirm(`Are you sure you want to 'Close Day' for ${currentTab.toUpperCase()}?\n\nToday's data will be saved to Recap, then Final Stock will become Initial Stock for tomorrow, and In/Out/Spoil values will be cleared.`);
    if (!confirmClose) return;

    closeDayBtn.disabled = true;
    closeDayBtn.innerHTML = "Saving to Cloud... ☁️";

    // Pastikan semua perubahan input sudah tersimpan ke cloud sebelum tutup hari
    await flushSave();

    const history = await getHistory();
    const businessDate = getBusinessDate();
    const realDate = new Date();
    businessDate.setHours(realDate.getHours(), realDate.getMinutes(), realDate.getSeconds());

    const todayStr = businessDate.toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const snapshot = stockData[currentTab].map(item => {
        const expectedBar = calculateExpectedBar(item);
        const barBalanceNotSet = currentTab === 'bar' && (item.spoil === "" || item.spoil == null || item.spoil === 0);
        return {
            name: item.name,
            initial: item.initial,
            in: item.in,
            out: item.out,
            spoil: barBalanceNotSet ? expectedBar : item.spoil,
            final: barBalanceNotSet ? expectedBar : (currentTab === 'bar' ? item.spoil : calculateFinalStock(item))
        };
    });

    history.unshift({ date: todayStr, items: snapshot });
    await saveHistory(history);

    // Reset current stock for next day
    stockData[currentTab] = stockData[currentTab].map(item => {
        let finalStock;
        if (currentTab === 'bar') {
            const expectedBar = calculateExpectedBar(item);
            const balanceNotSet = (item.spoil === "" || item.spoil == null || item.spoil === 0);
            finalStock = balanceNotSet ? expectedBar : item.spoil;
        } else {
            finalStock = calculateFinalStock(item);
        }
        return {
            ...item,
            initial: finalStock,
            in: 0,
            out: 0,
            spoil: currentTab === 'bar' ? "" : 0
        };
    });

    const resetSavedAt = new Date().toISOString();
    const localKey = currentTab === 'kitchen' ? 'lokalin_kitchen_stock_data' : 'lokalin_bar_stock_data_v2';
    const cloudUrl = currentTab === 'kitchen' ? '/api/stock/data_kitchen' : '/api/stock/data_bar';
    writeLocal(localKey, stockData[currentTab], resetSavedAt);
    await pushToCloud(cloudUrl, stockData[currentTab], resetSavedAt);
    renderTable();
    closeDayBtn.disabled = false;
    closeDayBtn.innerHTML = "Close Day & Save Recap";
    alert(`Successfully Closed Day for ${currentTab.toUpperCase()}! Recap has been synced to Cloud.`);
});

// History Modal Logic
window.clearHistory = async function () {
    if (confirm(`Are you sure you want to delete ALL recap history for ${currentTab.toUpperCase()}? Deleted data cannot be recovered.`)) {
        const key = currentTab === 'kitchen' ? 'lokalin_kitchen_stock_history' : 'lokalin_bar_stock_history';
        localStorage.removeItem(key);
        await saveHistory([]);
        document.getElementById('historyModal').classList.remove('show');
        setTimeout(() => viewHistoryBtn.click(), 50);
        alert(`Recap history for ${currentTab.toUpperCase()} successfully cleared from Cloud!`);
    }
}

// Delete a single daily recap entry by index
window.deleteHistoryEntry = async function (index) {
    const history = await getHistory();
    if (index < 0 || index >= history.length) return;
    const entryDate = history[index].date;
    if (!confirm(`Delete recap entry "${entryDate}" for ${currentTab.toUpperCase()}?\nThis action cannot be undone.`)) return;
    history.splice(index, 1);
    await saveHistory(history);
    // Re-render the history modal
    viewHistoryBtn.click();
}

window.closeHistoryModal = function () {
    document.getElementById('historyModal').classList.remove('show');
}

viewHistoryBtn.addEventListener('click', async () => {
    const history = await getHistory();
    const container = document.getElementById('historyContainer');

    // Set Modal Title based on tab
    document.querySelector('.checkout-title').innerHTML = `🗓️ Recap History ${currentTab.toUpperCase()}`;

    if (history.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">No recap history for ${currentTab.toUpperCase()} yet. Click "Close Day & Save" to save recap.</div>`;
    } else {
        container.innerHTML = history.map((record, i) => `
            <div class="history-card">
                <div class="history-date">
                    <span>📅 ${record.date}</span>
                    <button onclick="deleteHistoryEntry(${i})" title="Delete this recap entry" style="background:rgba(229,62,62,0.15);border:1px solid rgba(229,62,62,0.35);color:#fc8181;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:700;transition:all 0.2s;" onmouseover="this.style.background='rgba(229,62,62,0.3)'" onmouseout="this.style.background='rgba(229,62,62,0.15)'">🗑️ Delete</button>
                </div>
                <div style="overflow-x: auto;">
                    <table class="history-table">
                        <thead>
                            ${currentTab === 'bar' ? `
                            <tr>
                                <th>Menu Name</th>
                                <th>Initial</th>
                                <th>IN</th>
                                <th>OUT</th>
                                <th>Balance</th>
                            </tr>` : `
                            <tr>
                                <th>Menu Name</th>
                                <th>Initial</th>
                                <th>IN</th>
                                <th>OUT</th>
                                <th>Spoil</th>
                                <th>Final</th>
                            </tr>`}
                        </thead>
                        <tbody>
                            ${record.items.map(item => `
                                <tr>
                                    <td style="font-weight:600; color:var(--text-primary);">${item.name}</td>
                                    <td style="color:var(--text-secondary);">${item.initial}</td>
                                    <td style="color:var(--green)">${item.in > 0 ? '+' + item.in : 0}</td>
                                    ${currentTab === 'bar' ? `
                                    <td style="color:var(--accent)">${item.out > 0 ? '-' + item.out : 0}</td>
                                    <td style="font-weight:700;">${item.final}</td>
                                    ` : `
                                    <td style="color:var(--accent)">${item.out > 0 ? '-' + item.out : 0}</td>
                                    <td style="color:#fc8181">${item.spoil > 0 ? item.spoil : 0}</td>
                                    <td style="color:var(--text-primary); font-weight:700;">${item.final}</td>
                                    `}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `).join('');
    }

    document.getElementById('historyModal').classList.add('show');
});

// Refresh Data dari Cloud
window.refreshStockData = async function () {
    const btn = document.getElementById('refreshDataBtn');
    if (!btn) return;

    btn.disabled = true;
    btn.innerHTML = '⏳ Loading...';

    try {
        const [resK, resB] = await Promise.all([
            fetch('/api/stock/data_kitchen?t=' + Date.now(), { cache: 'no-store' }),
            fetch('/api/stock/data_bar?t=' + Date.now(), { cache: 'no-store' })
        ]);

        let success = false;

        if (resK.ok) {
            const cloudKitchen = await resK.json();
            const kitchenItems = Array.isArray(cloudKitchen) ? cloudKitchen : (cloudKitchen?.items || null);
            if (Array.isArray(kitchenItems) && kitchenItems.length > 0) {
                stockData.kitchen = kitchenItems;
                writeLocal('lokalin_kitchen_stock_data', kitchenItems, cloudKitchen?.savedAt || new Date().toISOString());
                success = true;
            }
        }
        if (resB.ok) {
            const cloudBar = await resB.json();
            const barItems = Array.isArray(cloudBar) ? cloudBar : (cloudBar?.items || null);
            if (Array.isArray(barItems) && barItems.length > 0) {
                stockData.bar = barItems;
                writeLocal('lokalin_bar_stock_data_v2', barItems, cloudBar?.savedAt || new Date().toISOString());
                success = true;
            }
        }

        if (!success) throw new Error('No valid data from cloud');

        renderTable();
        btn.innerHTML = '✅ Success!';
        btn.style.color = 'var(--green)';
        setTimeout(() => {
            btn.innerHTML = '🔄 Refresh Data';
            btn.style.color = '';
            btn.disabled = false;
        }, 2000);
    } catch (e) {
        btn.innerHTML = '❌ Failed';
        btn.style.color = '#fc8181';
        setTimeout(() => {
            btn.innerHTML = '🔄 Refresh Data';
            btn.style.color = '';
            btn.disabled = false;
        }, 2000);
    }
};

// Initialize
initStockData();

if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', async () => {
        const originalText = saveDraftBtn.innerHTML;
        saveDraftBtn.innerHTML = "☁️ Saving...";
        saveDraftBtn.disabled = true;

        await flushSave();

        saveDraftBtn.innerHTML = "✅ Saved!";
        saveDraftBtn.style.background = "var(--green)";
        saveDraftBtn.style.color = "#fff";
        saveDraftBtn.disabled = false;

        setTimeout(() => {
            saveDraftBtn.innerHTML = originalText;
            saveDraftBtn.style.background = "transparent";
            saveDraftBtn.style.color = "var(--accent)";
        }, 2000);
    });
}
