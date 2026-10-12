export interface SesiRapat {
  id: string;
  judulRapat: string;
  tanggalPelaksanaan: string; // Misal "Senin, 12 Oktober 2026"
  waktuMulai: string; // Misal "09:00 WIB"
  waktuSelesai?: string; // Misal "12:00 WIB"
  ruangRapat: string;
  keterangan: string;
  penyelenggara: string;
  status: 'AKTIF' | 'DITUTUP';
  qrCodeUrl: string;
  webFormActive: boolean;
  totalPeserta: number;
  createdAt: string;
}

export interface TemplatePilihanCepat {
  id: string;
  kategori: 'PEGAWAI' | 'RUANGAN' | 'SURVEI' | 'PESAN_WA';
  label: string;
  subLabel?: string;
  nilai: string;
}
