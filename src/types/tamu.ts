import { SyncStatusType, LocationCoordinates } from './lapangan';

export type MetodePendaftaranTamu = 'manual' | 'qrcode';

export interface TamuFormData {
  nama: string;
  instansi: string;
  keperluan: string;
  bertemuSiapa: string;
  noWhatsapp: string;
  metode: MetodePendaftaranTamu;
}

export interface AntreanTamu extends TamuFormData {
  id: string;
  waktuAntre: string; // ISO string
  statusAntrean: 'MENUNGGU_VERIFIKASI' | 'SELESAI' | 'BATAL';
}

export interface TamuPhotoItem {
  id: string;
  uri: string;
  base64?: string;
  timestamp: string;
  watermarkText: string;
  coordinates: LocationCoordinates;
}

export interface TamuRecord extends TamuFormData {
  id: string;
  antreanId?: string;
  photos: TamuPhotoItem[];
  status: SyncStatusType;
  waktuCheckIn: string;
  syncedAt?: string | null;
  waTriggered?: boolean;
}

export interface TamuPayload {
  jenisForm: 'tamu_reguler';
  id: string;
  metode: MetodePendaftaranTamu;
  nama: string;
  instansi: string;
  keperluan: string;
  bertemuSiapa: string;
  noWhatsapp: string;
  photos: Array<{
    id: string;
    timestamp: string;
    base64Data: string;
    coordinatesText: string;
  }>;
  waktuCheckIn: string;
}
