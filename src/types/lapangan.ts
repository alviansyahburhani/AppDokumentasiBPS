export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  addressName?: string;
  district?: string;
  city?: string;
}

export interface LapanganPhoto {
  id: string;
  uri: string;
  base64?: string;
  timestamp: string;
  coordinates: LocationCoordinates;
  watermarkText?: string;
  note?: string;
}

export type SubSeksiBps =
  | 'Statistik Sosial'
  | 'Statistik Produksi'
  | 'Statistik Distribusi'
  | 'Nerwilis'
  | 'IPDS'
  | 'Bagian Umum';

export type TahapanKegiatan =
  | 'Pencacahan / Listing'
  | 'Pengawasan (PML)'
  | 'Supervisi Pimpinan'
  | 'Editing & Coding'
  | 'Rekonsiliasi Data';

export type SyncStatusType = 'DRAFT' | 'PENDING_SYNC' | 'SYNCED' | 'FAILED';

export interface LapanganRecord {
  id: string;
  namaKegiatan: string;
  subSeksi: SubSeksiBps;
  tahapan: TahapanKegiatan;
  progres: number; // 0 - 100%
  catatan: string;
  lokasi: LocationCoordinates;
  photos: LapanganPhoto[];
  status: SyncStatusType;
  createdAt: string;
  syncedAt?: string | null;
  syncErrorMessage?: string;
}

export interface LapanganPayload {
  jenisForm: 'lapangan';
  id: string;
  namaKegiatan: string;
  subSeksi: string;
  tahapan: string;
  progres: number;
  catatan: string;
  lokasi: {
    lat: number;
    lng: number;
    accuracy: number;
    address: string;
  };
  photos: Array<{
    id: string;
    timestamp: string;
    base64Data: string;
    coordinatesText: string;
  }>;
  createdAt: string;
}
