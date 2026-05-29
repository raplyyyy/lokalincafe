// ── Product Lists ─────────────────────────────────────────────────────────────
const PRODUCTS = {
    makanan: [
        { id: 1,  name: "NASI GORENG LOKALIN" },
        { id: 2,  name: "NASI GORENG SEAFOOD" },
        { id: 3,  name: "MIE GORENG LOKALIN" },
        { id: 4,  name: "AYAM GORENG RICA" },
        { id: 5,  name: "AYAM PALEKKO" },
        { id: 6,  name: "PARU RICA" },
        { id: 7,  name: "BEEF BLACKPEPPER" },
        { id: 8,  name: "SALTED EGG SHRIMP" },
        { id: 9,  name: "CHEESE MELT BURGER" },
        { id: 10, name: "PISANG GORENG" },
        { id: 11, name: "PISANG GORENG COKLAT" },
        { id: 12, name: "PISANG GORENG KEJU" },
        { id: 13, name: "PISANG GORENG COKLAT KEJU" },
        { id: 14, name: "CHICKEN WINGS AROMATIC" },
        { id: 15, name: "CHICKEN WINGS BBQ" },
        { id: 16, name: "FRENCH FRIES" },
        { id: 17, name: "UBI GORENG" },
        { id: 18, name: "BARONGKO" }
    ],
    minuman: [
        { id: 101, name: "AMERICANO" },
        { id: 102, name: "BANANA COFFEE" },
        { id: 103, name: "CAPPUCINO" },
        { id: 104, name: "CARAMEL COFFEE" },
        { id: 105, name: "CHOCO BANANA" },
        { id: 106, name: "CHOCOLATE" },
        { id: 107, name: "COFFEE BUTTERSCOTCH" },
        { id: 108, name: "COFFEE LATTE" },
        { id: 109, name: "COFFEE LOKALIN" },
        { id: 110, name: "COLD SWEET COFFEE" },
        { id: 111, name: "HAZELNUT COFFEE" },
        { id: 112, name: "KOPI SUSU" },
        { id: 113, name: "LEMON SQUASH" },
        { id: 114, name: "LEMON TEA" },
        { id: 115, name: "LYCHEE SQUASH" },
        { id: 116, name: "LYCHEE TEA" },
        { id: 117, name: "MARKISA SQUASH" },
        { id: 118, name: "MATCHA" },
        { id: 119, name: "MINERAL WATER" },
        { id: 120, name: "MOCHACINO" },
        { id: 121, name: "ORANGE JUICE" },
        { id: 122, name: "PANDAN COFFEE" },
        { id: 123, name: "PEACH SQUASH" },
        { id: 124, name: "PEACH TEA" },
        { id: 125, name: "RED VELVET" },
        { id: 126, name: "SUMMER PARADISE" },
        { id: 127, name: "TEA" },
        { id: 128, name: "THAI TEA" },
        { id: 129, name: "VANILLA COFFEE" },
        { id: 130, name: "SALTED CARAMEL" }
    ]
};

// ── State ─────────────────────────────────────────────────────────────────────
let currentTab = 'makanan';
// Custom products added by user
let customProducts = { makanan: [], minuman: [] };
let deletedProducts = { makanan: [], minuman: [] };
// Today's input: { makanan: { id: qty }, minuman: { id: qty } }
let todayEntries = { makanan: {}, minuman: {} };
// History arrays
let historyMakanan = [];
let historyMinuman = [];
// Price map: { 'NASI GORENG LOKALIN': 48000, ... } — diambil dari /api/menu
let priceMap = {};

// Auto-save debounce
let draftTimeout = null;

