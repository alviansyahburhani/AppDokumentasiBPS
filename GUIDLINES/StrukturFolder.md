AppDokumentasi/
│
├── src/
│   ├── assets/                 # Penyimpanan file statis
│   │   ├── images/             # Logo BPS, ikon default, ilustrasi offline
│   │   └── fonts/              # Custom fonts (jika ada)
│   │
│   ├── components/             # Komponen UI yang bisa dipakai ulang (Reusable)
│   │   ├── CameraWatermark.tsx # Komponen inti: Kamera + Teks + ViewShot
│   │   ├── OfflineBanner.tsx   # Banner merah/hijau penanda status internet
│   │   └── CustomButton.tsx    # Tombol standar aplikasi
│   │
│   ├── database/               # Logika Zona C: Offline-First (WatermelonDB/Realm)
│   │   ├── schema.ts           # Struktur tabel (misal: tabel 'antrean_upload')
│   │   ├── models/             # Definisi model data (Tamu, Lapangan)
│   │   └── index.ts            # Inisialisasi koneksi database lokal
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useLocation.ts      # Logika memanggil GPS & memantau koordinat
│   │   └── useNetworkSync.ts   # Memantau koneksi & trigger upload otomatis
│   │
│   ├── navigation/             # Logika perpindahan layar (React Navigation)
│   │   ├── AppNavigator.tsx    # Navigasi utama
│   │   └── TabNavigator.tsx    # Menu bawah (Home, Lapangan, Tamu)
│   │
│   ├── screens/                # Tampilan halaman utama (Zona B)
│   │   ├── Auth/               
│   │   │   └── SyncScreen.tsx  # Layar "Sync Awal: Download Data Karyawan"
│   │   ├── Home/
│   │   │   └── HomeScreen.tsx  # Menu Utama Aplikasi
│   │   ├── Lapangan/
│   │   │   ├── LapanganForm.tsx # Form Nama Kegiatan & Progres
│   │   │   └── LapanganCam.tsx  # Layar khusus jepret foto lapangan
│   │   └── Tamu/
│   │       ├── TamuForm.tsx    # Form pencarian antrean tamu
│   │       └── TamuCam.tsx     # Layar jepret Wajah & KTP
│   │
│   ├── services/               # Logika eksternal (API & Background Tasks)
│   │   ├── api.ts              # Konfigurasi Axios ke Google Apps Script
│   │   ├── syncManager.ts      # Script eksekusi upload antrean di background
│   │   └── permissions.ts      # Meminta izin akses Kamera, GPS, Storage
│   │
│   ├── theme/                  # Konfigurasi UI Global (Memisahkan gaya dari komponen)
│   │   ├── colors.ts           # Palet warna aplikasi
│   │   ├── typography.ts       # Konfigurasi font & ukuran teks
│   │   └── metrics.ts          # Ukuran standar (margin, padding, radius)
│   │
│   ├── context/                # Global State Management (React Context / Zustand dll)
│   │   └── AppContext.tsx      # Contoh: Menyimpan status tema atau login
│   │
│   ├── utils/                  # Fungsi bantuan (*helper*) murni
│   │   ├── dateUtils.ts        # Format tanggal/waktu untuk watermark
│   │   ├── imageUtils.ts       # Fungsi kompresi gambar & konversi ke Base64
│   │   └── constants.ts        # URL API GAS & string statis lainnya
│   │
│   ├── types/                  # (Opsional) Jika pakai TypeScript: definisi tipe data
│   │   └── index.d.ts
│   │
│   └── App.tsx                 # Entry point (file utama) yang membungkus aplikasi
│
├── android/                    # Folder native untuk konfigurasi & build Android
├── ios/                        # Folder native untuk konfigurasi & build iOS
├── package.json                # Daftar library (dependencies)
├── babel.config.js             
├── index.js                    # File root RN (Pastikan import App dari './src/App')
└── ... (file konfigurasi bawaan RN lainnya)