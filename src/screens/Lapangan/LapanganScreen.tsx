import React, { useState, useEffect, useMemo } from 'react';
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
import { LapanganRecord } from '../../types/lapangan';
import { offlineStorage } from '../../database/storage';
import { useNetworkSync } from '../../hooks/useNetworkSync';
import OfflineBanner from '../../components/OfflineBanner';
import { styles } from './LapanganScreen.styles';
import LapanganHeroBanner from './components/LapanganHeroBanner';
import LapanganKpiMetrics from './components/LapanganKpiMetrics';
import LapanganPendingAlert from './components/LapanganPendingAlert';
import LapanganFilterChips, { LapanganFilterType } from './components/LapanganFilterChips';
import LapanganRecordCard from './components/LapanganRecordCard';

export default function LapanganScreen() {
  const navigation = useNavigation<any>();
  const [records, setRecords] = useState<LapanganRecord[]>([]);
  const [filter, setFilter] = useState<LapanganFilterType>('ALL');
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

  const filteredRecords = useMemo(() => {
    if (filter === 'PENDING') {
      return records.filter((r) => r.status === 'PENDING_SYNC' || r.status === 'FAILED');
    }
    if (filter === 'SYNCED') {
      return records.filter((r) => r.status === 'SYNCED');
    }
    return records;
  }, [records, filter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Kegiatan Lapangan</Text>
          <Text style={styles.headerSub}>Dokumentasi Ber-Watermark BPS</Text>
        </View>

        {/* Network Toggle Button */}
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
        <LapanganHeroBanner
          onOpenCamera={() => navigation.navigate('LapanganCam')}
        />

        {/* METRICS KPI SUMMARY ROW */}
        <LapanganKpiMetrics
          totalCount={totalCount}
          pendingCount={pendingCount}
          syncedCount={syncedCount}
        />

        {/* SYNC NOTIFICATION BANNER (Jika ada antrean) */}
        <LapanganPendingAlert
          pendingCount={pendingCount}
          isOnline={isOnline}
          isSyncing={isSyncing}
          onSync={handleManualSync}
        />

        {/* FILTER CHIPS */}
        <LapanganFilterChips
          filter={filter}
          onSelectFilter={setFilter}
          totalCount={totalCount}
          pendingCount={pendingCount}
          syncedCount={syncedCount}
        />

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
              <LapanganRecordCard
                key={item.id}
                item={item}
                onPress={(recordId) =>
                  navigation.navigate('LapanganDetail', { recordId })
                }
              />
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