// ── Helpers ───────────────────────────────────────────────────────────────────
function allProducts(tab) {
    const combined = [...PRODUCTS[tab], ...customProducts[tab]];
    const filtered = combined.filter(p => !deletedProducts[tab].includes(p.id));
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

function todayDateKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatDateKey(key) {
    // "2026-05-29" → "29/05"
    const parts = key.split('-');
    return `${parts[2]}/${parts[1]}`;
}

function currentHistory() {
    return currentTab === 'makanan' ? historyMakanan : historyMinuman;
}

// ── Cloud API ─────────────────────────────────────────────────────────────────
async function cloudGet(key) {
    try {
        const res = await fetch(`/api/sales/${key}`);
        if (res.ok) return await res.json();
    } catch(e) {}
    return null;
}

async function cloudPost(key, data) {
    try {
        await fetch(`/api/sales/${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch(e) { console.error('cloudPost failed', key, e); }
}

// ── Draft (today's inputs) ────────────────────────────────────────────────────
function saveDraftDebounced() {
    clearTimeout(draftTimeout);
    draftTimeout = setTimeout(() => flushDraft(), 2000);
}

async function flushDraft() {
    clearTimeout(draftTimeout);
    draftTimeout = null;

    // Hitung omzet hari ini dari qty × harga (menggunakan priceMap dari /api/menu)
    let todayOmzet = 0;
    for (const tab of ['makanan', 'minuman']) {
        const products = allProducts(tab);
        const entries = todayEntries[tab] || {};
        for (const [id, qty] of Object.entries(entries)) {
            if (!qty) continue;
            const product = products.find(p => String(p.id) === String(id));
            if (!product) continue;
            // Cari harga dari priceMap menggunakan nama produk (case-insensitive)
            const priceKey = Object.keys(priceMap).find(k =>
                k.toLowerCase() === product.name.toLowerCase()
            );
            const price = priceKey ? priceMap[priceKey] : 0;
            todayOmzet += qty * price;
        }
    }

    const payload = { todayEntries, customProducts, deletedProducts, todayOmzet };
    localStorage.setItem('lokalin_sales_draft', JSON.stringify(payload));
    await cloudPost('draft', payload);
}

async function loadDraft() {
    const cloud = await cloudGet('draft');
    if (cloud && cloud.todayEntries) {
        todayEntries = cloud.todayEntries;
        if (cloud.customProducts) customProducts = cloud.customProducts;
        if (cloud.deletedProducts) deletedProducts = cloud.deletedProducts;
        return;
    }
    // Fallback local
    const local = localStorage.getItem('lokalin_sales_draft');
    if (local) {
        try {
            const d = JSON.parse(local);
            if (d.todayEntries) todayEntries = d.todayEntries;
            if (d.customProducts) customProducts = d.customProducts;
            if (d.deletedProducts) deletedProducts = d.deletedProducts;
        } catch(e) {}
    }
}

// ── History ───────────────────────────────────────────────────────────────────
async function loadHistory(tab) {
    const cloud = await cloudGet(`history_${tab}`);
    if (Array.isArray(cloud) && cloud.length > 0) {
        if (tab === 'makanan') historyMakanan = cloud;
        else historyMinuman = cloud;
        return;
    }
    const local = localStorage.getItem(`lokalin_sales_history_${tab}`);
    if (local) {
        try {
            const arr = JSON.parse(local);
            if (Array.isArray(arr)) {
                if (tab === 'makanan') historyMakanan = arr;
                else historyMinuman = arr;
            }
        } catch(e) {}
    }
}

async function saveHistory(tab, arr) {
    localStorage.setItem(`lokalin_sales_history_${tab}`, JSON.stringify(arr));
    await cloudPost(`history_${tab}`, arr);
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderTable() {
    const products = allProducts(currentTab);

    // ── HEADER ──
    const thead = document.getElementById('salesHead');
    let headHTML = '<tr>';
    headHTML += '<th class="s-no">NO</th>';
    headHTML += '<th class="s-name">NAMA PRODUK</th>';
    headHTML += '<th class="th-today" style="min-width:90px;text-align:center;">HARI INI</th>';
    headHTML += '<th style="min-width:40px;"></th>';
    headHTML += '</tr>';
    thead.innerHTML = headHTML;

    // ── BODY ──
    const tbody = document.getElementById('salesBody');
    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--text-muted);">Belum ada produk.</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map((p, idx) => {
        const todayQty = todayEntries[currentTab]?.[p.id] || 0;

        return `
        <tr>
          <td class="s-no" style="color:var(--text-muted);font-size:0.85rem;">${idx + 1}</td>
          <td class="s-name">${p.name}</td>
          <td class="td-today">
            <input type="number" class="qty-input" data-id="${p.id}" value="${todayQty > 0 ? todayQty : ''}" placeholder="0" min="0" />
          </td>
          <td style="text-align:center;">
            <button class="icon-btn-del del-product-btn" data-id="${p.id}" title="Hapus produk">🗑</button>
          </td>
        </tr>`;
    }).join('');

    attachListeners();
}


function attachListeners() {
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('input', e => {
            const id = parseInt(e.target.getAttribute('data-id'));
            let val = parseInt(e.target.value);
            if (isNaN(val) || val < 0) val = 0;
            if (!todayEntries[currentTab]) todayEntries[currentTab] = {};
            todayEntries[currentTab][id] = val;
            saveDraftDebounced();
        });
    });

    document.querySelectorAll('.del-product-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            const isCustom = customProducts[currentTab].some(p => p.id === id);
            
            showConfirm(
                'Hapus Produk?',
                'Yakin ingin menghapus produk ini dari daftar?',
                'Hapus',
                '#fc8181',
                () => {
                    if (isCustom) {
                        customProducts[currentTab] = customProducts[currentTab].filter(p => p.id !== id);
                    } else {
                        deletedProducts[currentTab].push(id);
                    }
                    delete todayEntries[currentTab]?.[id];
                    flushDraft();
                    renderTable();
                }
            );
        });
    });
}

// ── Tab Switch ────────────────────────────────────────────────────────────────
window.switchTab = function(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach((btn, i) => {
        btn.classList.toggle('active', (i === 0 && tab === 'makanan') || (i === 1 && tab === 'minuman'));
    });
    document.getElementById('add-title').textContent = tab === 'makanan'
        ? '+ Tambah Produk Makanan' : '+ Tambah Produk Minuman';
    renderTable();
};

// ── Add Product ───────────────────────────────────────────────────────────────
window.addProduct = function() {
    const name = document.getElementById('inp-name').value.trim().toUpperCase();
    if (!name) { alert('Nama produk tidak boleh kosong.'); return; }
    const newId = Date.now();
    customProducts[currentTab].push({ id: newId, name });
    document.getElementById('inp-name').value = '';
    flushDraft();
    renderTable();
};

// ── Tutup Hari ────────────────────────────────────────────────────────────────
document.getElementById('closeDayBtn').addEventListener('click', async () => {
    showConfirm(
        'Tutup Hari (Closing)',
        'Tutup Hari untuk SEMUA tab (Makanan & Minuman)?\n\nData penjualan hari ini akan disimpan ke Riwayat dan input akan dikosongkan.',
        'Tutup Hari',
        'var(--green)',
        async () => {
            const btn = document.getElementById('closeDayBtn');
            btn.disabled = true;
            btn.innerHTML = '☁️ Menyimpan...';

            // 1. Flush draft dulu
            await flushDraft();

            const dateKey = todayDateKey();
            const dateStr = new Date().toLocaleString('id-ID', {
                weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit'
            });

            // 2. Save history for both tabs
            for (const tab of ['makanan', 'minuman']) {
                const hist = tab === 'makanan' ? historyMakanan : historyMinuman;
                const entries = { ...(todayEntries[tab] || {}) };
                Object.keys(entries).forEach(k => { if (!entries[k]) delete entries[k]; });
                hist.unshift({ date: dateStr, dateKey, entries });
                await saveHistory(tab, hist);
            }

            // 3. Clear today's entries
            todayEntries = { makanan: {}, minuman: {} };
            await flushDraft();

            renderTable();
            btn.disabled = false;
            btn.innerHTML = '✅ Tutup Hari (Closing)';

            // 4. Cek apakah riwayat sudah >= 7 hari, jika iya tampilkan reminder
            const totalHistory = Math.max(historyMakanan.length, historyMinuman.length);
            if (totalHistory >= 7) {
                setTimeout(() => {
                    showWeeklyReminder(totalHistory);
                }, 300);
            } else {
                setTimeout(() => alert(`✅ Berhasil Tutup Hari!\nRekap ${dateKey} telah disinkronkan ke Cloud.`), 100);
            }
        }
    );
});

// ── Refresh ───────────────────────────────────────────────────────────────────
window.refreshSalesData = async function() {
    const btn = document.getElementById('refreshBtn');
    btn.disabled = true;
    btn.innerHTML = '⏳ Memuat...';
    try {
        await Promise.all([loadDraft(), loadHistory('makanan'), loadHistory('minuman')]);
        renderTable();
        btn.innerHTML = '✅ Berhasil!';
        btn.style.color = 'var(--green)';
        setTimeout(() => { btn.innerHTML = '🔄 Refresh Data'; btn.style.color = ''; btn.disabled = false; }, 2000);
    } catch(e) {
        btn.innerHTML = '❌ Gagal';
        btn.style.color = '#fc8181';
        setTimeout(() => { btn.innerHTML = '🔄 Refresh Data'; btn.style.color = ''; btn.disabled = false; }, 2000);
    }
};

// ── History Modal ─────────────────────────────────────────────────────────────
document.getElementById('viewHistoryBtn').addEventListener('click', () => {
    const history = currentHistory();
    document.getElementById('historyTitle').textContent =
        `🗓️ Riwayat Penjualan ${currentTab === 'makanan' ? 'Makanan' : 'Minuman'}`;

    const container = document.getElementById('historyContainer');
    if (history.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);">Belum ada riwayat rekap. Klik "Tutup Hari" untuk menyimpan.</div>`;
    } else {
        container.innerHTML = history.map(rec => {
            const products = allProducts(currentTab);
            const rows = products
                .filter(p => rec.entries?.[p.id] > 0)
                .map(p => `
                    <tr>
                        <td style="font-weight:600;color:var(--text-primary);">${p.name}</td>
                        <td style="text-align:center;font-weight:700;color:var(--accent);">${rec.entries[p.id]}</td>
                    </tr>`).join('');
            const total = Object.values(rec.entries || {}).reduce((s, v) => s + (v || 0), 0);
            return `
            <div class="history-card">
                <div class="history-date">📅 ${rec.date}</div>
                <div style="overflow-x:auto;">
                    <table class="history-table">
                        <thead><tr><th>Nama Produk</th><th style="text-align:center;">Terjual</th></tr></thead>
                        <tbody>
                            ${rows || `<tr><td colspan="2" style="color:var(--text-muted);text-align:center;padding:12px;">Tidak ada penjualan hari ini.</td></tr>`}
                            <tr style="border-top:2px solid var(--border-strong);">
                                <td style="font-weight:700;color:var(--text-primary);">TOTAL</td>
                                <td style="text-align:center;font-weight:800;color:var(--green);">${total}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>`;
        }).join('');
    }
    document.getElementById('historyModal').classList.add('show');
});

// ── Clear History ─────────────────────────────────────────────────────────────
window.clearSalesHistory = async function() {
    showConfirm(
        'Hapus Riwayat?',
        `Hapus SELURUH riwayat penjualan ${currentTab.toUpperCase()}? Data yang dihapus tidak bisa dikembalikan.`,
        'Hapus Semua',
        '#fc8181',
        async () => {
            if (currentTab === 'makanan') historyMakanan = [];
            else historyMinuman = [];
            await saveHistory(currentTab, []);
            document.getElementById('historyModal').classList.remove('show');
        }
    );
};

// ── Export Excel ──────────────────────────────────────────────────────────────
window.openExportModal = function() {
    document.getElementById('exportModal').classList.add('show');
    toggleExportInputs();
};

window.toggleExportInputs = function() {
    const val = document.getElementById('export-type').value;
    document.getElementById('export-date-group').style.display  = val === 'harian'  ? 'block' : 'none';
    document.getElementById('export-month-group').style.display = val === 'bulanan' ? 'block' : 'none';
};

window.processExportExcel = function() {
    const type = document.getElementById('export-type').value;
    const history = currentHistory();
    const products = allProducts(currentTab);
    let rows = [];
    let title = `Laporan Penjualan ${currentTab.toUpperCase()}`;

    const buildRows = (rec) => {
        products.forEach(p => {
            const qty = rec.entries?.[p.id] || 0;
            if (qty > 0) {
                rows.push({ 'Tanggal': rec.date, 'Nama Produk': p.name, 'Terjual': qty });
            }
        });
    };

    if (type === 'hari_ini') {
        title += ' - Hari Ini (Belum Ditutup)';
        products.forEach(p => {
            const qty = todayEntries[currentTab]?.[p.id] || 0;
            rows.push({ 'Nama Produk': p.name, 'Terjual': qty });
        });
    } else if (type === 'harian') {
        const dateInput = document.getElementById('export-date').value;
        if (!dateInput) return alert('Pilih tanggal terlebih dahulu!');
        const found = history.filter(h => h.dateKey === dateInput);
        if (!found.length) return alert('Tidak ada data rekap untuk tanggal tersebut.');
        found.forEach(buildRows);
        title += ` - ${dateInput}`;
    } else if (type === 'bulanan') {
        const monthInput = document.getElementById('export-month').value;
        if (!monthInput) return alert('Pilih bulan terlebih dahulu!');
        const found = history.filter(h => h.dateKey && h.dateKey.startsWith(monthInput));
        if (!found.length) return alert('Tidak ada data rekap untuk bulan tersebut.');
        found.forEach(buildRows);
        title += ` - ${monthInput}`;
    } else {
        if (!history.length) return alert('Belum ada riwayat rekap.');
        history.forEach(buildRows);
        title += ' - Semua Riwayat';
    }

    if (!rows.length) return alert('Data kosong.');
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan');
    XLSX.writeFile(wb, `${title}.xlsx`);
    document.getElementById('exportModal').classList.remove('show');
};

// ── Custom Confirm Modal ──────────────────────────────────────────────────────
let confirmCallback = null;

function showConfirm(title, message, btnText, btnColor, callback) {
    document.getElementById('confirmTitle').textContent = title || 'Konfirmasi';
    document.getElementById('confirmMessage').innerText = message;
    
    const okBtn = document.getElementById('confirmOkBtn');
    okBtn.textContent = btnText || 'Ya';
    okBtn.style.background = btnColor || 'var(--accent)';
    okBtn.style.color = '#fff';
    okBtn.style.border = 'none';
    
    confirmCallback = callback;
    document.getElementById('confirmModal').classList.add('show');
}

window.closeConfirmModal = function() {
    document.getElementById('confirmModal').classList.remove('show');
    confirmCallback = null;
};

document.getElementById('confirmOkBtn').addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    closeConfirmModal();
});

