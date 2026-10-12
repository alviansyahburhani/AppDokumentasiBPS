import axios from 'axios';
import { LapanganPayload, LapanganRecord } from '../types/lapangan';

// Endpoint GAS URL placeholder - dapat di-config via .env atau constants
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby_BPS_DOKUMENTASI_MOCK/exec';

export const apiClient = axios.create({
  baseURL: GAS_WEB_APP_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const lapanganApi = {
  /**
   * Mengirim form dokumentasi lapangan beserta foto watermark Base64 ke server GAS
   * Sesuai arsitektur Zona C & D pada flow.md
   */
  async uploadLapanganRecord(record: LapanganRecord): Promise<{ success: boolean; driveFolderUrl?: string; message: string }> {
    const payload: LapanganPayload = {
      jenisForm: 'lapangan',
      id: record.id,
      namaKegiatan: record.namaKegiatan,
      subSeksi: record.subSeksi,
      tahapan: record.tahapan,
      progres: record.progres,
      catatan: record.catatan,
      lokasi: {
        lat: record.lokasi.latitude,
        lng: record.lokasi.longitude,
        accuracy: record.lokasi.accuracy,
        address: record.lokasi.addressName || 'Lokasi Lapangan BPS',
      },
      photos: record.photos.map((p) => ({
        id: p.id,
        timestamp: p.timestamp,
        base64Data: p.base64 || '',
        coordinatesText: `${p.coordinates.latitude.toFixed(6)}, ${p.coordinates.longitude.toFixed(6)}`,
      })),
      createdAt: record.createdAt,
    };

    // Simulasi respons latensi server Google Apps Script (Drive upload + Google Sheets row append)
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1200));

    // Return success object
    return {
      success: true,
      driveFolderUrl: `https://drive.google.com/drive/folders/BPS_LAPANGAN_${encodeURIComponent(record.namaKegiatan.substring(0, 15))}`,
      message: `Berhasil mengunggah ${record.photos.length} foto ke Google Drive & Tab Data_Lapangan`,
    };
  },
};
