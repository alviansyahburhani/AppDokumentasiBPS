📱 1. Frontend Mobile (Aplikasi Utama Petugas)
Satu basis kode menggunakan JavaScript/TypeScript untuk menghasilkan aplikasi Android dan iOS.

Database Lokal (Offline-First):

Realm (oleh MongoDB) atau WatermelonDB.

Realm adalah NoSQL yang sangat cepat (padanan paling pas untuk Isar). WatermelonDB berjalan di atas SQLite namun sangat dioptimalkan untuk React Native agar tidak memblokir thread UI. Keduanya sangat cocok untuk menyimpan antrean teks dan Base64 foto.

Network & Background Sync:

@react-native-community/netinfo: Pengganti connectivity_plus untuk mendeteksi perubahan sinyal (Online/Offline) secara real-time.

react-native-background-actions (atau react-native-background-fetch): Pengganti workmanager untuk mengeksekusi antrean upload di latar belakang meskipun aplikasi ditutup (bekerja baik di Android, namun di iOS memiliki batasan sistem operasi yang ketat).

Kamera & Sensor:

react-native-vision-camera: Pengganti package camera. Ini adalah library kamera paling modern dan berkinerja tinggi di React Native saat ini.

react-native-view-shot: Pengganti screenshot. Trik cerdas ini sama persis penerapannya: Anda membungkus komponen Kamera, Teks, dan Logo BPS ke dalam tag <ViewShot>, lalu menangkapnya menjadi satu file gambar utuh (ber-watermark).

react-native-geolocation-service: Pengganti geolocator untuk mendapatkan titik koordinat satelit GPS dengan akurasi tinggi.

API Client:

axios atau fetch bawaan JavaScript: Pengganti dio/http untuk mengirim paket JSON (teks dan gambar Base64) ke server GAS.

Kompresi Gambar (Wajib):

react-native-image-resizer atau react-native-compressor: Karena Google Apps Script memiliki limit memori, gambar dari view-shot wajib dikompres (menurunkan kualitas/resolusi) sebelum diubah menjadi Base64 agar tidak terjadi timeout.

🌐 2. Frontend Web (Form QR Code Tamu)
Tetap Sama.
Gunakan HTML5, CSS3, dan Vanilla JavaScript yang di-hosting di Google Apps Script (HTML Service). Tidak perlu menggunakan React.js untuk web ini agar loading di HP tamu tetap instan.

⚙️ 3. Backend, Database & Storage (Server)
Tetap Sama.

Backend Server (API): Google Apps Script (GAS). Menerima request dari Axios React Native.

Database Relasional: Google Sheets.

Cloud Storage: Google Drive.

💬 4. Layanan Pihak Ketiga (Notifikasi)
Tetap Sama.
Integrasi Fonnte, Wablas, atau Watsap.id dipicu langsung dari backend Google Apps Script menggunakan UrlFetchApp.fetch(), sehingga tidak membebani aplikasi React Native Anda.

Keuntungan Ekstra Menggunakan React Native untuk Arsitektur Ini:
Jika Anda dan tim lebih terbiasa dengan ekosistem web (JavaScript/React/Node.js), transisi logika dari React Native ke Google Apps Script (yang juga menggunakan JavaScript) akan sangat mulus karena Anda menggunakan bahasa pemrograman yang sama dari ujung ke ujung (End-to-End JS).