import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { AntreanTamu, TamuRecord, TamuFormData } from '../../types/tamu';
import { tamuStorage } from '../../database/tamuStorage';
import { useNetworkSync } from '../../hooks/useNetworkSync';
import OfflineBanner from '../../components/OfflineBanner';
import CalendarFilterModal, { FilterOptionItem } from '../../components/CalendarFilterModal';
import SearchBarWithFilter from './components/SearchBarWithFilter';
import AntreanTamuCard from './components/AntreanTamuCard';
import HistoryTamuCard from './components/HistoryTamuCard';
import TamuQrModal from './components/TamuQrModal';
import { styles } from './TamuScreen.styles';

type ActiveTabType = 'ANTREAN_QR' | 'ANTREAN_MANUAL' | 'RIWAYAT';
type FilterType = 'SEMUA' | 'TANGGAL' | 'MANUAL' | 'QRCODE';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function TamuScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<ActiveTabType>('ANTREAN_QR');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('SEMUA');

  // Filter Kalender / Tanggal
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());

  const [antreanQrList, setAntreanQrList] = useState<AntreanTamu[]>([]);
  const [antreanManualList, setAntreanManualList] = useState<AntreanTamu[]>([]);
  const [historyList, setHistoryList] = useState<TamuRecord[]>([]);
  const [stats, setStats] = useState(tamuStorage.getStats());

  const { isOnline } = useNetworkSync();

  const loadData = () => {
    setAntreanQrList(tamuStorage.getAntreanList());
    setAntreanManualList(tamuStorage.getAntreanManualList());
    setHistoryList(tamuStorage.getAllRecords());
    setStats(tamuStorage.getStats());
  };

  useEffect(() => {
    loadData();
    const unsub = tamuStorage.subscribe(loadData);
    return () => unsub();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));
    loadData();
    setIsRefreshing(false);
  };

  // Simulasi tamu scan QR
  const handleSimulasiTamuScanQr = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newAntrean: AntreanTamu = {
      id: `antrean_qr_sim_${Date.now()}`,
      metode: 'qrcode',
      nama: `Rian Pratama #${randomNum}`,
      instansi: 'Dinas Komunikasi & Informatika',
      keperluan: 'Koordinasi Integrasi Data Statistik Sektoral',
      bertemuSiapa: 'Tim IPDS (Integrasi Pengolahan Data Statistik)',
      noWhatsapp: '081234567890',
      waktuAntre: new Date().toISOString(),
      statusAntrean: 'MENUNGGU_VERIFIKASI',
    };

    tamuStorage.addAntrean(newAntrean);
    Alert.alert(
      'Tamu Baru Masuk! 📲',
      `${newAntrean.nama} baru saja submit formulir dari Web Form QR Code Meja Lobby.`
    );
  };

  // Proses antrean ke kamera
  const handleProsesAntrean = (item: AntreanTamu) => {
    const formData: TamuFormData = {
      nama: item.nama,
      instansi: item.instansi,
      keperluan: item.keperluan,
      bertemuSiapa: item.bertemuSiapa,
      noWhatsapp: item.noWhatsapp,
      metode: item.metode,
    };
    navigation.navigate('TamuCam', { formData });
  };

  // Search filter
  const applySearchFilter = <T extends { nama: string; instansi: string; bertemuSiapa: string }>(
    list: T[]
  ): T[] => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.nama.toLowerCase().includes(q) ||
        item.instansi.toLowerCase().includes(q) ||
        item.bertemuSiapa.toLowerCase().includes(q)
    );
  };

  // Riwayat filter
  const applyRiwayatFilter = (list: TamuRecord[]): TamuRecord[] => {
    let filtered = list;
    if (activeFilter === 'TANGGAL' && selectedDate) {
      filtered = filtered.filter((r) => {
        const d = new Date(r.waktuCheckIn);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return dateStr === selectedDate;
      });
    } else if (activeFilter === 'MANUAL') {
      filtered = filtered.filter((r) => r.metode === 'manual');
    } else if (activeFilter === 'QRCODE') {
      filtered = filtered.filter((r) => r.metode === 'qrcode');
    }
    return filtered;
  };

  const filteredAntreanQr = applySearchFilter(antreanQrList);
  const filteredAntreanManual = applySearchFilter(antreanManualList);
  const filteredHistory = applyRiwayatFilter(applySearchFilter(historyList));

  const getFilterLabel = () => {
    switch (activeFilter) {
      case 'TANGGAL': {
        if (!selectedDate) return 'Pilih Tanggal';
        const [y, m, d] = selectedDate.split('-');
        return `${d} ${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
      }
      case 'MANUAL': return 'Manual';
      case 'QRCODE': return 'QR Code';
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
      label: 'Semua Tamu',
      icon: 'people',
      desc: 'Tampilkan seluruh riwayat tamu',
      action: () => {
        resetFilter();
        setShowFilterModal(false);
      },
    },
    {
      key: 'TANGGAL',
      label: 'Berdasarkan Tanggal',
      icon: 'calendar-today',
      desc: selectedDate
        ? `Dipilih: ${getFilterLabel()}`
        : 'Pilih tanggal spesifik dari kalender',
    },
    {
      key: 'MANUAL',
      label: 'Via Input Manual',
      icon: 'edit-note',
      desc: 'Tamu yang didaftarkan oleh resepsionis',
      action: () => {
        setActiveFilter('MANUAL');
        setShowFilterModal(false);
      },
    },
    {
      key: 'QRCODE',
      label: 'Via QR Code',
      icon: 'qr-code',
      desc: 'Tamu yang scan QR Code mandiri',
      action: () => {
        setActiveFilter('QRCODE');
        setShowFilterModal(false);
      },
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Buku Tamu Digital</Text>
          <Text style={styles.headerSub}>Resepsionis & Verifikasi Tamu BPS</Text>
        </View>

        <TouchableOpacity
          style={styles.showQrBtn}
          onPress={() => setShowQrCodeModal(true)}
          activeOpacity={0.8}
        >
          <Icon name="qr-code-scanner" size={18} color="#111827" />
          <Text style={styles.showQrBtnText}>QR MEJA</Text>
        </TouchableOpacity>
      </View>

      <OfflineBanner isOffline={!isOnline} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* PILIHAN 2 CARA PENDAFTARAN TAMU */}
        <View style={styles.sectionHeader}>
          <View style={styles.dotIndicator} />
          <Text style={styles.sectionTitle}>PILIH METODE PENDAFTARAN TAMU</Text>
        </View>

        <View style={styles.twoWaysGrid}>
          {/* CARA 1: JALUR MANUAL */}
          <TouchableOpacity
            style={[styles.wayCard, styles.wayCardManual]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('TamuFormManual')}
          >
            <View style={styles.wayHeader}>
              <View style={[styles.wayIconBox, { backgroundColor: '#FF7A00' }]}>
                <Icon name="edit-note" size={24} color="#FFF" />
              </View>
              <View style={styles.wayBadge}>
                <Text style={styles.wayBadgeText}>CARA 1</Text>
              </View>
            </View>
            <Text style={styles.wayTitle}>1. Input Manual</Text>
            <Text style={styles.wayDesc}>
              Petugas mengisi form identitas langsung di HP resepsionis.
            </Text>
            <View style={[styles.wayActionBtn, { backgroundColor: '#111827' }]}>
              <Text style={[styles.wayActionText, { color: '#FFF' }]}>ISI FORM</Text>
              <Icon name="arrow-forward" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>

          {/* CARA 2: JALUR QR CODE */}
          <TouchableOpacity
            style={[styles.wayCard, styles.wayCardQr]}
            activeOpacity={0.9}
            onPress={() => setShowQrCodeModal(true)}
          >
            <View style={styles.wayHeader}>
              <View style={[styles.wayIconBox, { backgroundColor: '#3B38F6' }]}>
                <Icon name="qr-code-2" size={24} color="#FFF" />
              </View>
              <View style={[styles.wayBadge, { backgroundColor: '#3B38F6' }]}>
                <Text style={[styles.wayBadgeText, { color: '#FFF' }]}>CARA 2</Text>
              </View>
            </View>
            <Text style={styles.wayTitle}>2. Scan QRCode</Text>
            <Text style={styles.wayDesc}>
              Tamu scan QR meja, isi form di web, lalu dipotret resepsionis.
            </Text>
            <View style={[styles.wayActionBtn, { backgroundColor: '#D4FF32' }]}>
              <Text style={[styles.wayActionText, { color: '#111827' }]}>LIHAT QR</Text>
              <Icon name="visibility" size={14} color="#111827" />
            </View>
          </TouchableOpacity>
        </View>

        {/* STATISTIK COUNTER */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#FFF' }]}>
            <Text style={styles.statVal}>{stats.menungguQr}</Text>
            <Text style={styles.statLabel}>Antrean QR</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FF7A00' }]}>
            <Text style={[styles.statVal, { color: '#FFF' }]}>{stats.menungguManual}</Text>
            <Text style={[styles.statLabel, { color: '#FFF' }]}>Antrean Manual</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#D4FF32' }]}>
            <Text style={styles.statVal}>{stats.totalSelesai}</Text>
            <Text style={styles.statLabel}>Tamu Selesai</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#3B38F6' }]}>
            <Text style={[styles.statVal, { color: '#FFF' }]}>{stats.manualCount + stats.qrCount}</Text>
            <Text style={styles.statLabel}>Total Riwayat</Text>
          </View>
        </View>

        {/* SEARCH BOX + FILTER BUTTON */}
        <SearchBarWithFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Cari nama tamu, instansi, atau pegawai..."
          isFilterActive={isFilterActive}
          filterLabel={getFilterLabel()}
          onFilterPress={() => setShowFilterModal(true)}
          onResetFilter={resetFilter}
        />

        {/* TAB TOGGLE: Antrean QR | Antrean Manual | Riwayat */}
        <View style={styles.tabToggleRow}>
          <TouchableOpacity
            style={[
              styles.tabToggleBtn,
              activeTab === 'ANTREAN_QR' && styles.tabToggleBtnActive,
            ]}
            onPress={() => setActiveTab('ANTREAN_QR')}
          >
            <Icon
              name="qr-code"
              size={14}
              color={activeTab === 'ANTREAN_QR' ? '#D4FF32' : '#6B7280'}
              style={{ marginBottom: 2 }}
            />
            <Text
              style={[
                styles.tabToggleText,
                activeTab === 'ANTREAN_QR' && styles.tabToggleTextActive,
              ]}
            >
              ANTREAN QR ({antreanQrList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabToggleBtn,
              activeTab === 'ANTREAN_MANUAL' && styles.tabToggleBtnActiveOrange,
            ]}
            onPress={() => setActiveTab('ANTREAN_MANUAL')}
          >
            <Icon
              name="edit-note"
              size={14}
              color={activeTab === 'ANTREAN_MANUAL' ? '#FFF' : '#6B7280'}
              style={{ marginBottom: 2 }}
            />
            <Text
              style={[
                styles.tabToggleText,
                activeTab === 'ANTREAN_MANUAL' && styles.tabToggleTextActive,
              ]}
            >
              ANTREAN MANUAL ({antreanManualList.length})
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
              RIWAYAT ({historyList.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* ═══════ TAB 1: Antrean Tamu (Dari Scan QRCode Meja) ═══════ */}
        {activeTab === 'ANTREAN_QR' && (
          <View style={styles.listArea}>
            <View style={styles.antreanActionHeader}>

            </View>

            {filteredAntreanQr.length === 0 ? (
              <View style={styles.emptyCard}>
                <Icon name="qr-code-scanner" size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>Belum Ada Antrean QR Code</Text>
                <Text style={styles.emptyDesc}>
                  Tamu dapat melakukan scan QR Code meja resepsionis, atau tekan tombol &quot;Simulasi Tamu Scan&quot; di atas untuk mencoba.
                </Text>
              </View>
            ) : (
              filteredAntreanQr.map((item) => (
                <AntreanTamuCard
                  key={item.id}
                  item={item}
                  onProcess={handleProsesAntrean}
                />
              ))
            )}
          </View>
        )}

        {/* ═══════ TAB 2: Antrean Tamu (Dari Input Manual Resepsionis) ═══════ */}
        {activeTab === 'ANTREAN_MANUAL' && (
          <View style={styles.listArea}>
            <View style={styles.antreanActionHeader}>
              <Text style={styles.antreanHeaderSubtitle}>
                Tamu yang didaftarkan langsung oleh petugas resepsionis
              </Text>
              <TouchableOpacity
                style={[styles.simulateBtn, { backgroundColor: '#FF7A00' }]}
                onPress={() => navigation.navigate('TamuFormManual')}
              >
                <Icon name="add" size={14} color="#FFF" />
                <Text style={[styles.simulateBtnText, { color: '#FFF' }]}>Tambah Manual</Text>
              </TouchableOpacity>
            </View>

            {filteredAntreanManual.length === 0 ? (
              <View style={styles.emptyCard}>
                <Icon name="edit-note" size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>Belum Ada Antrean Manual</Text>
                <Text style={styles.emptyDesc}>
                  Tekan tombol &quot;Tambah Manual&quot; atau gunakan menu &quot;1. Input Manual&quot; di atas untuk mendaftarkan tamu secara langsung.
                </Text>
              </View>
            ) : (
              filteredAntreanManual.map((item) => (
                <AntreanTamuCard
                  key={item.id}
                  item={item}
                  onProcess={handleProsesAntrean}
                />
              ))
            )}
          </View>
        )}

        {/* ═══════ TAB 3: Riwayat Tamu Selesai (Manual & QRCode) ═══════ */}
        {activeTab === 'RIWAYAT' && (
          <View style={styles.listArea}>
            {filteredHistory.length === 0 ? (
              <View style={styles.emptyCard}>
                <Icon name="history" size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>Belum Ada Tamu Selesai</Text>
                <Text style={styles.emptyDesc}>
                  Semua tamu yang telah disubmit akan tercatat di sini.
                </Text>
              </View>
            ) : (
              filteredHistory.map((rec) => (
                <HistoryTamuCard
                  key={rec.id}
                  rec={rec}
                  onPress={(id) => navigation.navigate('TamuDetail', { recordId: id })}
                />
              ))
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal QR Code Meja Resepsionis */}
      <TamuQrModal
        visible={showQrCodeModal}
        onClose={() => setShowQrCodeModal(false)}
      />

      {/* Reusable Clean Calendar Filter Modal */}
      <CalendarFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Riwayat Tamu"
        activeFilter={activeFilter}
        options={filterOptions}
        selectedDate={selectedDate}
        onSelectDate={(dateStr) => {
          setSelectedDate(dateStr);
          setActiveFilter('TANGGAL');
        }}
        calendarMonth={calendarMonth}
        calendarYear={calendarYear}
        onChangeMonth={setCalendarMonth}
        onChangeYear={setCalendarYear}
      />
    </SafeAreaView>
  );
}
