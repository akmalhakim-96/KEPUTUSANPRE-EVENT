// Membungkus semua kod JavaScript dalam Immediately Invoked Function Expression (IIFE)
// untuk mengelakkan isu skop dan memastikan fungsi tersedia.
(function() {
    // Dapatkan semua elemen slaid carousel
    const items = document.querySelectorAll('.carousel-item');
    // Dapatkan elemen mesej loading
    const loadingMessage = document.getElementById('loadingMessage');
    // Indeks slaid semasa
    let currentIndex = 0;
    // Selang masa antara slaid (dalam milisaat). 10000 ms = 10 saat
    const slideInterval = 10000;

    /**
     * Fungsi untuk memaparkan slaid tertentu dengan kesan slide.
     * @param {number} oldIndex - Indeks slaid yang sedang aktif sebelum pertukaran.
     * @param {number} newIndex - Indeks slaid yang akan menjadi aktif.
     */
    function showSlide(oldIndex, newIndex) {
        // Sembunyikan mesej loading apabila slaid mula dipaparkan
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }

        // Handle slaid yang keluar: gerakkan ke kiri dan pudarkan
        if (items[oldIndex]) {
            items[oldIndex].style.transform = 'translateX(-100%)'; // Gerak keluar ke kiri
            items[oldIndex].style.opacity = '0'; // Pudar keluar
            items[oldIndex].classList.remove('active'); // Buang kelas aktif
            items[oldIndex].style.zIndex = '1'; // Letak di belakang
        }

        // Handle slaid yang masuk: sediakan di kanan, kemudian gerak masuk dan pudarkan
        items[newIndex].style.transform = 'translateX(100%)'; // Mula dari kanan
        items[newIndex].style.opacity = '0'; // Mula tersembunyi
        items[newIndex].style.zIndex = '2'; // Bawa ke hadapan

        // Paksa pelayar untuk "reflow" (render semula) untuk memastikan transform dan opacity awal diterapkan
        // Ini penting untuk memastikan transisi berlaku dengan betul dari kedudukan awal.
        void items[newIndex].offsetWidth;

        // Gerak masuk dan pudarkan slaid baharu
        items[newIndex].classList.add('active'); // Tambah kelas aktif
        items[newIndex].style.transform = 'translateX(0)'; // Gerak ke tengah
        items[newIndex].style.opacity = '1'; // Pudar masuk
    }

    /**
     * Fungsi untuk beralih ke slaid seterusnya.
     */
    function nextSlide() {
        const oldIndex = currentIndex;
        currentIndex = (currentIndex + 1) % items.length;
        showSlide(oldIndex, currentIndex);
    }

    // Paparkan mesej loading pada mulanya
    if (loadingMessage) {
        loadingMessage.style.display = 'block';
    }

    // Lakukan setup awal apabila keseluruhan laman web dimuatkan
    window.addEventListener('load', () => {
        // Inisialisasi semua slaid untuk berada di luar skrin ke kanan dan tersembunyi
        items.forEach((item, i) => {
            item.style.transform = 'translateX(100%)';
            item.style.opacity = '0';
            item.style.zIndex = '1'; // Z-index lalai untuk slaid tidak aktif
        });

        // Pastikan ada item sebelum cuba memaparkan slaid pertama atau memulakan carousel
        if (items.length > 0) {
            // Tunjukkan slaid pertama
            items[currentIndex].style.transform = 'translateX(0)';
            items[currentIndex].style.opacity = '1';
            items[currentIndex].classList.add('active');
            items[currentIndex].style.zIndex = '2'; // Slaid pertama aktif dan di hadapan

            // Mula auto-slaid
            setInterval(nextSlide, slideInterval);
        } else {
            console.warn("Tiada item carousel ditemui. Sila semak struktur HTML anda.");
            if (loadingMessage) {
                loadingMessage.textContent = "Tiada item carousel ditemui. Sila semak struktur HTML anda.";
            }
        }
    });

    // Tambah event listener untuk setiap iframe untuk menyembunyikan mesej loading
    // apabila kandungan iframe dimuatkan (walaupun ini mungkin tidak berfungsi untuk semua domain)
    items.forEach(item => {
        const iframe = item.querySelector('iframe');
        if (iframe) {
            iframe.onload = () => {
                // Mesej loading hanya akan hilang sepenuhnya apabila slaid pertama muncul.
            };
        }
    });
})(); // Akhir IIFE
