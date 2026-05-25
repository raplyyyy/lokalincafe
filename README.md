# 🍽️ Lokalin Cafe - Web Ordering System

Aplikasi pemesanan mandiri (*self-ordering*) dan manajemen restoran khusus dirancang untuk operasional **Lokalin Cafe**. Aplikasi ini mempermudah pelanggan lantai 2 untuk memesan menu tanpa harus turun ke kasir, sekaligus membantu staf mengelola pesanan, status minuman, dan stok bahan baku secara digital.

## 🚀 Fitur Utama
1. **Customer Self-Ordering (`/order`)**
   - Pemesanan menu makanan & minuman melalui QR Code meja.
   - Deteksi nomor meja otomatis melalui URL (`?table=X`).
   - Pop-up cerdas jika pelanggan mengakses link tanpa nomor meja.
2. **Cashier Dashboard (`/cashier`)**
   - Penerimaan pesanan secara *real-time* (Auto-refresh/Polling).
   - Detail pesanan, rekap total harga, dan tombol konfirmasi pembayaran.
   - Manajemen ketersediaan (*In-Stock / Out of Stock*) yang terhubung langsung ke tampilan pelanggan.
3. **Bar Kanban Board (`/cashier` Tab Bar)**
   - Layar khusus untuk Barista/Bartender.
   - Menampilkan antrean pembuatan minuman dengan visualisasi *Card/Kanban*.
   - Tombol "Selesai Dibuat" untuk menandai status minuman.
4. **Admin Panel (`/admin`)**
   - Mengelola daftar menu, kategori, harga, dan gambar.
   - Tersinkronisasi penuh dengan basis data Cloud (Supabase).
5. **Stock Management (`/stock.html`)**
   - Pencatatan stok harian untuk Kitchen dan Bar.
   - Mendukung format operasional fisik (Stok Awal, IN, OUT, Sisa Fisik Aktual).
   - **Fitur Ekspor Excel (.xlsx)**: Unduh laporan harian, bulanan, atau rekapan keseluruhan.
   - Sistem auto-save dan fitur "Tutup Hari" yang memindah *Balance* ke *Stok Awal* keesokan harinya.

## 🛠️ Teknologi yang Digunakan
* **Frontend**: HTML5, Vanilla JavaScript, CSS3 (Modern Glassmorphism UI)
* **Backend**: Node.js, Express.js
* **Database**: Supabase (PostgreSQL)
* **Export**: SheetJS (XLSX)
* **Deployment**: Vercel-Ready (Serverless)

## 💻 Cara Menjalankan di Komputer Lokal
Jika Anda ingin mengembangkan atau menjalankan aplikasi ini di komputer lokal:

1. Pastikan Anda telah menginstal [Node.js](https://nodejs.org/).
2. Buka folder proyek ini di Terminal.
3. Install semua dependensi:
   ```bash
   npm install
   ```
4. Jalankan *server* mode pengembangan:
   ```bash
   npm run dev
   ```
5. Akses aplikasi melalui *browser*:
   - Kasir/Bar: `http://localhost:3001/cashier`
   - Pelanggan: `http://localhost:3001/order`
   - Admin/Stok: `http://localhost:3001/admin`

## ☁️ Panduan Deployment (Vercel)
Aplikasi ini sudah dikonfigurasi untuk berjalan di Vercel menggunakan arsitektur *Serverless*. Karena Anda menggunakan Tablet untuk kasir (tanpa komputer lokal), ini adalah opsi terbaik.

1. Buat *repository* baru di [GitHub](https://github.com/).
2. *Commit* dan *Push* seluruh folder ini ke GitHub:
   ```bash
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git push origin main
   ```
3. Buka [Vercel](https://vercel.com/) dan *Import* repository GitHub Anda.
4. Vercel akan membaca file `vercel.json` secara otomatis dan men-deploy backend Express Anda sebagai fungsi *Serverless*.
5. (Opsional) Cetak QR Code yang mengarah ke domain Vercel Anda (misal: `https://lokalin.vercel.app/order?table=1`).

---
*Didesain dan dikembangkan secara custom untuk Lokalin Cafe.*
