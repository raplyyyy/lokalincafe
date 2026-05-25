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

// Load from local storage if available
const savedKitchen = localStorage.getItem('lokalin_kitchen_stock_data');
if (savedKitchen) {
    try {
        const parsed = JSON.parse(savedKitchen);
        if(Array.isArray(parsed) && parsed.length > 0) stockData.kitchen = parsed;
    } catch (e) { console.error("Failed to parse kitchen data"); }
}

const savedBar = localStorage.getItem('lokalin_bar_stock_data_v2');
if (savedBar) {
    try {
        const parsed = JSON.parse(savedBar);
        if(Array.isArray(parsed) && parsed.length > 0) stockData.bar = parsed;
    } catch (e) { console.error("Failed to parse bar data"); }
}

// Elements
const tableBody = document.getElementById('stockTableBody');
const alertContainer = document.getElementById('alertContainer');
const closeDayBtn = document.getElementById('closeDayBtn');
const saveDraftBtn = document.getElementById('saveDraftBtn');
const viewHistoryBtn = document.getElementById('viewHistoryBtn');

// Utility to save to local storage
function saveData() {
    if (currentTab === 'kitchen') {
        localStorage.setItem('lokalin_kitchen_stock_data', JSON.stringify(stockData.kitchen));
    } else {
        localStorage.setItem('lokalin_bar_stock_data_v2', JSON.stringify(stockData.bar));
    }
}

function calculateFinalStock(item) {
    return (item.initial || 0) + (item.in || 0) - (item.out || 0) - (item.spoil || 0);
}

function calculateExpectedBar(item) {
    return (item.initial || 0) + (item.in || 0) - (item.out || 0);
}

// Tab Switching
window.switchStockTab = function(tab) {
    currentTab = tab;
    document.querySelectorAll(".tab-btn").forEach((btn, i) => {
        btn.classList.toggle("active", (i === 0 && tab === "kitchen") || (i === 1 && tab === "bar"));
    });
    
    // Update title
    document.getElementById('add-title').innerHTML = tab === 'kitchen' 
        ? '🍳 Tambah Menu ke Stok Kitchen' 
        : '🍹 Tambah Menu ke Stok Bar';
        
    renderTable();
}

// Render Table
function renderTable() {
    const thead = document.querySelector('.stock-table thead');
    if (currentTab === 'bar') {
        thead.innerHTML = `
        <tr>
          <th>Nama Menu</th>
          <th>Awal</th>
          <th>IN</th>
          <th>OUT</th>
          <th>Sisa (Balance)</th>
          <th class="text-center">Est. Akhir</th>
          <th class="text-center">Aksi</th>
        </tr>`;
    } else {
        thead.innerHTML = `
        <tr>
          <th>Nama Menu</th>
          <th>Awal</th>
          <th>IN</th>
          <th>OUT</th>
          <th>Spoil</th>
          <th class="text-center">Akhir</th>
          <th class="text-center">Aksi</th>
        </tr>`;
    }

    tableBody.innerHTML = '';
    const currentData = stockData[currentTab];
    
    if (currentData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="color:var(--text-muted); padding:24px;">Belum ada item di stok ${currentTab}.</td></tr>`;
    }

    currentData.forEach((item, index) => {
        const finalStock = currentTab === 'bar' ? calculateExpectedBar(item) : calculateFinalStock(item);
        
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
                <td><input type="number" class="spoil-input" data-index="${index}" value="${item.spoil}" min="0" style="background:var(--bg-card); border-color:var(--accent);" title="Sisa Fisik Aktual"></td>
                <td class="text-center"><span class="stock-akhir-badge ${stockClass}" title="Estimasi Akhir (Awal + IN - OUT)">${finalStock}</span></td>
                <td class="text-center"><button class="icon-btn-del delete-btn" data-index="${index}" title="Hapus Menu">🗑</button></td>
            `;
        } else {
            tr.innerHTML = `
                <td class="item-name" style="font-weight:700;">${item.name}</td>
                <td><input type="number" class="initial-input" data-index="${index}" value="${item.initial}" min="0"></td>
                <td><input type="number" class="in-input" data-index="${index}" value="${item.in}" min="0"></td>
                <td><input type="number" class="out-input" data-index="${index}" value="${item.out}" min="0"></td>
                <td><input type="number" class="spoil-input" data-index="${index}" value="${item.spoil}" min="0"></td>
                <td class="text-center"><span class="stock-akhir-badge ${stockClass}">${finalStock}</span></td>
                <td class="text-center"><button class="icon-btn-del delete-btn" data-index="${index}" title="Hapus Menu">🗑</button></td>
            `;
        }
        tableBody.appendChild(tr);
    });

    attachInputListeners();
    checkAllAlerts();
}

