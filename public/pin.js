// pin.js
(function () {
    // PIN Rahasia Default: 1234
    // Anda bisa menggantinya di bawah ini kapan saja
    const SECRET_PIN = "Lokalin@Cafe";

    // Cek apakah perangkat ini sudah pernah memasukkan PIN
    const savedPin = localStorage.getItem('lokalin_admin_pin');

    if (savedPin !== SECRET_PIN) {
        // Tampilkan pop-up keamanan yang menghentikan layar
        const userInput = prompt("🔒 AREA TERBATAS\n\nMasukkan 4 digit PIN Rahasia staf Lokalin:");

        if (userInput === SECRET_PIN) {
            // Jika benar, simpan di memori tablet agar tidak ditanya lagi
            localStorage.setItem('lokalin_admin_pin', SECRET_PIN);
            alert("✅ Akses Diberikan. Selamat bertugas!");
        } else {
            // Jika salah, tendang kembali ke halaman order
            alert("❌ PIN SALAH! Akses ditolak.");
            window.location.href = "/order";
        }
    }
})();
