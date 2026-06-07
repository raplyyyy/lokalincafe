# 📘 Walkthrough: Panduan Pengoperasian Aplikasi Lokalin Cafe

Aplikasi ini memiliki 3 portal utama yang terpisah perannya:
1. **Layar Pelanggan (Customer)**
2. **Layar Kasir & Bar (Operasional)**
3. **Layar Manajemen (Admin, Stock, & Sales)**

Berikut adalah alur lengkap operasional dari hulu ke hilir. Seluruh antarmuka kini menggunakan Bahasa Inggris secara penuh (Full English Localization) untuk standar profesional, dan seluruh data disimpan secara persisten di **Supabase Cloud**.

---

## 1. Alur Pemesanan Pelanggan (Customer Journey)
**Link Akses:** `https://domain-anda.com/order`

*   **Pintu Masuk (QR Code):** Pelanggan di lantai 2 memindai QR code yang tertempel di meja mereka. QR code tersebut mengandung link spesifik (contoh: `/order?table=5`).
*   **Pemilihan Menu:** Pelanggan disajikan daftar menu Food dan Drinks. Jika ada menu yang berstatus *Out of Stock* (dikontrol dari kasir), tombol tambahnya otomatis nonaktif.
*   **Varian Minuman (Hot/Cold):** Jika pelanggan memesan minuman khusus (seperti Kopi), akan muncul *pop-up* yang meminta mereka memilih "Hot" atau "Cold".
*   **Catatan Pesanan:** Sebelum melakukan *checkout*, pelanggan bisa menambahkan catatan khusus (misal: "Esnya sedikit saja", "Jangan pakai seledri").
*   **Pengiriman (Checkout):** Saat pelanggan mengeklik "Send Order", data pesanan langsung mengudara ke *database* Supabase dan layar kasir akan mendeteksinya secara otomatis.

---

## 2. Alur Penerimaan Kasir
**Link Akses:** `https://domain-anda.com/cashier`

Layar ini dirancang untuk dihidupkan terus-menerus di Tablet Kasir Anda (dilengkapi dengan PIN Keamanan).
*   **Auto-Refresh:** Layar kasir akan terus memeriksa pesanan baru setiap beberapa detik secara otomatis menggunakan Supabase Realtime/Polling.
*   **Daftar Pesanan Aktif:** Pesanan baru dari lantai 2 akan langsung muncul di panel sebelah kiri.
*   **Pemrosesan Transaksi:** 
    1. Kasir mengeklik salah satu kartu pesanan.
    2. Detail rincian pesanan (harga, catatan, meja) akan muncul di layar tengah.
    3. Kasir memindahkan pesanan tersebut ke dalam **Aplikasi POS Utama** Anda untuk pencetakan struk fisik.
    4. Setelah selesai, Kasir menekan tombol **"✅ Mark as Paid & Done"**. Pesanan tersebut akan hilang dari daftar aktif.
*   **Manajemen Ketersediaan (Habis/Ada):** Di panel sebelah kanan (`/cashier`), kasir bisa mematikan sakelar menu (mengubah "In Stock" menjadi "Out of Stock") jika ada bahan makanan yang habis saat itu juga. Layar HP pelanggan di lantai 2 akan ikut berubah secara *real-time*.

---

## 3. Alur Barista (Bar Kanban)
**Link Akses:** Tab "Bar" di dalam halaman Kasir (`/cashier`)

Layar ini dikhususkan bagi staf Barista untuk melihat antrean racikan minuman.
*   **Kartu Antrean (Kanban):** Hanya menu yang berkategori "Minuman" yang akan dilempar ke layar Bar.
*   **Prioritas:** Kartu-kartu diurutkan berdasarkan antrean.
*   **Penyelesaian:** Saat Barista selesai meracik sebuah pesanan minuman, ia menekan tombol **"✅ Done Making"**. Kartu tersebut akan bergeser statusnya.

---

## 4. Alur Kelola Menu (Admin Panel)
**Link Akses:** `https://domain-anda.com/admin`

Portal untuk pemilik/manajer kafe menyesuaikan katalog menu. Membutuhkan akses PIN.
*   **Edit Harga & Nama:** Anda bisa mengubah harga atau nama menu kapan saja. Perubahan akan langsung tersinkronisasi dengan *database* Supabase.
*   **Tambah Menu Baru:** Cukup masukkan Nama, Harga, Kategori, dan Link Gambar (URL).
*   **Hapus Menu:** Anda dapat menghapus menu yang sudah ditarik secara permanen dari kafe.

---

## 5. Alur Manajemen Gudang (Stok Harian) & Laporan Penjualan (Sales)
**Link Akses:** `/stock` dan `/sales`

Layar interaktif ini berfungsi layaknya papan *clipboard* gudang & kasir. Data disinkronkan secara mulus ke seluruh perangkat.
*   **Pengisian *Shift* Pagi:** Saat *shift* pagi menambah bahan (IN) atau mencatat bahan terbuang (OUT), mereka cukup mengetik angkanya. Angka otomatis disinkronisasi ke Cloud.
*   **Perhitungan Hitung Fisik (Sisa Balance):** Di akhir *shift* (malam), staf menghitung sisa barang riil di gudang/kulkas, lalu memasukkannya ke dalam kolom **"Spoil / Physical Balance"**. 
*   **Tutup Hari & Buka Buku Baru:** Setelah semua terisi, Manajer/Kasir menekan tombol **"✅ Close Day"**. 
    *Sistem otomatis menyalin seluruh "Sisa (Balance)" hari ini, lalu mengubahnya menjadi "Stok Awal" untuk keesokan paginya.* Data ini diatur sedemikian rupa agar *Closing* dini hari (00:00 - 04:59) tetap terhitung sebagai tanggal hari bisnis sebelumnya.
*   **Export Excel (Rekapitulasi):** Manajer bisa menekan tombol **"📊 Export Excel"** untuk mengunduh laporan `.xlsx` harian, bulanan, atau semua data.
*   **Fitur Input Masa Lalu (Add Past Recap):** Jika staf kelupaan melakukan pengisian data pada hari kemarin atau hari sebelumnya, Manajer dapat membuka menu **History** -> **➕ Add Past Recap**. Sistem akan memunculkan formulir khusus dengan pengaturan tanggal ke belakang, sehingga data historis tetap bisa dilengkapi tanpa mengganggu perhitungan draf hari ini.

---

### Tips Operasional Penting:
Karena aplikasi ini 100% menggunakan arsitektur Cloud (Supabase), pastikan Tablet Kasir memiliki koneksi internet/WiFi yang stabil agar data sinkron tanpa jeda, serta fitur Auto-Save berjalan dengan baik ke server pusat.
