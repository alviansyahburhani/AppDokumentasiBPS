import { SesiRapat, TemplatePilihanCepat } from '../types/pengelola';

type ChangeListener = () => void;

class PengelolaStorageEngine {
  private sesiRapatList: Map<string, SesiRapat> = new Map();
  private templates: Map<string, TemplatePilihanCepat> = new Map();
  private listeners: Set<ChangeListener> = new Set();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Initial Sesi Rapat
    const sesi1: SesiRapat = {
      id: 'sesi_rapat_001',
      judulRapat: 'Focus Group Discussion (FGD) Publikasi Daerah Dalam Angka 2026',
      tanggalPelaksanaan: 'Senin, 12 Oktober 2026',
      waktuMulai: '09:00 WIB',
      waktuSelesai: '12:30 WIB',
      ruangRapat: 'Ruang Rapat Utama Lt. 2',
      keterangan: 'Koordinasi data statistik sektoral bersama OPD dan instansi vertikal se-Kota Malang.',
      penyelenggara: 'Fungsi Neraca Wilayah & Analisis Statistik',
      status: 'AKTIF',
      qrCodeUrl:
        'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://script.google.com/macros/s/BPS_RAPAT_FGD_DDA_2026/exec',
      webFormActive: true,
      totalPeserta: 18,
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    };

    const sesi2: SesiRapat = {
      id: 'sesi_rapat_002',
      judulRapat: 'Briefing Petugas Pengawasan Lapangan Survei Biaya Hidup (SBH)',
      tanggalPelaksanaan: 'Jumat, 09 Oktober 2026',
      waktuMulai: '13:30 WIB',
      waktuSelesai: '16:00 WIB',
      ruangRapat: 'Ruang Vicon Lantai 1',
      keterangan: 'Penguatan metodologi dan validasi entri kuesioner pengeluaran rumah tangga.',
      penyelenggara: 'Statistik Distribusi',
      status: 'DITUTUP',
      qrCodeUrl:
        'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://script.google.com/macros/s/BPS_RAPAT_SBH_BRIEFING/exec',
      webFormActive: false,
      totalPeserta: 24,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    };

    this.sesiRapatList.set(sesi1.id, sesi1);
    this.sesiRapatList.set(sesi2.id, sesi2);

    // 2. Initial Templates & Pilihan Cepat
    const initialTemplates: TemplatePilihanCepat[] = [
      // Pegawai
      {
        id: 'tpl_pegawai_1',
        kategori: 'PEGAWAI',
        label: 'Budi Santoso',
        subLabel: 'Statistisi Ahli Muda',
        nilai: 'Budi Santoso (Statistisi Ahli Muda)',
      },
      {
        id: 'tpl_pegawai_2',
        kategori: 'PEGAWAI',
        label: 'Anisa Rahmawati, S.Tr.Stat',
        subLabel: 'Pranata Komputer Pertama',
        nilai: 'Anisa Rahmawati, S.Tr.Stat (Pranata Komputer)',
      },
      {
        id: 'tpl_pegawai_3',
        kategori: 'PEGAWAI',
        label: 'Kepala BPS Kota Malang',
        subLabel: 'Pimpinan Satker',
        nilai: 'Kepala BPS Kota Malang',
      },
      {
        id: 'tpl_pegawai_4',
        kategori: 'PEGAWAI',
        label: 'Subbagian Umum',
        subLabel: 'Tata Usaha & Kepegawaian',
        nilai: 'Subbagian Umum',
      },

      // Ruangan Rapat
      {
        id: 'tpl_ruang_1',
        kategori: 'RUANGAN',
        label: 'Ruang Rapat Utama Lt. 2',
        subLabel: 'Kapasitas 40 Orang • Proyektor + Sound',
        nilai: 'Ruang Rapat Utama Lt. 2',
      },
      {
        id: 'tpl_ruang_2',
        kategori: 'RUANGAN',
        label: 'Ruang Video Conference Lt. 1',
        subLabel: 'Kapasitas 15 Orang • Smart TV + Zoom',
        nilai: 'Ruang Video Conference Lt. 1',
      },
      {
        id: 'tpl_ruang_3',
        kategori: 'RUANGAN',
        label: 'Ruang Pelayanan Statistik Terpadu (PST)',
        subLabel: 'Lobby Utama BPS',
        nilai: 'Ruang PST Lobby',
      },

      // Template Pesan WhatsApp
      {
        id: 'tpl_wa_1',
        kategori: 'PESAN_WA',
        label: 'Notifikasi Tamu Tiba di Lobby',
        subLabel: 'Pesan otomatis ke pegawai tujuan',
        nilai:
          'Halo {nama_pegawai}, tamu atas nama {nama_tamu} dari {instansi} telah tiba di Lobby BPS dengan keperluan: "{keperluan}". Mohon dapat menemui di Ruang Pelayanan.',
      },
      {
        id: 'tpl_wa_2',
        kategori: 'PESAN_WA',
        label: 'Undangan Presensi QR Rapat',
        subLabel: 'Pesan pengingat peserta rapat',
        nilai:
          'Yth. Peserta Rapat, silakan melakukan presensi mandiri pada rapat "{judul_rapat}" yang bertempat di {ruang_rapat} dengan memindai QR Code di meja presensi.',
      },

      // Template Survei / Kegiatan Lapangan
      {
        id: 'tpl_survei_1',
        kategori: 'SURVEI',
        label: 'SUSENAS Maret / September',
        subLabel: 'Statistik Sosial Kesejahteraan Rakyat',
        nilai: 'Survei Sosial Ekonomi Nasional (SUSENAS)',
      },
      {
        id: 'tpl_survei_2',
        kategori: 'SURVEI',
        label: 'SAKERNAS Semesteran',
        subLabel: 'Statistik Ketenagakerjaan',
        nilai: 'Survei Angkatan Kerja Nasional (SAKERNAS)',
      },
      {
        id: 'tpl_survei_3',
        kategori: 'SURVEI',
        label: 'Survei Harga Konsumen (SHK)',
        subLabel: 'Pemantauan Indeks Inflasi',
        nilai: 'Survei Harga Konsumen (SHK)',
      },
    ];

