```mermaid
graph TD
    %% ZONA B
    subgraph ZONAB [ZONA B: SISI APLIKASI - Pegawai & Resepsionis]
        direction TB
        B1[Buka Aplikasi] --> B2[Sync Awal: Download Data<br>Karyawan<br>& Status Rapat Saat Ini]
        B2 --> B3{MENU UTAMA APLIKASI}
        
        %% Cabang Kelola Rapat
        B3 -->|Menu Kelola Rapat| B4[Resepsionis Buat Sesi<br>Rapat Baru / Tutup Sesi]
        B4 --> B5[Mengubah Logika 'Cek<br>Sistem' di Web Form]
        
        %% Cabang Lapangan
        B3 -->|Menu Lapangan| B13[Cari Lokasi GPS Akurat]
        B13 --> B14[Buka Kamera Lapangan<br>Watermark Live: Logo BPS,<br>Tanggal Waktu, GPS<br>Kordinat]
        B14 --> B15[Jepret Foto]
        B15 --> B16{Tambah Foto Lagi?}
        B16 -->|Ya| B14
        B16 -->|Tidak| B17[Masuk Form Lapangan:<br>Isi Nama Kegiatan & Progres]
        B17 --> B18[Sistem Menyatukan Foto +<br>Teks Form Watermark<br>Final]
        B18 --> B19[Tekan Tombol 'SIMPAN']
        
        %% Cabang Buku Tamu
        B3 -->|Menu Buku Tamu| B6[Tarik Data dari Antrean<br>Cloud]
        B6 --> B7[Petugas Memilih Nama<br>Tamu di Layar]
        B7 --> B8[Buka Kamera Tamu<br>Watermark Live: Nama<br>Tamu, Tujuan/Rapat]
        B8 --> B9[Jepret Wajah]
        B9 --> B10{Tambah KTP?}
        B10 -->|Ya| B11[Jepret KTP]
        B11 --> B12[Tekan Tombol 'SIMPAN']
        B10 -->|Tidak| B12
    end

    %% ZONA A
    subgraph ZONAA [ZONA A: SISI TAMU - Web Form via Scan QR Meja]
        direction TB
        A1[Tamu Scan QR Code Statis] --> A2{Cek Sistem GAS:<br>Ada Rapat Aktif Hari Ini?}
        
        A2 -->|Tidak Ada| A3[Tampil Form Tamu Reguler<br>Nama, Instansi, Bertemu<br>Karyawan Siapa]
        A2 -->|Ada Rapat| A4[Tampil Opsi Tujuan:<br>1. Kunjungan Biasa<br>2. Ikut Rapat/Acara]
        
        A4 -->|Kunjungan Biasa| A3
        A4 -->|Ikut Rapat| A5[Tampil Form Rapat<br>Nama, Instansi, Pilih Rapat<br>dari Dropdown]
        
        A3 --> A6[Tamu Tekan Submit]
        A5 --> A6
        A6 --> A7[(Antrean Server/Cloud<br>Sementara)]
    end

    %% Koneksi Zona B ke Zona A (Dotted)
    B5 -.-> ZONAA
    
    %% Koneksi Zona A ke Zona B (Dotted)
    A7 -.->|Tampil di Layar Petugas| B6

    %% ZONA C
    subgraph ZONAC [ZONA C: LOGIKA PENGIRIMAN]
        direction TB
        C1{Cek Koneksi Internet HP}
        
        C1 -->|Online & Stabil| C2[Kirim API Request JSON ke<br>Server]
        C1 -->|Offline / Gagal| C3[(Database Lokal Isar/SQLite<br>Masuk Antrean)]
        
        C3 --> C4[Background Sync /<br>WorkManager]
        C4 -.->|Coba Kirim Saat Online| C1
    end

    %% Koneksi Zona B ke Zona C
    B19 --> C1
    B12 --> C1

    %% ZONA D
    subgraph ZONAD [ZONA D: BACKEND & GOOGLE DRIVE]
        direction TB
        D1{Router GAS:<br>Baca Tipe 'jenisForm'}
        
        %% Cabang Lapangan
        D1 -->|lapangan| D2[Buat Folder Khusus Kegiatan]
        D2 --> D3[Simpan Data & URL ke Tab<br>'Data_Lapangan']
        
        %% Cabang Tamu Reguler
        D1 -->|tamu_reguler| D4[Simpan Foto di Folder<br>'Buku_Tamu']
        D4 --> D5[Simpan Data & URL ke Tab<br>'Data_Tamu_Lobby']
        D5 --> D6[Trigger Pesan WA ke<br>Karyawan Tujuan]
        
        %% Cabang Peserta Rapat
        D1 -->|peserta_rapat| D7[Buat/Simpan di Folder<br>'Rapat_X']
        D7 --> D8[Simpan Data & URL ke Tab<br>'Daftar_Hadir_Rapat']
        
        %% Penutup
        D3 --> D9[Hapus dari Antrean Lokal HP]
        D6 --> D9
        D8 --> D9
        
        D9 --> D10([PROSES SELESAI SUKSES])
    end

    %% Koneksi Zona C ke Zona D
    C2 --> D1