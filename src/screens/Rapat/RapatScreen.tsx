import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SesiRapat } from '../../types/pengelola';
import { pengelolaStorage } from '../../database/pengelolaStorage';
import CalendarFilterModal, { FilterOptionItem } from '../../components/CalendarFilterModal';
import { styles } from './RapatScreen.styles';
import RapatCard from './components/RapatCard';
import RapatFormModal from './components/RapatFormModal';
import RapatQrModal from './components/RapatQrModal';
import RapatSearchBar from './components/RapatSearchBar';

type ActiveRapatTab = 'AKTIF' | 'RIWAYAT';
type FilterType = 'SEMUA' | 'TANGGAL' | 'AKTIF' | 'DITUTUP';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function RapatScreen() {
  const [sesiList, setSesiList] = useState<SesiRapat[]>([]);
  const [stats, setStats] = useState(pengelolaStorage.getStats());

  // Tab & Search & Filter State
  const [activeTab, setActiveTab] = useState<ActiveRapatTab>('AKTIF');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('SEMUA');

  // State Kalender
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());

  // Modal Tambah Sesi Rapat Baru
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [judulRapat, setJudulRapat] = useState('');
  const [tanggal, setTanggal] = useState('Senin, 12 Oktober 2026');
  const [waktu, setWaktu] = useState('09:00 - 12:00 WIB');
  const [ruang, setRuang] = useState('Ruang Rapat Utama Lt. 2');
  const [keterangan, setKeterangan] = useState('');

  // Modal QR Code Presensi
  const [selectedQrSesi, setSelectedQrSesi] = useState<SesiRapat | null>(null);

  const loadData = () => {
    setSesiList(pengelolaStorage.getSesiRapatList());
    setStats(pengelolaStorage.getStats());
  };

  useEffect(() => {
    loadData();
    const unsub = pengelolaStorage.subscribe(loadData);
    return () => unsub();
  }, []);

  // Submit Sesi Baru
  const handleSubmitSesiBaru = () => {
    if (!judulRapat.trim()) {
      Alert.alert('Judul Kosong', 'Harap masukkan nama atau agenda rapat.');
      return;
    }
    if (!ruang.trim()) {
      Alert.alert('Ruangan Kosong', 'Harap tentukan ruang rapat.');
      return;
    }

    const created = pengelolaStorage.tambahSesiRapat({
      judulRapat: judulRapat.trim(),
      tanggalPelaksanaan: tanggal.trim(),
      waktuMulai: waktu.trim(),
      ruangRapat: ruang.trim(),
      keterangan: keterangan.trim() || 'Presensi dan dokumentasi rapat BPS Kota Malang.',
    });

    setShowTambahModal(false);
    setJudulRapat('');
    setKeterangan('');

    Alert.alert(
      'Sesi Rapat Diaktifkan! 📢',
      `Web Form presensi telah AKTIF dan QR Code otomatis dibuat untuk "${created.judulRapat}". Tamu yang scan QR Meja sekarang dapat memilih opsi "Ikut Rapat/Acara".`
    );
  };

  const handleToggleSesi = (id: string, judul: string, currentStatus: string) => {
    const isNowClosing = currentStatus === 'AKTIF';
    Alert.alert(
      isNowClosing ? 'Tutup Sesi Rapat?' : 'Buka Kembali Sesi?',
      isNowClosing
        ? `Menutup sesi "${judul}" akan memindahkannya ke Riwayat dan menonaktifkan pilihan rapat di Web Form tamu.`
        : `Mengaktifkan kembali sesi "${judul}" agar dapat menerima presensi peserta.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: isNowClosing ? 'TUTUP SESI' : 'BUKA SESI',
          style: isNowClosing ? 'destructive' : 'default',
          onPress: () => pengelolaStorage.toggleStatusSesi(id),
        },
      ]
    );
  };

  const handleHapusSesi = (id: string, judul: string) => {
    Alert.alert('Hapus Sesi?', `Hapus catatan sesi "${judul}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'HAPUS',
        style: 'destructive',
        onPress: () => pengelolaStorage.hapusSesi(id),
      },
    ]);
  };

  // --- Search & Filter Logic dengan useMemo ---
  const filteredList = useMemo(() => {
    return sesiList.filter((sesi) => {
      // 1. Filter Tab Sesi
      if (activeTab === 'AKTIF' && sesi.status !== 'AKTIF') return false;
      if (activeTab === 'RIWAYAT' && sesi.status !== 'DITUTUP') return false;

      // 2. Filter Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          sesi.judulRapat.toLowerCase().includes(q) ||
          sesi.ruangRapat.toLowerCase().includes(q) ||
          sesi.tanggalPelaksanaan.toLowerCase().includes(q) ||
          (sesi.keterangan && sesi.keterangan.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 3. Filter Kategori / Kalender
      if (activeFilter === 'TANGGAL' && selectedDate) {
        const d = new Date(sesi.createdAt);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (dateStr !== selectedDate) return false;
      } else if (activeFilter === 'AKTIF' && sesi.status !== 'AKTIF') {
        return false;
      } else if (activeFilter === 'DITUTUP' && sesi.status !== 'DITUTUP') {
        return false;
      }

      return true;
    });
  }, [sesiList, activeTab, searchQuery, activeFilter, selectedDate]);

  const aktifCount = useMemo(() => sesiList.filter((s) => s.status === 'AKTIF').length, [sesiList]);
  const ditutupCount = useMemo(() => sesiList.filter((s) => s.status === 'DITUTUP').length, [sesiList]);

  const getFilterLabel = () => {
    switch (activeFilter) {
      case 'TANGGAL': {
        if (!selectedDate) return 'Pilih Tanggal';
        const [y, m, d] = selectedDate.split('-');
        return `${d} ${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
      }
      case 'AKTIF': return 'Sesi Aktif';
      case 'DITUTUP': return 'Sesi Ditutup';
      default: return 'Semua';
    }
  };

  const isFilterActive = activeFilter !== 'SEMUA';

  const resetFilter = () => {
    setActiveFilter('SEMUA');
    setSelectedDate('');
  };

  const filterOptions: FilterOptionItem<FilterType>[] = [
    {
      key: 'SEMUA',
      label: 'Semua Agenda',
      icon: 'list-alt',
      desc: 'Tampilkan seluruh kegiatan rapat',
      action: () => {
        resetFilter();
        setShowFilterModal(false);
      },
    },
    {
      key: 'TANGGAL',
      label: 'Berdasarkan Tanggal (Kalender)',
      icon: 'calendar-today',
      desc: selectedDate ? `Dipilih: ${getFilterLabel()}` : 'Pilih tanggal spesifik dari kalender',
    },
    {
      key: 'AKTIF',
      label: 'Hanya Sesi Aktif',
      icon: 'sensors',
      desc: 'Rapat yang sedang berlangsung & web form aktif',
      action: () => {
        setActiveFilter('AKTIF');
        setShowFilterModal(false);
      },
    },
    {
      key: 'DITUTUP',
      label: 'Hanya Sesi Ditutup',
      icon: 'history',
      desc: 'Rapat yang telah selesai / diarsipkan',
      action: () => {
        setActiveFilter('DITUTUP');
        setShowFilterModal(false);
      },
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Sesi Rapat BPS</Text>
          <Text style={styles.headerSub}>Kelola Presensi & QR Code Rapat (Zona B)</Text>
        </View>
        <View style={styles.meetingBadge}>
          <Icon name="groups" size={16} color="#111827" />
          <Text style={styles.meetingBadgeText}>RAPAT</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI STATS BAR */}
        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, { backgroundColor: '#D4FF32' }]}>
            <Text style={styles.kpiVal}>{stats.aktifCount}</Text>
            <Text style={styles.kpiLabel}>Sesi Aktif</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor: '#FFF' }]}>
            <Text style={styles.kpiVal}>{stats.ditutupCount}</Text>
            <Text style={styles.kpiLabel}>Riwayat Ditutup</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor: '#3B38F6' }]}>
            <Text style={[styles.kpiVal, { color: '#FFF' }]}>{stats.totalRapat}</Text>
            <Text style={[styles.kpiLabel, { color: '#FFF' }]}>Total Agenda</Text>
          </View>
        </View>

        {/* CTA HERO: TAMBAH SESI BARU */}
        <TouchableOpacity
          style={styles.addSesiHero}
          activeOpacity={0.9}
          onPress={() => setShowTambahModal(true)}
        >
          <View style={styles.addSesiHeroLeft}>
            <View style={styles.iconHeroBox}>
              <Icon name="add" size={24} color="#111827" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addSesiHeroTitle}>Buat Sesi Rapat Baru</Text>
              <Text style={styles.addSesiHeroDesc}>
                Otomatis aktifkan Web Form & generate QR Code presensi peserta.
              </Text>
            </View>
          </View>
          <Icon name="arrow-forward" size={20} color="#111827" />
        </TouchableOpacity>

        {/* SEARCH BOX + FILTER BUTTON */}
        <RapatSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isFilterActive={isFilterActive}
          filterLabel={getFilterLabel()}
          onFilterPress={() => setShowFilterModal(true)}
          onResetFilter={resetFilter}
        />

        {/* TAB TOGGLE: SESI AKTIF vs RIWAYAT RAPAT */}
        <View style={styles.tabToggleRow}>
          <TouchableOpacity
            style={[
              styles.tabToggleBtn,
              activeTab === 'AKTIF' && styles.tabToggleBtnActive,
            ]}
            onPress={() => setActiveTab('AKTIF')}
          >
            <Icon
              name="sensors"
              size={14}
              color={activeTab === 'AKTIF' ? '#D4FF32' : '#6B7280'}
              style={{ marginBottom: 2 }}
            />
            <Text
              style={[
                styles.tabToggleText,
                activeTab === 'AKTIF' && styles.tabToggleTextActive,
              ]}
            >
              SESI AKTIF ({aktifCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabToggleBtn,
              activeTab === 'RIWAYAT' && styles.tabToggleBtnActive,
            ]}
            onPress={() => setActiveTab('RIWAYAT')}
          >
            <Icon
              name="history"
              size={14}
              color={activeTab === 'RIWAYAT' ? '#D4FF32' : '#6B7280'}
              style={{ marginBottom: 2 }}
            />
            <Text
              style={[
                styles.tabToggleText,
                activeTab === 'RIWAYAT' && styles.tabToggleTextActive,
              ]}
            >
              RIWAYAT RAPAT ({ditutupCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* LIST KARTU SESI RAPAT */}
        {filteredList.length === 0 ? (
          <View style={styles.emptyCard}>
            <Icon
              name={activeTab === 'AKTIF' ? 'event-busy' : 'history-toggle-off'}
              size={48}
              color="#9CA3AF"
            />
            <Text style={styles.emptyTitle}>
              {activeTab === 'AKTIF' ? 'Tidak Ada Sesi Rapat Aktif' : 'Belum Ada Riwayat Rapat'}
            </Text>
            <Text style={styles.emptySub}>
              {searchQuery || isFilterActive
                ? 'Tidak ada agenda yang cocok dengan pencarian atau filter Anda.'
                : activeTab === 'AKTIF'
                ? 'Tekan tombol "Buat Sesi Rapat Baru" di atas untuk memulai agenda baru.'
                : 'Sesi rapat yang telah selesai dan ditutup akan tersimpan di sini.'}
            </Text>
          </View>
        ) : (
          filteredList.map((sesi) => (
            <RapatCard
              key={sesi.id}
              sesi={sesi}
              onOpenQr={setSelectedQrSesi}
              onToggleStatus={handleToggleSesi}
              onDelete={handleHapusSesi}
            />
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* MODAL FILTER REUSABLE (DENGAN KALENDER TANGGAL & BULAN) */}
      <CalendarFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Agenda Rapat"
        activeFilter={activeFilter}
        options={filterOptions}
        selectedDate={selectedDate}
        onSelectDate={(dateStr) => {
          setSelectedDate(dateStr);
          setActiveFilter('TANGGAL');
          setShowFilterModal(false);
        }}
        calendarMonth={calendarMonth}
        calendarYear={calendarYear}
        onChangeMonth={setCalendarMonth}
        onChangeYear={setCalendarYear}
      />

      {/* MODAL TAMBAH SESI RAPAT BARU */}
      <RapatFormModal
        visible={showTambahModal}
        onClose={() => setShowTambahModal(false)}
        judulRapat={judulRapat}
        onChangeJudulRapat={setJudulRapat}
        tanggal={tanggal}
        onChangeTanggal={setTanggal}
        waktu={waktu}
        onChangeWaktu={setWaktu}
        ruang={ruang}
        onChangeRuang={setRuang}
        keterangan={keterangan}
        onChangeKeterangan={setKeterangan}
        onSubmit={handleSubmitSesiBaru}
      />

      {/* MODAL LIHAT QR CODE PRESENSI PESERTA */}
      <RapatQrModal
        sesi={selectedQrSesi}
        onClose={() => setSelectedQrSesi(null)}
      />
    </SafeAreaView>
  );
}
