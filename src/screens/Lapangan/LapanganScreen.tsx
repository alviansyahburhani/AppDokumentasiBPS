import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { LapanganRecord, SyncStatusType } from '../../types/lapangan';
import { offlineStorage } from '../../database/storage';
import { useNetworkSync } from '../../hooks/useNetworkSync';
import CustomButton from '../../components/CustomButton';
import OfflineBanner from '../../components/OfflineBanner';
import StatusBadge from '../../components/StatusBadge';
import { formatCompactDateTime } from '../../utils/dateUtils';

export default function LapanganScreen() {
  const navigation = useNavigation<any>();
  const [records, setRecords] = useState<LapanganRecord[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SYNCED'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    isOnline,
    pendingCount,
    syncedCount,
    totalCount,
    isSyncing,
    toggleNetwork,
    triggerSync,
  } = useNetworkSync();

  const loadData = () => {
    setRecords(offlineStorage.getAllRecords());
  };

  useEffect(() => {
    loadData();
    const unsub = offlineStorage.subscribe(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    if (isOnline && pendingCount > 0) {
      await triggerSync();
    }
    loadData();
    setIsRefreshing(false);
  };

  const handleManualSync = async () => {
    if (!isOnline) {
      Alert.alert(
        'Perangkat Offline',
        'Harap aktifkan koneksi internet untuk mengunggah antrean ke server Google Apps Script.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Simulasikan Online', onPress: () => toggleNetwork() },
        ]
      );
      return;
    }

    const res = await triggerSync();
    Alert.alert(
      'Sinkronisasi Selesai',
      `Berhasil sinkronisasi ${res.successCount} kegiatan ke Google Drive.`
    );
  };

  const filteredRecords = records.filter((r) => {
    if (filter === 'PENDING') return r.status === 'PENDING_SYNC' || r.status === 'FAILED';
    if (filter === 'SYNCED') return r.status === 'SYNCED';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Kegiatan Lapangan</Text>
          <Text style={styles.headerSub}>Dokumentasi Ber-Watermark BPS</Text>
        </View>

        {/* Network Toggle Button for Testing Offline / Online seamlessly */}
        <TouchableOpacity
          style={[
            styles.networkSwitchBtn,
            isOnline ? styles.networkOnline : styles.networkOffline,
          ]}
          onPress={toggleNetwork}
          activeOpacity={0.8}
        >
          <Icon
            name={isOnline ? 'wifi' : 'wifi-off'}
            size={16}
            color="#111827"
          />
          <Text style={styles.networkSwitchText}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Offline Status Warning Bar */}
      <OfflineBanner isOffline={!isOnline} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* HERO CTA: Buka Kamera Lapangan */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextWrap}>
            <View style={styles.heroBadge}>
              <Icon name="verified" size={12} color="#111827" />
              <Text style={styles.heroBadgeText}>SOP DOKUMENTASI BPS</Text>
            </View>
            <Text style={styles.heroTitle}>Mulai Dokumentasi Lapangan</Text>
            <Text style={styles.heroDesc}>
              Kamera ber-watermark otomatis (Logo, GPS, Tanggal, Jam). Dukungan penuh mode offline.
            </Text>
          </View>
          <CustomButton
            title="BUKA KAMERA"
            variant="dark"
            iconName="add-a-photo"
            onPress={() => navigation.navigate('LapanganCam')}
            style={styles.heroBtn}
          />
        </View>

        {/* METRICS KPI SUMMARY ROW */}
        <View style={styles.kpiRow}>
          {/* Total */}
          <View style={[styles.kpiCard, { backgroundColor: '#FFF' }]}>
            <Text style={styles.kpiVal}>{totalCount}</Text>
            <Text style={styles.kpiLabel}>Total Form</Text>
          </View>

          {/* Pending Queue */}
          <View style={[styles.kpiCard, { backgroundColor: '#FF7A00' }]}>
            <Text style={[styles.kpiVal, { color: '#FFF' }]}>{pendingCount}</Text>
            <Text style={[styles.kpiLabel, { color: '#FFF' }]}>Antrean</Text>
          </View>

          {/* Synced */}
          <View style={[styles.kpiCard, { backgroundColor: '#D4FF32' }]}>
            <Text style={styles.kpiVal}>{syncedCount}</Text>
            <Text style={styles.kpiLabel}>Terkirim</Text>
          </View>
        </View>

        {/* SYNC NOTIFICATION BANNER (Jika ada antrean) */}
        {pendingCount > 0 && (
          <View style={styles.pendingAlertCard}>
            <View style={styles.pendingAlertLeft}>
              <Icon name="cloud-queue" size={24} color="#FFF" />
              <View>
                <Text style={styles.pendingAlertTitle}>
                  {pendingCount} Kegiatan Belum Terunggah
                </Text>
                <Text style={styles.pendingAlertSub}>
                  {isOnline
                    ? 'Koneksi tersedia. Tekan untuk unggah sekarang.'
                    : 'Akan otomatis dikirim saat terhubung internet.'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.syncNowBtn}
              onPress={handleManualSync}
              disabled={isSyncing}
            >
              <Text style={styles.syncNowBtnText}>
                {isSyncing ? 'MENGIRIM...' : 'SINKRONKAN'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FILTER CHIPS */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'ALL' && styles.filterChipActive]}
            onPress={() => setFilter('ALL')}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'ALL' && styles.filterChipTextActive,
              ]}
            >
              Semua ({totalCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filter === 'PENDING' && styles.filterChipActiveWarning,
            ]}
            onPress={() => setFilter('PENDING')}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'PENDING' && styles.filterChipTextWarning,
              ]}
            >
              Antrean Offline ({pendingCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filter === 'SYNCED' && styles.filterChipActiveSuccess,
            ]}
            onPress={() => setFilter('SYNCED')}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'SYNCED' && styles.filterChipTextSuccess,
              ]}
            >
              Terkirim ({syncedCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* LIST KEGIATAN LAPANGAN */}
        <View style={styles.listContainer}>
          {filteredRecords.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="inventory-2" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Belum Ada Kegiatan</Text>
              <Text style={styles.emptyDesc}>
                Silakan jepret foto kegiatan lapangan pertama Anda.
              </Text>
            </View>
          ) : (
            filteredRecords.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recordCard}
                activeOpacity={0.88}
                onPress={() =>
                  navigation.navigate('LapanganDetail', { recordId: item.id })
                }
              >
                <View style={styles.recordHeader}>
                  <View style={styles.subSeksiPill}>
                    <Text style={styles.subSeksiPillText}>{item.subSeksi}</Text>
                  </View>
                  <StatusBadge status={item.status} />
                </View>

                <View style={styles.recordBody}>
                  {/* Photo Thumbnail */}
                  <View style={styles.recordThumbWrap}>
                    <Image
                      source={{
                        uri:
                          item.photos[0]?.uri ||
                          'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
                      }}
                      style={styles.recordThumb}
                    />
                    {item.photos.length > 1 && (
                      <View style={styles.photoCountBadge}>
                        <Text style={styles.photoCountBadgeText}>
                          +{item.photos.length - 1}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Texts & Meta */}
                  <View style={styles.recordInfo}>
                    <Text style={styles.recordTitle} numberOfLines={2}>
                      {item.namaKegiatan}
                    </Text>
                    <Text style={styles.recordTahapan}>
                      Tahap: {item.tahapan}
                    </Text>

                    <View style={styles.recordCoordRow}>
                      <Icon name="pin-drop" size={12} color="#3B38F6" />
                      <Text style={styles.recordCoordText} numberOfLines={1}>
                        {item.lokasi.addressName || 'Kota Malang'}
                      </Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.miniProgressWrap}>
                      <View
                        style={[
                          styles.miniProgressFill,
                          { width: `${item.progres}%` },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                {/* Footer Time & Arrow */}
                <View style={styles.recordFooter}>
                  <Text style={styles.recordTime}>
                    {formatCompactDateTime(new Date(item.createdAt))}
                  </Text>
                  <View style={styles.viewDetailRow}>
                    <Text style={styles.viewDetailText}>Rincian</Text>
                    <Icon name="chevron-right" size={16} color="#111827" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  networkSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#111827',
  },
  networkOnline: {
    backgroundColor: '#D4FF32', // Neon Green
  },
  networkOffline: {
    backgroundColor: '#FF7A00', // Vibrant Orange
  },
  networkSwitchText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111827',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  heroBanner: {
    backgroundColor: '#D4FF32',
    borderWidth: 3,
    borderColor: '#111827',
    borderRadius: 16,
    padding: 16,
    // Solid shadow Neo-Brutalism
    shadowColor: '#111827',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  heroTextWrap: {
    marginBottom: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#111827',
    marginBottom: 8,
  },
  heroBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#111827',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    textTransform: 'uppercase',
  },
  heroDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
    lineHeight: 18,
  },
  heroBtn: {
    marginTop: 4,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    borderWidth: 2.5,
    borderColor: '#111827',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // Solid shadow
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  kpiVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4B5563',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  pendingAlertCard: {
    backgroundColor: '#3B38F6',
    borderWidth: 2.5,
    borderColor: '#111827',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Solid shadow
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  pendingAlertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pendingAlertTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },
  pendingAlertSub: {
    color: '#D4FF32',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  syncNowBtn: {
    backgroundColor: '#D4FF32',
    borderWidth: 1.5,
    borderColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  syncNowBtnText: {
    color: '#111827',
    fontSize: 10,
    fontWeight: '900',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#111827',
    backgroundColor: '#FFF',
  },
  filterChipActive: {
    backgroundColor: '#111827',
  },
  filterChipActiveWarning: {
    backgroundColor: '#FF7A00',
  },
  filterChipActiveSuccess: {
    backgroundColor: '#D4FF32',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  filterChipTextWarning: {
    color: '#FFF',
  },
  filterChipTextSuccess: {
    color: '#111827',
  },
  listContainer: {
    gap: 12,
  },
  emptyState: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
  },
  recordCard: {
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#111827',
    borderRadius: 14,
    padding: 12,
    // Solid shadow
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subSeksiPill: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subSeksiPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#111827',
    textTransform: 'uppercase',
  },
  recordBody: {
    flexDirection: 'row',
    gap: 10,
  },
  recordThumbWrap: {
    width: 76,
    height: 76,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#111827',
    overflow: 'hidden',
    position: 'relative',
  },
  recordThumb: {
    width: '100%',
    height: '100%',
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(17,24,39,0.85)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  photoCountBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  recordInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recordTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
  },
  recordTahapan: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  recordCoordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  recordCoordText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  miniProgressWrap: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 6,
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#3B38F6',
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  recordTime: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  viewDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
  },
});