function updateRowUI(index) {
    const item = stockData[currentTab][index];
    const finalStock = currentTab === 'bar' ? calculateExpectedBar(item) : calculateFinalStock(item);
    
    const row = tableBody.querySelectorAll('tr')[index];
    if (!row) return; 
    
    const finalStockBadge = row.querySelector('.stock-akhir-badge');
    if (!finalStockBadge) return;
    
    finalStockBadge.textContent = finalStock;
    
    // Update classes
    finalStockBadge.className = 'stock-akhir-badge';
    if (finalStock < 0) {
        finalStockBadge.classList.add('stock-danger');
    } else if (finalStock === 0) {
        finalStockBadge.classList.add('stock-warning');
    } else {
        finalStockBadge.classList.add('stock-normal');
    }
}

function checkAllAlerts() {
    alertContainer.innerHTML = '';
    stockData[currentTab].forEach(item => {
        const finalStock = calculateFinalStock(item);
        if (finalStock < 0) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert-banner';
            alertDiv.innerHTML = `
                <span>⚠️</span>
                <span>Peringatan: Stok Akhir <strong>${item.name}</strong> (${currentTab.toUpperCase()}) kurang dari 0!</span>
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
                value = 0; 
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
            e.target.value = 0;
            const index = e.target.getAttribute('data-index');
            stockData[currentTab][index][field] = 0;
            saveData();
            updateRowUI(index);
            checkAllAlerts();
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
            if(confirm(`Apakah Anda yakin ingin menghapus ${stockData[currentTab][index].name}?`)) {
                stockData[currentTab].splice(index, 1);
                saveData();
                renderTable(); 
            }
        });
    });
}

// Add Form Handlers
window.addStockItem = function() {
    const nameInput = document.getElementById('inp-name');
    const initialInput = document.getElementById('inp-initial');
    
    const name = nameInput.value.trim();
    const initial = parseInt(initialInput.value) || 0;
    
    if (!name) {
        alert("Nama menu tidak boleh kosong.");
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

window.clearForm = function() {
    document.getElementById('inp-name').value = '';
    document.getElementById('inp-initial').value = '0';
};

// Export Excel Logic
window.openExportModal = function() {
    document.getElementById('exportModal').classList.add('show');
    toggleExportInputs();
}

window.closeExportModal = function() {
    document.getElementById('exportModal').classList.remove('show');
}

window.toggleExportInputs = function() {
    const val = document.getElementById('export-type').value;
    document.getElementById('export-date-group').style.display = (val === 'harian') ? 'block' : 'none';
    document.getElementById('export-month-group').style.display = (val === 'bulanan') ? 'block' : 'none';
}

function parseLocaleDate(dateStr) {
    // Basic parser for "Selasa, 26 Mei 2026 pukul 01.10"
    try {
        const parts = dateStr.replace(' pukul ', ' ').replace(',', '').split(' ');
        if(parts.length < 5) return null;
        // Parts: [Selasa, 26, Mei, 2026, 01.10]
        const day = parts[1].padStart(2, '0');
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        let month = (monthNames.indexOf(parts[2]) + 1).toString().padStart(2, '0');
        const year = parts[3];
        return `${year}-${month}-${day}`;
    } catch(e) { return null; }
}

window.processExportExcel = function() {
    const type = document.getElementById('export-type').value;
    const history = getHistory();
    const currentData = stockData[currentTab];
    let dataToExport = [];
    let title = "Stok";

    if (type === 'hari_ini') {
        title = `Rekap Hari Ini (Belum Ditutup) - ${currentTab.toUpperCase()}`;
        dataToExport = currentData.map(item => ({
            "Nama Menu": item.name,
            "Awal": item.initial,
            "IN": item.in,
            "OUT": item.out,
            "Spoil / Sisa Fisik": item.spoil,
            "Akhir / Terpakai": currentTab === 'bar' ? calculateExpectedBar(item) : calculateFinalStock(item)
        }));
    } 
    else if (type === 'harian') {
        const dateInput = document.getElementById('export-date').value; // YYYY-MM-DD
        if (!dateInput) return alert("Pilih tanggal terlebih dahulu!");
        
        let found = history.filter(h => parseLocaleDate(h.date) === dateInput);
        if (found.length === 0) return alert("Tidak ada data rekap untuk tanggal tersebut.");
        
        title = `Laporan Harian ${dateInput} - ${currentTab.toUpperCase()}`;
        found.forEach(h => {
            h.items.forEach(item => {
                dataToExport.push({
                    "Tanggal Rekap": h.date,
                    "Nama Menu": item.name,
                    "Awal": item.initial,
                    "IN": item.in,
                    "OUT": item.out,
                    "Spoil / Sisa Fisik": item.spoil,
                    "Akhir / Terpakai": item.final
                });
            });
        });
    }
    else if (type === 'bulanan') {
        const monthInput = document.getElementById('export-month').value; // YYYY-MM
        if (!monthInput) return alert("Pilih bulan terlebih dahulu!");
        
        let found = history.filter(h => {
            let parsed = parseLocaleDate(h.date);
            return parsed && parsed.startsWith(monthInput);
        });
        if (found.length === 0) return alert("Tidak ada data rekap untuk bulan tersebut.");
        
        title = `Laporan Bulanan ${monthInput} - ${currentTab.toUpperCase()}`;
        found.forEach(h => {
            h.items.forEach(item => {
                dataToExport.push({
                    "Tanggal Rekap": h.date,
                    "Nama Menu": item.name,
                    "Awal": item.initial,
                    "IN": item.in,
                    "OUT": item.out,
                    "Spoil / Sisa Fisik": item.spoil,
                    "Akhir / Terpakai": item.final
                });
            });
        });
    }
    else if (type === 'semua') {
        if (history.length === 0) return alert("Belum ada riwayat rekap yang tersimpan.");
        title = `Semua Riwayat - ${currentTab.toUpperCase()}`;
        history.forEach(h => {
            h.items.forEach(item => {
                dataToExport.push({
                    "Tanggal Rekap": h.date,
                    "Nama Menu": item.name,
                    "Awal": item.initial,
                    "IN": item.in,
                    "OUT": item.out,
                    "Spoil / Sisa Fisik": item.spoil,
                    "Akhir / Terpakai": item.final
                });
            });
        });
    }

    if (dataToExport.length === 0) return alert("Data kosong.");

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Stok");
    
    // Download
    XLSX.writeFile(wb, `${title}.xlsx`);
    closeExportModal();
}

// Close Day & Recap Logic
function getHistory() {
    const key = currentTab === 'kitchen' ? 'lokalin_kitchen_stock_history' : 'lokalin_bar_stock_history';
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
}

function saveHistory(historyArray) {
    const key = currentTab === 'kitchen' ? 'lokalin_kitchen_stock_history' : 'lokalin_bar_stock_history';
    localStorage.setItem(key, JSON.stringify(historyArray));
}

closeDayBtn.addEventListener('click', () => {
    const confirmClose = confirm(`Anda yakin ingin 'Tutup Hari' untuk bagian ${currentTab.toUpperCase()}?\n\nData hari ini akan disimpan ke Rekap, lalu Stock Akhir akan menjadi Stock Awal untuk besok, dan nilai Masuk/Keluar/Rusak akan dikosongkan.`);
    if (!confirmClose) return;

    const history = getHistory();
    const todayStr = new Date().toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    const snapshot = stockData[currentTab].map(item => {
        return {
            name: item.name,
            initial: item.initial,
            in: item.in,
            out: item.out,
            spoil: item.spoil,
            final: currentTab === 'bar' ? item.spoil : calculateFinalStock(item)
        };
    });

    history.unshift({ date: todayStr, items: snapshot });
    saveHistory(history);

    // Reset current stock for next day
    stockData[currentTab] = stockData[currentTab].map(item => {
        const finalStock = currentTab === 'bar' ? item.spoil : calculateFinalStock(item);
        return {
            ...item,
            initial: finalStock,
            in: 0,
            out: 0,
            spoil: 0
        };
    });
    
    saveData();
    renderTable();
    alert(`Berhasil Tutup Hari untuk ${currentTab.toUpperCase()}! Rekap telah disimpan.`);
});

// History Modal Logic
window.clearHistory = function() {
    if(confirm(`Yakin ingin menghapus SELURUH riwayat rekap ${currentTab.toUpperCase()}? Data yang dihapus tidak bisa dikembalikan.`)) {
        const key = currentTab === 'kitchen' ? 'lokalin_kitchen_stock_history' : 'lokalin_bar_stock_history';
        localStorage.removeItem(key);
        document.getElementById('historyModal').classList.remove('show');
        setTimeout(() => viewHistoryBtn.click(), 50);
        alert(`Riwayat rekap ${currentTab.toUpperCase()} berhasil dibersihkan!`);
    }
}

window.closeHistoryModal = function() {
    document.getElementById('historyModal').classList.remove('show');
}

viewHistoryBtn.addEventListener('click', () => {
    const history = getHistory();
    const container = document.getElementById('historyContainer');
    
    // Set Modal Title based on tab
    document.querySelector('.checkout-title').innerHTML = `🗓️ Riwayat Rekap ${currentTab.toUpperCase()}`;

    if (history.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">Belum ada riwayat rekap untuk ${currentTab.toUpperCase()}. Klik "Tutup Hari & Simpan" untuk menyimpan rekap.</div>`;
    } else {
        container.innerHTML = history.map((record, i) => `
            <div class="history-card">
                <div class="history-date">📅 ${record.date}</div>
                <div style="overflow-x: auto;">
                    <table class="history-table">
                        <thead>
                            ${currentTab === 'bar' ? `
                            <tr>
                                <th>Nama Menu</th>
                                <th>Awal</th>
                                <th>IN</th>
                                <th>OUT</th>
                                <th>Sisa (Balance)</th>
                            </tr>` : `
                            <tr>
                                <th>Nama Menu</th>
                                <th>Awal</th>
                                <th>IN</th>
                                <th>OUT</th>
                                <th>Spoil</th>
                                <th>Akhir</th>
                            </tr>`}
                        </thead>
                        <tbody>
                            ${record.items.map(item => `
                                <tr>
                                    <td style="font-weight:600; color:var(--text-primary);">${item.name}</td>
                                    <td style="color:var(--text-secondary);">${item.initial}</td>
                                    <td style="color:var(--green)">${item.in > 0 ? '+'+item.in : 0}</td>
                                    ${currentTab === 'bar' ? `
                                    <td style="color:var(--accent)">${item.out > 0 ? '-'+item.out : 0}</td>
                                    <td style="font-weight:700;">${item.final}</td>
                                    ` : `
                                    <td style="color:var(--accent)">${item.out > 0 ? '-'+item.out : 0}</td>
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

// Initialize
renderTable();

if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => {
        saveData();
        
        // Show temporary toast feedback
        const originalText = saveDraftBtn.innerHTML;
        saveDraftBtn.innerHTML = "✅ Tersimpan!";
        saveDraftBtn.style.background = "var(--green)";
        saveDraftBtn.style.color = "#fff";
        
        setTimeout(() => {
            saveDraftBtn.innerHTML = originalText;
            saveDraftBtn.style.background = "transparent";
            saveDraftBtn.style.color = "var(--accent)";
        }, 2000);
    });
}
