// pin.js
(function () {
    // PIN Rahasia Default: 1234
    // Anda bisa menggantinya di bawah ini kapan saja
    const SECRET_PIN = "Lokalin@Cafe";

    // Cek apakah perangkat ini sudah pernah memasukkan PIN
    const savedPin = localStorage.getItem('lokalin_admin_pin');

    if (savedPin !== SECRET_PIN) {
        // Tampilkan pop-up keamanan yang menghentikan layar
        const userInput = prompt("🔒 RESTRICTED AREA\n\nEnter the Lokalin staff Secret PIN:");

        if (userInput === SECRET_PIN) {
            // Jika benar, simpan di memori tablet agar tidak ditanya lagi
            localStorage.setItem('lokalin_admin_pin', SECRET_PIN);
            alert("✅ Access Granted. Good work!");
        } else {
            // Jika salah, tendang kembali ke halaman order
            alert("❌ INVALID PIN! Access denied.");
            window.location.href = "/order";
        }
    }
})();
