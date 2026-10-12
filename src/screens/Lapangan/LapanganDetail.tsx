import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { offlineStorage } from '../../database/storage';
import { useNetworkSync } from '../../hooks/useNetworkSync';
import CustomButton from '../../components/CustomButton';
import { styles } from './LapanganDetail.styles';
import LapanganDetailPhotoViewer from './components/LapanganDetailPhotoViewer';
import LapanganDetailInfoCard from './components/LapanganDetailInfoCard';
import LapanganDetailGpsCard from './components/LapanganDetailGpsCard';
import LapanganDetailSyncCard from './components/LapanganDetailSyncCard';

export default function LapanganDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const recordId: string = route.params?.recordId;

  const record = offlineStorage.getRecordById(recordId);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const { isOnline, triggerSync } = useNetworkSync();

  if (!record) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundCenter}>
          <Text style={styles.notFoundText}>Data kegiatan tidak ditemukan.</Text>
          <CustomButton
            title="KEMBALI"
            variant="dark"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Hapus Dokumentasi?',
      `Apakah Anda yakin ingin menghapus dokumentasi "${record.namaKegiatan}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            offlineStorage.deleteRecord(record.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleSyncThis = async () => {
    if (!isOnline) {
      Alert.alert(
        'Offline',
        'Aktifkan koneksi internet untuk mengunggah dokumentasi ini ke Google Drive.'
      );
      return;
    }
    await triggerSync();
    Alert.alert('Sukses', 'Sinkronisasi berhasil diproses!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Rincian Dokumentasi</Text>
          <Text style={styles.headerSub}>ID: {record.id}</Text>
        </View>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Icon name="delete-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Display with Watermark Overlay & Multi-thumbnail Selector */}
        <LapanganDetailPhotoViewer
          photos={record.photos}
          selectedPhotoIdx={selectedPhotoIdx}
          onSelectPhotoIdx={setSelectedPhotoIdx}
          activityTitle={record.namaKegiatan}
        />

        {/* Status, Title, Sub-Seksi, Tahapan, & Catatan Lapangan */}
        <LapanganDetailInfoCard record={record} />

        {/* Verification & GPS Coordinates Card */}
        <LapanganDetailGpsCard lokasi={record.lokasi} />

        {/* Sync Status & Cloud Integration (Zona D) */}
        <LapanganDetailSyncCard
          status={record.status}
          createdAt={record.createdAt}
          onSync={handleSyncThis}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
