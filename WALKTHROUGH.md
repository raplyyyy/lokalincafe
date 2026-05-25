# 📘 Walkthrough: Panduan Pengoperasian Aplikasi Lokalin Cafe

Aplikasi ini memiliki 3 portal utama yang terpisah perannya:
1. **Layar Pelanggan (Customer)**
2. **Layar Kasir & Bar (Operasional)**
3. **Layar Manajemen (Admin & Stok)**

Berikut adalah alur lengkap operasional dari hulu ke hilir.

---

## 1. Alur Pemesanan Pelanggan (Customer Journey)
**Link Akses:** `https://domain-anda.com/order`

*   **Pintu Masuk (QR Code):** Pelanggan di lantai 2 memindai QR code yang tertempel di meja mereka. QR code tersebut mengandung link spesifik (contoh: `/order?table=5`).
*   **Pemilihan Menu:** Pelanggan disajikan daftar menu Makanan dan Minuman. Jika ada menu yang berstatus *Out of Stock* (dikontrol dari kasir), tombol tambahnya otomatis nonaktif.
*   **Varian Minuman (Hot/Cold):** Jika pelanggan memesan minuman khusus (seperti Kopi), akan muncul *pop-up* yang meminta mereka memilih "Hot" atau "Cold".
*   **Catatan Pesanan:** Sebelum melakukan *checkout*, pelanggan bisa menambahkan catatan khusus (misal: "Esnya sedikit saja", "Jangan pakai seledri").
*   **Pengiriman (Checkout):** Saat pelanggan mengeklik "Kirim Pesanan", data pesanan langsung mengudara ke *database* Supabase dan layar kasir akan mendeteksinya.

---

## 2. Alur Penerimaan Kasir
**Link Akses:** `https://domain-anda.com/cashier`

Layar ini dirancang untuk dihidupkan terus-menerus di Tablet Kasir Anda.
*   **Auto-Refresh:** Layar kasir akan terus memeriksa pesanan baru setiap beberapa detik secara otomatis.
*   **Daftar Pesanan Aktif:** Pesanan baru dari lantai 2 akan langsung muncul di panel sebelah kiri.
*   **Pemrosesan Transaksi:** 
    1. Kasir mengeklik salah satu kartu pesanan.
    2. Detail rincian pesanan (harga, catatan, meja) akan muncul di layar tengah.
    3. Kasir memindahkan pesanan tersebut ke dalam **Aplikasi POS Utama** Anda untuk pencetakan struk fisik.
    4. Setelah selesai, Kasir menekan tombol **"✅ Tandai Lunas & Selesai"**. Pesanan tersebut akan hilang dari daftar aktif.
*   **Manajemen Ketersediaan (Habis/Ada):** Di panel sebelah kanan (`/cashier`), kasir bisa mematikan sakelar menu (mengubah "In Stock" menjadi "Out of Stock") jika ada bahan makanan yang habis saat itu juga. Layar HP pelanggan di lantai 2 akan ikut berubah secara *real-time*.

---

## 3. Alur Barista (Bar Kanban)
**Link Akses:** Tab "Bar" di dalam halaman Kasir (`/cashier`)

Layar ini dikhususkan bagi staf Barista untuk melihat antrean racikan minuman.
*   **Kartu Antrean (Kanban):** Hanya menu yang berkategori "Minuman" yang akan dilempar ke layar Bar.
*   **Prioritas:** Kartu-kartu diurutkan berdasarkan antrean.
*   **Penyelesaian:** Saat Barista selesai meracik sebuah pesanan minuman, ia menekan tombol **"✅ Selesai Dibuat"**. Kartu tersebut akan bergeser statusnya (menghilang dari antrean antrean aktif Bar).

---

## 4. Alur Kelola Menu (Admin Panel)
**Link Akses:** `https://domain-anda.com/admin`

Portal untuk pemilik/manajer kafe menyesuaikan katalog menu.
*   **Edit Harga & Nama:** Anda bisa mengubah harga atau nama menu kapan saja. Perubahan akan langsung tersinkronisasi dengan *database* pusat.
*   **Tambah Menu Baru:** Cukup masukkan Nama, Harga, Kategori, dan Link Gambar (URL).
*   **Hapus Menu:** Anda dapat menghapus menu yang sudah ditarik secara permanen dari kafe.

---

## 5. Alur Manajemen Gudang (Stok Harian)
**Link Akses:** `https://domain-anda.com/stock.html`

Layar interaktif ini berfungsi layaknya papan *clipboard* gudang Anda. Digunakan oleh seluruh *shift*.
*   **Pengisian *Shift* Pagi:** Saat *shift* pagi menambah bahan (IN) atau mencatat bahan terbuang (OUT), mereka cukup mengetik angkanya, lalu menekan **"💾 Simpan Sementara"**. Angka ini aman tersimpan di tablet.
*   **Perhitungan Hitung Fisik (Sisa Balance):** Di akhir *shift* (malam), staf menghitung sisa barang riil di gudang/kulkas, lalu memasukkannya ke dalam kolom **"Sisa (Balance)"**. Sistem akan memunculkan estimasi *Selisih* untuk dicocokkan.
*   **Tutup Hari & Buka Buku Baru:** Setelah semua "Sisa (Balance)" terisi, Manajer/Kasir menekan tombol **"✅ Tutup Hari (Closing)"**. 
    *Sistem otomatis menyalin seluruh "Sisa (Balance)" hari ini, lalu mengubahnya menjadi "Stok Awal" untuk keesokan paginya!*
*   **Export Excel (Rekapitulasi):** Manajer bisa menekan tombol **"📊 Export Excel"** untuk mengunduh laporan berformat `.xlsx` (Bisa pilih rekap Harian, Bulanan, atau Semua Riwayat) yang siap dibuka di Microsoft Excel.

---

### Tips Operasional Penting untuk Vercel:
Karena Anda *host* aplikasi ini di Vercel (Cloud), pastikan Tablet Kasir memiliki koneksi internet/WiFi yang stabil, karena aplikasi menarik data pesanan langsung dari Cloud (Supabase) secara konstan.