    initialTemplates.forEach((t) => this.templates.set(t.id, t));
  }

  public subscribe(listener: ChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error(err);
      }
    });
  }

  // --- Sesi Rapat Methods ---
  public getSesiRapatList(): SesiRapat[] {
    return Array.from(this.sesiRapatList.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getSesiAktif(): SesiRapat | undefined {
    return this.getSesiRapatList().find((s) => s.status === 'AKTIF');
  }

  public tambahSesiRapat(data: {
    judulRapat: string;
    tanggalPelaksanaan: string;
    waktuMulai: string;
    waktuSelesai?: string;
    ruangRapat: string;
    keterangan: string;
    penyelenggara?: string;
  }): SesiRapat {
    const id = `sesi_rapat_${Date.now()}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://script.google.com/macros/s/BPS_RAPAT_${encodeURIComponent(data.judulRapat.substring(0, 15))}/exec`;

    const newSesi: SesiRapat = {
      id,
      ...data,
      penyelenggara: data.penyelenggara || 'BPS Kota Malang',
      status: 'AKTIF',
      qrCodeUrl,
      webFormActive: true,
      totalPeserta: 0,
      createdAt: new Date().toISOString(),
    };

    this.sesiRapatList.set(id, newSesi);
    this.notify();
    return newSesi;
  }

  public toggleStatusSesi(id: string): SesiRapat | undefined {
    const sesi = this.sesiRapatList.get(id);
    if (sesi) {
      const isAktif = sesi.status === 'AKTIF';
      sesi.status = isAktif ? 'DITUTUP' : 'AKTIF';
      sesi.webFormActive = !isAktif;
      this.sesiRapatList.set(id, { ...sesi });
      this.notify();
      return sesi;
    }
    return undefined;
  }

  public hapusSesi(id: string) {
    this.sesiRapatList.delete(id);
    this.notify();
  }

  // --- Template Methods ---
  public getTemplatesByKategori(
    kategori: TemplatePilihanCepat['kategori']
  ): TemplatePilihanCepat[] {
    return Array.from(this.templates.values()).filter(
      (t) => t.kategori === kategori
    );
  }

  public tambahTemplate(item: Omit<TemplatePilihanCepat, 'id'>) {
    const id = `tpl_${Date.now()}`;
    this.templates.set(id, { id, ...item });
    this.notify();
  }

  public hapusTemplate(id: string) {
    this.templates.delete(id);
    this.notify();
  }

  public getStats() {
    const list = this.getSesiRapatList();
    const aktifCount = list.filter((s) => s.status === 'AKTIF').length;
    const ditutupCount = list.filter((s) => s.status === 'DITUTUP').length;
    return {
      totalRapat: list.length,
      aktifCount,
      ditutupCount,
      totalTemplate: this.templates.size,
    };
  }
}

export const pengelolaStorage = new PengelolaStorageEngine();
