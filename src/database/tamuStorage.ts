import { AntreanTamu, TamuRecord } from '../types/tamu';
import { BPS_CONFIG } from '../utils/constants';

type ChangeListener = () => void;

class TamuStorageEngine {
  private antreanList: Map<string, AntreanTamu> = new Map();
  private tamuRecords: Map<string, TamuRecord> = new Map();
  private listeners: Set<ChangeListener> = new Set();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Antrean masuk dari Tamu Scan QRCode (Jalur QRCode)
    const antrean1: AntreanTamu = {
      id: 'antrean_qr_001',
      metode: 'qrcode',
      nama: 'Ir. Hendra Kusuma, M.T.',
      instansi: 'Dinas Kominfo Provinsi Jawa Timur',
      keperluan: 'Koordinasi Integrasi Satu Data Indonesia & Metadata Statistik Sektoral',
      bertemuSiapa: 'Budi Santoso (Statistisi Ahli Muda)',
      noWhatsapp: '081234567890',
      waktuAntre: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      statusAntrean: 'MENUNGGU_VERIFIKASI',
    };

    const antrean2: AntreanTamu = {
      id: 'antrean_qr_002',
      metode: 'qrcode',
      nama: 'Dr. Siti Nurhaliza',
      instansi: 'Universitas Brawijaya',
      keperluan: 'Konsultasi Publikasi Kota Malang Dalam Angka 2026',
      bertemuSiapa: 'Tim Nerwilis & Statistik Sosial',
      noWhatsapp: '085678901234',
      waktuAntre: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      statusAntrean: 'MENUNGGU_VERIFIKASI',
    };

    this.antreanList.set(antrean1.id, antrean1);
    this.antreanList.set(antrean2.id, antrean2);

    // 2. Tamu yang sudah selesai diproses (History)
    const history1: TamuRecord = {
      id: 'tamu_rec_001',
      metode: 'manual',
      nama: 'Dewi Lestari, S.E.',
      instansi: 'Bank Indonesia Perwakilan Malang',
      keperluan: 'Koordinasi Data Survei Harga Konsumen (SHK)',
      bertemuSiapa: 'Kepala BPS Kota Malang',
      noWhatsapp: '081999888777',
      photos: [
        {
          id: 'photo_demo_face_01',
          uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          watermarkText:
            '[BPS KOTA MALANG] Dewi Lestari - Bank Indonesia\nLat: -7.942491, Lng: 112.613328\n08:30 WIB',
          coordinates: { ...BPS_CONFIG.DEFAULT_LOCATION },
        },
      ],
      status: 'SYNCED',
      waktuCheckIn: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      syncedAt: new Date(Date.now() - 1000 * 60 * 88).toISOString(),
      waTriggered: true,
    };

    this.tamuRecords.set(history1.id, history1);
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

  // Antrean methods (Dari Jalur QRCode)
  public getAntreanList(): AntreanTamu[] {
    return Array.from(this.antreanList.values())
      .filter((a) => a.statusAntrean === 'MENUNGGU_VERIFIKASI')
      .sort(
        (a, b) =>
          new Date(b.waktuAntre).getTime() - new Date(a.waktuAntre).getTime()
      );
  }

  public addAntrean(antrean: AntreanTamu) {
    this.antreanList.set(antrean.id, antrean);
    this.notify();
  }

  public markAntreanDone(id?: string) {
    if (!id) return;
    const item = this.antreanList.get(id);
    if (item) {
      item.statusAntrean = 'SELESAI';
      this.antreanList.set(id, { ...item });
      this.notify();
    }
  }

  // History Records methods (Baik dari Manual maupun QRCode)
  public getAllRecords(): TamuRecord[] {
    return Array.from(this.tamuRecords.values()).sort(
      (a, b) =>
        new Date(b.waktuCheckIn).getTime() - new Date(a.waktuCheckIn).getTime()
    );
  }

  public getRecordById(id: string): TamuRecord | undefined {
    return this.tamuRecords.get(id);
  }

  public saveRecord(record: TamuRecord): void {
    this.tamuRecords.set(record.id, { ...record });
    if (record.antreanId) {
      this.markAntreanDone(record.antreanId);
    }
    this.notify();
  }

  public getStats() {
    const antrean = this.getAntreanList();
    const records = this.getAllRecords();
    const manualCount = records.filter((r) => r.metode === 'manual').length;
    const qrCount = records.filter((r) => r.metode === 'qrcode').length;
    return {
      menungguQr: antrean.length,
      totalSelesai: records.length,
      manualCount,
      qrCount,
    };
  }
}

export const tamuStorage = new TamuStorageEngine();
