import { SubSeksiBps, TahapanKegiatan } from '../types/lapangan';

export const BPS_CONFIG = {
  INSTANSI_NAME: 'BADAN PUSAT STATISTIK',
  SATKER_NAME: 'BPS KOTA MALANG',
  LOGO_URI:
    'https://lh3.googleusercontent.com/aida/AEtjO1UwyTrm0-BZ3EIeFjg0-rLh4iW75JYVPyWdtpWNBAwBwZ2xELUxh0usHxnXm3Ez5i7kuN9tNgx1vXIZcS_--fu7ExE3ETapQkSqTBmm_g99g3A2j0ZwUe33d9MKSimKz5qzCsGb2amDRMHG0JjaRRmHIxWGYMuuzxF2bZNoxu6WqskZ10xv9QhrVbKRE17-mH0RXZp-tPakuTKdRRreyNMwDc0qu5wKDtT6epL93NoCGAH1kMLKejedZ8oJ',
  DEFAULT_LOCATION: {
    latitude: -7.942491,
    longitude: 112.613328,
    accuracy: 4.8,
    altitude: 460,
    addressName: 'Jl. Janti Barat No.47, Sukun',
    district: 'Kec. Sukun',
    city: 'Kota Malang, Jawa Timur',
  },
  DEFAULT_PETUGAS: {
    nama: 'Budi Santoso',
    jabatan: 'Statistisi Ahli Muda',
    nip: '199203152015021002',
  },
};

export const SUB_SEKSI_OPTIONS: SubSeksiBps[] = [
  'Statistik Sosial',
  'Statistik Produksi',
  'Statistik Distribusi',
  'Nerwilis',
  'IPDS',
  'Bagian Umum',
];

export const TAHAPAN_OPTIONS: TahapanKegiatan[] = [
  'Pencacahan / Listing',
  'Pengawasan (PML)',
  'Supervisi Pimpinan',
  'Editing & Coding',
  'Rekonsiliasi Data',
];

export const QUICK_SURVEY_TAGS = [
  'SAKERNAS',
  'SUSENAS',
  'Sensus Pertanian (ST2023)',
  'Survei Ubinan Padi',
  'Survei Harga Konsumen (SHK)',
  'Updating Direktori Usaha',
  'VHTS (Hotel)',
  'Survei Komoditas Strategis',
];