// ── Weekly Reminder Modal ─────────────────────────────────────────────────────
function showWeeklyReminder(totalDays) {
    const weeks = Math.floor(totalDays / 7);
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay show';
    overlay.id = 'weeklyReminderOverlay';
    overlay.innerHTML = `
        <div class="checkout-panel" style="max-width:440px;opacity:1!important;transform:none!important;text-align:left;">
            <div style="padding:28px 24px 0;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                    <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <div>
                        <div style="font-family:'Outfit',sans-serif;font-size:1.1rem;font-weight:800;color:var(--text-primary);">Rekap Mingguan Tersedia!</div>
                        <div style="font-size:0.8rem;color:var(--text-muted);">Riwayat sudah mencapai <strong>${totalDays} hari</strong></div>
                    </div>
                </div>
                <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.6;margin-bottom:20px;">
                    Anda sudah memiliki riwayat penjualan selama <strong style="color:var(--orange)">${totalDays} hari (±${weeks} minggu)</strong>. 
                    Disarankan untuk men-download rekap Excel terlebih dahulu agar data tetap aman dan tidak menumpuk di sistem.
                </p>
                <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:var(--radius-md);padding:12px 14px;margin-bottom:24px;font-size:0.82rem;color:var(--orange);">
                    💡 <strong>Tips:</strong> Download rekap mingguan setiap Minggu malam sebelum mulai minggu baru agar data laporan selalu bersih dan terorganisir.
                </div>
            </div>
            <div style="display:flex;gap:10px;padding:0 24px 24px;">
                <button class="btn btn-ghost" style="flex:1;" onclick="document.getElementById('weeklyReminderOverlay').remove()">Nanti Saja</button>
                <button class="btn btn-primary" style="flex:2;background:#1d6f42;" onclick="document.getElementById('weeklyReminderOverlay').remove(); openExportModal();">📊 Download Rekap Sekarang</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

// ── Load Harga dari Menu API ──────────────────────────────────────────────────
async function loadPriceMap() {
    try {
        const res = await fetch('/api/menu');
        if (!res.ok) return;
        const data = await res.json();
        priceMap = {};
        // Normalisasi: nama dari Supabase mungkin Title Case, di sales UPPERCASE
        [...(data.food || []), ...(data.drinks || [])].forEach(item => {
            if (item.name && item.price) {
                priceMap[item.name.toUpperCase()] = item.price;
                priceMap[item.name] = item.price; // simpan aslinya juga
            }
        });
    } catch(e) {
        console.warn('Gagal load price map:', e);
    }
}

// ── Init ──────────────────────────────────────────────────────────────────────
async function initSalesData() {
    await Promise.all([
        loadPriceMap(),
        loadDraft(),
        loadHistory('makanan'),
        loadHistory('minuman')
    ]);
    renderTable();
}

initSalesData();
