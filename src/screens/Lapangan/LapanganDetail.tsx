import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { offlineStorage } from '../../database/storage';
import { formatIndonesianDate, formatWatermarkTime } from '../../utils/dateUtils';
import StatusBadge from '../../components/StatusBadge';
import CameraWatermark from '../../components/CameraWatermark';
import CustomButton from '../../components/CustomButton';
import { useNetworkSync } from '../../hooks/useNetworkSync';

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

  const selectedPhoto = record.photos[selectedPhotoIdx] || record.photos[0];

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
        {/* Photo Display with Watermark Overlay */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: selectedPhoto.uri }}
            style={styles.mainPhoto}
            resizeMode="cover"
          />
          <View style={styles.watermarkWrap}>
            <CameraWatermark
              coordinates={selectedPhoto.coordinates}
              activityTitle={record.namaKegiatan}
              compact
            />
          </View>
        </View>

        {/* Thumbnail Selector if multiple photos */}
        {record.photos.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.multiThumbRow}>
              {record.photos.map((p, index) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.thumbBox,
                    selectedPhotoIdx === index && styles.thumbBoxActive,
                  ]}
                  onPress={() => setSelectedPhotoIdx(index)}
                >
                  <Image source={{ uri: p.uri }} style={styles.thumbImg} />
                  <View style={styles.thumbBadge}>
                    <Text style={styles.thumbBadgeText}>#{index + 1}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Status & General Info Card */}
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <StatusBadge status={record.status} />
            <View style={styles.progresPill}>
              <Text style={styles.progresPillText}>
                PROGRES: {record.progres}%
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{record.namaKegiatan}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Icon name="business" size={12} color="#111827" />
              <Text style={styles.metaBadgeText}>{record.subSeksi}</Text>
            </View>
            <View style={[styles.metaBadge, { backgroundColor: '#E0E7FF' }]}>
              <Icon name="timeline" size={12} color="#3B38F6" />
              <Text style={[styles.metaBadgeText, { color: '#3B38F6' }]}>
                {record.tahapan}
              </Text>
            </View>
          </View>

          {record.catatan ? (
            <View style={styles.catatanBox}>
              <Text style={styles.catatanLabel}>CATATAN LAPANGAN:</Text>
              <Text style={styles.catatanText}>{record.catatan}</Text>
            </View>
          ) : null}
        </View>

        {/* Verification & GPS Coordinates Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>METADATA VERIFIKASI GPS</Text>
          <View style={styles.gpsGrid}>
            <View style={styles.gpsItem}>
              <Text style={styles.gpsLabel}>Latitude</Text>
              <Text style={styles.gpsVal}>
                {record.lokasi.latitude.toFixed(6)}
              </Text>
            </View>
            <View style={styles.gpsItem}>
              <Text style={styles.gpsLabel}>Longitude</Text>
              <Text style={styles.gpsVal}>
                {record.lokasi.longitude.toFixed(6)}
              </Text>
            </View>
            <View style={styles.gpsItem}>
              <Text style={styles.gpsLabel}>Akurasi Satelit</Text>
              <Text style={styles.gpsVal}>
                ±{record.lokasi.accuracy.toFixed(1)} Meter
              </Text>
            </View>
            <View style={styles.gpsItem}>
              <Text style={styles.gpsLabel}>Alamat / Wilayah</Text>
              <Text style={styles.gpsVal}>
                {record.lokasi.addressName || 'Kota Malang'}
              </Text>
            </View>
          </View>
        </View>

        {/* Sync Status & Cloud Integration (Zona D) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>STATUS BACKEND GOOGLE APPS SCRIPT</Text>
          <View style={styles.backendRow}>
            <Icon
              name={record.status === 'SYNCED' ? 'cloud-done' : 'cloud-queue'}
              size={24}
              color={record.status === 'SYNCED' ? '#10B981' : '#FF7A00'}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.backendStatusText}>
                {record.status === 'SYNCED'
                  ? 'Tersimpan di Google Drive & Tab Data_Lapangan'
                  : 'Menunggu koneksi stabil untuk diunggah (Antrean Offline)'}
              </Text>
              <Text style={styles.backendDate}>
                Dibuat: {formatIndonesianDate(new Date(record.createdAt))} -{' '}
                {formatWatermarkTime(new Date(record.createdAt))}
              </Text>
            </View>
          </View>

          {record.status === 'PENDING_SYNC' && (
            <CustomButton
              title="UNGGAH SEKARANG"
              variant="accent"
              iconName="cloud-upload"
              onPress={handleSyncThis}
              style={{ marginTop: 12 }}
            />
          )}
        </View>

        <View style={{ height: 40 }} />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 3,
    borderBottomColor: '#111827',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  photoContainer: {
    height: 380,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#111827',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
    // Solid shadow
    shadowColor: '#111827',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
  },
  watermarkWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  multiThumbRow: {
    flexDirection: 'row',
    gap: 8,
  },
  thumbBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#111827',
    overflow: 'hidden',
    position: 'relative',
  },
  thumbBoxActive: {
    borderColor: '#D4FF32',
    borderWidth: 3,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#111827',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  thumbBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  card: {
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#111827',
    borderRadius: 16,
    padding: 16,
    // Solid shadow
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progresPill: {
    backgroundColor: '#3B38F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  progresPillText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginTop: 10,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#111827',
  },
  catatanBox: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  catatanLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#6B7280',
    marginBottom: 4,
  },
  catatanText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  gpsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gpsItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  gpsLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#6B7280',
  },
  gpsVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
    marginTop: 2,
  },
  backendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backendStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  backendDate: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  notFoundCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6B7280',
  },
});
