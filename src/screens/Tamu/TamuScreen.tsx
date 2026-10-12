import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { AntreanTamu, TamuRecord, TamuFormData } from '../../types/tamu';
import { tamuStorage } from '../../database/tamuStorage';
import { useNetworkSync } from '../../hooks/useNetworkSync';
import OfflineBanner from '../../components/OfflineBanner';
import CustomButton from '../../components/CustomButton';
import { formatCompactDateTime } from '../../utils/dateUtils';

export default function TamuScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'ANTREAN_QR' | 'RIWAYAT'>('ANTREAN_QR');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);

  const [antreanList, setAntreanList] = useState<AntreanTamu[]>([]);
  const [historyList, setHistoryList] = useState<TamuRecord[]>([]);
  const [stats, setStats] = useState(tamuStorage.getStats());

  const { isOnline } = useNetworkSync();

  const loadData = () => {
    setAntreanList(tamuStorage.getAntreanList());
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

  // Simulasi jika ada tamu baru yang scan QR code di meja dan submit web form
  const handleSimulasiTamuScanQr = () => {
    const mockNames = [
      'Bambang Wijaya, S.Kom',
      'Prof. Dr. Agus Prasetyo',
      'Maya Sari, S.E.',
      'Rizky Pratama',
    ];
    const mockInstansi = [
      'Bappeda Provinsi Jatim',
      'Universitas Negeri Malang',
      'PT Telkom Indonesia',
      'Dinas Pertanian',
    ];

    const randomIdx = Math.floor(Math.random() * mockNames.length);
    const newAntrean: AntreanTamu = {
      id: `antrean_qr_${Date.now()}`,
      metode: 'qrcode',
      nama: mockNames[randomIdx],
      instansi: mockInstansi[randomIdx],
      keperluan: 'Konsultasi Rekomendasi Kegiatan Statistik Sektoral (ROMANTIK)',
      bertemuSiapa: 'Budi Santoso (Statistisi Ahli Muda)',
      noWhatsapp: `08123456${Math.floor(1000 + Math.random() * 9000)}`,
      waktuAntre: new Date().toISOString(),
      statusAntrean: 'MENUNGGU_VERIFIKASI',
    };

    tamuStorage.addAntrean(newAntrean);
    Alert.alert(
      'Tamu Baru Masuk! 📲',
      `${newAntrean.nama} baru saja submit formulir dari Web Form QR Code Meja Lobby.`
    );
  };

  // Navigasi untuk tamu dari antrean QR ke kamera dokumentasi
  const handleProsesAntreanQr = (item: AntreanTamu) => {
    const formData: TamuFormData = {
      nama: item.nama,
      instansi: item.instansi,
      keperluan: item.keperluan,
      bertemuSiapa: item.bertemuSiapa,
      noWhatsapp: item.noWhatsapp,
      metode: 'qrcode',
    };
    navigation.navigate('TamuCam', { formData });
  };

  const filteredAntrean = antreanList.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instansi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bertemuSiapa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHistory = historyList.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instansi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bertemuSiapa.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {/* PILIHAN 2 CARA PENDAFTARAN TAMU (SESUAI DIAGRAM) */}
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
          <View style={[styles.statCard, { backgroundColor: '#D4FF32' }]}>
            <Text style={styles.statVal}>{stats.totalSelesai}</Text>
            <Text style={styles.statLabel}>Tamu Selesai</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FF7A00' }]}>
            <Text style={[styles.statVal, { color: '#FFF' }]}>{stats.manualCount}</Text>
            <Text style={[styles.statLabel, { color: '#FFF' }]}>Via Manual</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#3B38F6' }]}>
            <Text style={[styles.statVal, { color: '#FFF' }]}>{stats.qrCount}</Text>
            <Text style={[styles.statLabel, { color: '#FFF' }]}>Via QR Code</Text>
          </View>
        </View>

        {/* SEARCH BOX */}
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#111827" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama tamu, instansi, atau pegawai..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={18} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* TAB TOGGLE: Antrean QR vs Riwayat Tamu */}
        <View style={styles.tabToggleRow}>
          <TouchableOpacity
            style={[
              styles.tabToggleBtn,
              activeTab === 'ANTREAN_QR' && styles.tabToggleBtnActive,
            ]}
            onPress={() => setActiveTab('ANTREAN_QR')}
          >
            <Text
              style={[
                styles.tabToggleText,
                activeTab === 'ANTREAN_QR' && styles.tabToggleTextActive,
              ]}
            >
              ANTREAN HASIL QR ({antreanList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabToggleBtn,
              activeTab === 'RIWAYAT' && styles.tabToggleBtnActive,
            ]}
            onPress={() => setActiveTab('RIWAYAT')}
          >
            <Text
              style={[
                styles.tabToggleText,
                activeTab === 'RIWAYAT' && styles.tabToggleTextActive,
              ]}
            >
              RIWAYAT BUKU TAMU ({historyList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabToggleBtn,
              activeTab === 'RIWAYAT' && styles.tabToggleBtnActive,
            ]}
            onPress={() => setActiveTab('RIWAYAT')}
          >
            <Text
              style={[
                styles.tabToggleText,
                activeTab === 'RIWAYAT' && styles.tabToggleTextActive,
              ]}
            >
              RIWAYAT BUKU TAMU ({historyList.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: Antrean Tamu (Dari Scan QRCode Meja) */}
        {activeTab === 'ANTREAN_QR' ? (
          <View style={styles.listArea}>
            <View style={styles.antreanActionHeader}>
              <Text style={styles.antreanHeaderSubtitle}>
                Tamu yang telah mengisi Web Form via Scan QR Meja
              </Text>
              <TouchableOpacity
                style={styles.simulateBtn}
                onPress={handleSimulasiTamuScanQr}
              >
                <Icon name="add" size={14} color="#111827" />
                <Text style={styles.simulateBtnText}>Simulasi Tamu Scan</Text>
              </TouchableOpacity>
            </View>

            {filteredAntrean.length === 0 ? (
              <View style={styles.emptyCard}>
                <Icon name="qr-code-scanner" size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>Belum Ada Antrean QR Code</Text>
                <Text style={styles.emptyDesc}>
                  Tamu dapat melakukan scan QR Code meja resepsionis, atau tekan tombol &quot;Simulasi Tamu Scan&quot; di atas untuk mencoba.
                </Text>
              </View>
            ) : (
              filteredAntrean.map((item) => (
                <View key={item.id} style={styles.antreanCard}>
                  <View style={styles.antreanTopRow}>
                    <View style={styles.qrBadge}>
                      <Icon name="qr-code" size={12} color="#FFF" />
                      <Text style={styles.qrBadgeText}>HASIL SCAN QR</Text>
                    </View>
                    <Text style={styles.antreanTime}>
                      {formatCompactDateTime(new Date(item.waktuAntre))}
                    </Text>
                  </View>

                  <Text style={styles.guestName}>{item.nama}</Text>
                  <Text style={styles.guestInstansi}>{item.instansi}</Text>

                  <View style={styles.guestDetailsBox}>
                    <Text style={styles.detailLabel}>Bertemu Siapa:</Text>
                    <Text style={[styles.detailVal, { color: '#3B38F6' }]}>
                      {item.bertemuSiapa}
                    </Text>

                    <Text style={[styles.detailLabel, { marginTop: 4 }]}>
                      Keperluan:
                    </Text>
                    <Text style={styles.detailVal} numberOfLines={2}>
                      {item.keperluan}
                    </Text>
                  </View>

                  {/* Lanjut ke Ambil Dokumentasi */}
                  <CustomButton
                    title="AMBIL DOKUMENTASI FOTO"
                    variant="primary"
                    iconName="photo-camera"
                    onPress={() => handleProsesAntreanQr(item)}
                    style={{ marginTop: 12 }}
                  />
                </View>
              ))
            )}
          </View>
        ) : (
          /* TAB 2: Riwayat Tamu Selesai (Manual & QRCode) */
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
                <TouchableOpacity
                  key={rec.id}
                  style={styles.historyCard}
                  activeOpacity={0.88}
                  onPress={() =>
                    navigation.navigate('TamuDetail', { recordId: rec.id })
                  }
                >
                  <View style={styles.historyHeader}>
                    <View style={styles.historyThumbWrap}>
                      <Image
                        source={{
                          uri:
                            rec.photos[0]?.uri ||
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
                        }}
                        style={styles.historyThumb}
                      />
                      {rec.photos.length > 1 && (
                        <View style={styles.thumbCountPill}>
                          <Text style={styles.thumbCountText}>
                            +{rec.photos.length - 1}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.historyInfo}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View
                          style={[
                            styles.metodePillMini,
                            rec.metode === 'manual'
                              ? { backgroundColor: '#FF7A00' }
                              : { backgroundColor: '#3B38F6' },
                          ]}
                        >
                          <Text style={styles.metodePillMiniText}>
                            {rec.metode === 'manual' ? 'MANUAL' : 'QR CODE'}
                          </Text>
                        </View>
                        <Text style={styles.historyTime}>
                          {formatCompactDateTime(new Date(rec.waktuCheckIn))}
                        </Text>
                      </View>

                      <Text style={styles.historyNama}>{rec.nama}</Text>
                      <Text style={styles.historyInstansi}>{rec.instansi}</Text>
                      <Text style={styles.historyBertemu} numberOfLines={1}>
                        Bertemu: {rec.bertemuSiapa}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.historyFooter}>
                    <View style={styles.footerTag}>
                      <Icon name="verified" size={12} color="#111827" />
                      <Text style={styles.footerTagText}>
                        {rec.photos.length} FOTO WATERMARK
                      </Text>
                    </View>
                    <View style={styles.viewRow}>
                      <Text style={styles.viewRowText}>Rincian</Text>
                      <Icon name="chevron-right" size={16} color="#111827" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* MODAL QR CODE MEJA BPS (CARA 2: QR CODE) */}
      <Modal visible={showQrCodeModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.qrModalCard}>
            <View style={styles.qrModalHeader}>
              <View>
                <Text style={styles.qrModalTitle}>QR Code Meja Resepsionis</Text>
                <Text style={styles.qrModalSubtitle}>
                  Tamu dapat melakukan scan langsung dengan kamera HP
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowQrCodeModal(false)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* QR Code Container */}
            <View style={styles.qrCodeBox}>
              <Image
                source={{
                  uri: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://script.google.com/macros/s/BPS_BUKU_TAMU_LOBBY/exec',
                }}
                style={styles.qrImage}
                resizeMode="contain"
              />
              <Text style={styles.qrCaption}>
                Scan untuk membuka Web Form Buku Tamu BPS Kota Malang
              </Text>
            </View>

            {/* Tombol Cepat Simulasi */}
            <CustomButton
              title="SIMULASIKAN TAMU SUBMIT FORM"
              variant="primary"
              iconName="send"
              onPress={() => {
                setShowQrCodeModal(false);
                handleSimulasiTamuScanQr();
              }}
              style={{ marginTop: 14 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 3,
    borderBottomColor: '#111827',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  showQrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D4FF32',
    borderWidth: 2,
    borderColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  showQrBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111827',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111827',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 0.5,
  },
  twoWaysGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  wayCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#111827',
    padding: 14,
    // Solid shadow Neo-Brutalism
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  wayCardManual: {
    backgroundColor: '#FFF',
  },
  wayCardQr: {
    backgroundColor: '#EFF6FF',
  },
  wayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  wayIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wayBadge: {
    backgroundColor: '#FF7A00',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  wayBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FFF',
  },
  wayTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111827',
  },
  wayDesc: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 15,
    minHeight: 45,
  },
  wayActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 8,
    paddingVertical: 7,
    marginTop: 8,
  },
  wayActionText: {
    fontSize: 11,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#111827',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#111827',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  statLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#111827',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  tabToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabToggleBtn: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabToggleBtnActive: {
    backgroundColor: '#111827',
  },
  tabToggleText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111827',
  },
  tabToggleTextActive: {
    color: '#D4FF32',
  },
  listArea: {
    gap: 12,
  },
  antreanActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  antreanHeaderSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6B7280',
    flex: 1,
  },
  simulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#D4FF32',
    borderWidth: 1.5,
    borderColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  simulateBtnText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#111827',
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  emptyDesc: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  antreanCard: {
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#111827',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  antreanTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  qrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#3B38F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qrBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FFF',
  },
  antreanTime: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  guestName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  guestInstansi: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  guestDetailsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 10,
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#6B7280',
  },
  detailVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#111827',
    marginTop: 1,
  },
  historyCard: {
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#111827',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  historyThumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#111827',
    overflow: 'hidden',
    position: 'relative',
  },
  historyThumb: {
    width: '100%',
    height: '100%',
  },
  thumbCountPill: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#111827',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  thumbCountText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  historyInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  metodePillMini: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metodePillMiniText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#FFF',
  },
  historyTime: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  historyNama: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    marginTop: 2,
  },
  historyInstansi: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  historyBertemu: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#3B38F6',
    marginTop: 2,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D4FF32',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#111827',
  },
  footerTagText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#111827',
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewRowText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  qrModalCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#111827',
    padding: 18,
    // Solid shadow
    shadowColor: '#111827',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  qrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  qrModalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  qrModalSubtitle: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  qrCodeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#111827',
    padding: 16,
    marginTop: 14,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  qrCaption: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginTop: 10,
  },
});
