const fs = require('fs');

let code = fs.readFileSync('public/stock.js.trimmed', 'utf8');

// Replace sync init
code = code.replace(/\/\/ Cloud Sync Initialization[\s\S]*?\/\/ Elements/, `// ─── Cloud Sync Initialization ────────────────────────────────────────────────
async function readLocalTab(key) {
    try {
        const str = localStorage.getItem(key);
        if (str) {
            const data = JSON.parse(str);
            if (data && data.items && Array.isArray(data.items) && data.items.length > 0) {
                return { items: data.items, savedAt: new Date(data.savedAt || 0).getTime() };
            }
        }
    } catch(e) {}
    return null;
}

async function fetchCloudTab(url) {
    try {
        const res = await fetch(url + '?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            if (data.items && Array.isArray(data.items) && data.items.length > 0) {
                return { items: data.items, savedAt: new Date(data.savedAt || 0).getTime() };
            }
        }
    } catch (e) {}
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
        }).catch(() => {});
        return payload;
    } catch(e) {}
    return null;
}

async function initStockData() {
    let oldKitchen = await readLocalTab('lokalin_kitchen_stock_data');
    let oldBar = await readLocalTab('lokalin_bar_stock_data_v2');

    const [cloudKitchen, cloudBar] = await Promise.all([
        fetchCloudTab('/api/stock/data_kitchen'),
        fetchCloudTab('/api/stock/data_bar')
    ]);

    if (cloudKitchen && cloudKitchen.savedAt > (oldKitchen ? oldKitchen.savedAt : 0)) {
        stockData.kitchen = cloudKitchen.items;
        writeLocal('lokalin_kitchen_stock_data', cloudKitchen.items, new Date(cloudKitchen.savedAt).toISOString());
    } else if (oldKitchen) {
        stockData.kitchen = oldKitchen.items;
        pushToCloud('/api/stock/data_kitchen', oldKitchen.items, new Date(oldKitchen.savedAt).toISOString());
    }

    if (cloudBar && cloudBar.savedAt > (oldBar ? oldBar.savedAt : 0)) {
        stockData.bar = cloudBar.items;
        writeLocal('lokalin_bar_stock_data_v2', cloudBar.items, new Date(cloudBar.savedAt).toISOString());
    } else if (oldBar) {
        stockData.bar = oldBar.items;
        pushToCloud('/api/stock/data_bar', oldBar.items, new Date(oldBar.savedAt).toISOString());
    }

    // Try fallback migration from old /api/stock/data if both are empty
    if (!cloudKitchen && !oldKitchen && !cloudBar && !oldBar) {
        try {
            const res = await fetch('/api/stock/data');
            if (res.ok) {
                const old = await res.json();
                if (old.kitchen && old.kitchen.length > 0) {
                    stockData.kitchen = old.kitchen;
                    writeLocal('lokalin_kitchen_stock_data', old.kitchen, new Date().toISOString());
                }
                if (old.bar && old.bar.length > 0) {
                    stockData.bar = old.bar;
                    writeLocal('lokalin_bar_stock_data_v2', old.bar, new Date().toISOString());
                }
            }
        } catch(e) {}
    }

    renderTable();
}

// Elements`);

// Replace save Data
code = code.replace(/\/\/ Utility to save to local storage and sync to cloud[\s\S]*?function calculateFinalStock/, `// Utility to save to local storage and sync to cloud
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
        } catch(e) { console.error('Cloud sync failed'); }
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

function calculateFinalStock`);

// Replace refreshStockData
code = code.replace(/\/\/ Refresh Data dari Cloud[\s\S]*?\/\/ Initialize/, `// Refresh Data dari Cloud
window.refreshStockData = async function() {
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

// Initialize`);

fs.writeFileSync('public/stock.js', code);
console.log('stock.js rewritten successfully');
