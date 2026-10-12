import { LapanganRecord } from '../types/lapangan';
import { BPS_CONFIG } from '../utils/constants';

type ChangeListener = () => void;

class OfflineStorageEngine {
  private records: Map<string, LapanganRecord> = new Map();
  private listeners: Set<ChangeListener> = new Set();
  private isOnline: boolean = false; // default offline to showcase offline-first capability smoothly

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Initial sample seeded records to showcase the dashboard and queue immediately
    const sampleRecord: LapanganRecord = {
      id: 'lapangan_sample_01',
      namaKegiatan: 'Survei Sosial Ekonomi Nasional (SUSENAS)',
      subSeksi: 'Statistik Sosial',
      tahapan: 'Pencacahan / Listing',
      progres: 75,
      catatan: 'Pencacahan blok sensus 014B Kelurahan Janti telah selesai 15 rumah tangga.',
      lokasi: { ...BPS_CONFIG.DEFAULT_LOCATION },
      photos: [
        {
          id: 'photo_demo_1',
          uri: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
          timestamp: new Date().toISOString(),
          coordinates: { ...BPS_CONFIG.DEFAULT_LOCATION },
          watermarkText:
            '[BPS KOTA MALANG] SUSENAS\nLat: -7.942491, Lng: 112.613328\nSenin, 12 Okt 2026 09:30:00 WIB',
        },
      ],
      status: 'PENDING_SYNC',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      syncedAt: null,
    };

    const syncedRecord: LapanganRecord = {
      id: 'lapangan_sample_02',
      namaKegiatan: 'Updating Direktori Pasar & Usaha VHTS',
      subSeksi: 'Statistik Distribusi',
      tahapan: 'Pengawasan (PML)',
      progres: 100,
      catatan: 'Pengecekan kesesuaian izin operasional hotel dan restoran bintang.',
      lokasi: {
        ...BPS_CONFIG.DEFAULT_LOCATION,
        latitude: -7.953112,
        longitude: 112.624891,
        addressName: 'Jl. Ijen No. 12, Klojen',
        district: 'Kec. Klojen',
      },
      photos: [
        {
          id: 'photo_demo_2',
          uri: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?w=800&auto=format&fit=crop&q=80',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          coordinates: {
            ...BPS_CONFIG.DEFAULT_LOCATION,
            latitude: -7.953112,
            longitude: 112.624891,
          },
          watermarkText:
            '[BPS KOTA MALANG] Updating Usaha\nLat: -7.953112, Lng: 112.624891\nSenin, 12 Okt 2026 07:15:00 WIB',
        },
      ],
      status: 'SYNCED',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      syncedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    };

    this.records.set(sampleRecord.id, sampleRecord);
    this.records.set(syncedRecord.id, syncedRecord);
  }

  // Reactive listener
  public subscribe(listener: ChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in storage listener', err);
      }
    });
  }

  // Network State Simulator
  public getNetworkStatus(): boolean {
    return this.isOnline;
  }

  public setNetworkStatus(online: boolean) {
    this.isOnline = online;
    this.notify();
  }

  public toggleNetworkStatus(): boolean {
    this.isOnline = !this.isOnline;
    this.notify();
    return this.isOnline;
  }

  // CRUD Operations
  public getAllRecords(): LapanganRecord[] {
    return Array.from(this.records.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getPendingQueue(): LapanganRecord[] {
    return this.getAllRecords().filter(
      (r) => r.status === 'PENDING_SYNC' || r.status === 'FAILED'
    );
  }

  public getRecordById(id: string): LapanganRecord | undefined {
    return this.records.get(id);
  }

  public saveRecord(record: LapanganRecord): void {
    this.records.set(record.id, { ...record });
    this.notify();
  }

  public updateRecordStatus(
    id: string,
    status: LapanganRecord['status'],
    syncedAt?: string,
    errorMessage?: string
  ): void {
    const existing = this.records.get(id);
    if (existing) {
      existing.status = status;
      if (syncedAt !== undefined) existing.syncedAt = syncedAt;
      if (errorMessage !== undefined) existing.syncErrorMessage = errorMessage;
      this.records.set(id, { ...existing });
      this.notify();
    }
  }

  public deleteRecord(id: string): void {
    this.records.delete(id);
    this.notify();
  }

  public getCounts() {
    let pending = 0;
    let synced = 0;
    this.records.forEach((r) => {
      if (r.status === 'PENDING_SYNC' || r.status === 'FAILED') pending++;
      if (r.status === 'SYNCED') synced++;
    });
    return {
      total: this.records.size,
      pending,
      synced,
    };
  }
}

export const offlineStorage = new OfflineStorageEngine();
