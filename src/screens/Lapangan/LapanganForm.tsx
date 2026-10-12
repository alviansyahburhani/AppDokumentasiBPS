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
import {
  LapanganPhoto,
  LapanganRecord,
  SubSeksiBps,
  TahapanKegiatan,
} from '../../types/lapangan';
import { useLocation } from '../../hooks/useLocation';
import { useNetworkSync } from '../../hooks/useNetworkSync';
import { offlineStorage } from '../../database/storage';
import { lapanganApi } from '../../services/api';
import CustomButton from '../../components/CustomButton';
import OfflineBanner from '../../components/OfflineBanner';
import { styles } from './LapanganForm.styles';
import LapanganGpsCard from './components/LapanganGpsCard';
import LapanganActivityCard from './components/LapanganActivityCard';
import LapanganConfigPickers from './components/LapanganConfigPickers';
import LapanganPhotoGallery from './components/LapanganPhotoGallery';
import LapanganPhotoPreviewModal from './components/LapanganPhotoPreviewModal';

export default function LapanganForm() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const initialPhotos: LapanganPhoto[] = route.params?.initialPhotos || [];
  const editRecordId: string | undefined = route.params?.editRecordId;

  const [photos, setPhotos] = useState<LapanganPhoto[]>(initialPhotos);
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [subSeksi, setSubSeksi] = useState<SubSeksiBps>('Statistik Sosial');
  const [tahapan, setTahapan] = useState<TahapanKegiatan>('Pencacahan / Listing');
  const [progres, setProgres] = useState<number>(50);
  const [catatan, setCatatan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal preview photo zoom
  const [previewPhoto, setPreviewPhoto] = useState<LapanganPhoto | null>(null);

  const { coordinates, refreshLocation } = useLocation();
  const { isOnline } = useNetworkSync();

  const handleAddMorePhotos = () => {
    navigation.navigate('LapanganCam', {
      existingPhotos: photos,
      returnScreen: 'LapanganForm',
    });
  };

  const handleRemovePhoto = (photoId: string) => {
    if (photos.length <= 1) {
      Alert.alert(
        'Minimal 1 Foto',
        'Dokumentasi lapangan wajib memiliki minimal 1 foto ber-watermark.',
        [{ text: 'OK' }]
      );
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const navigateBackToTab = () => {
    navigation.navigate('MainTabs', { screen: 'LapanganTab' });
  };

  const handleSaveDocumentation = async () => {
    if (!namaKegiatan.trim()) {
      Alert.alert('Nama Kegiatan Kosong', 'Harap isi nama kegiatan atau survei BPS.', [
        { text: 'OK' },
      ]);
      return;
    }

    if (photos.length === 0) {
      Alert.alert('Foto Diperlukan', 'Harap sertakan minimal 1 foto dokumentasi.', [
        { text: 'OK' },
      ]);
      return;
    }

    setIsSubmitting(true);

    const recordId = editRecordId || `lapangan_${Date.now()}`;
    const nowIso = new Date().toISOString();

    const record: LapanganRecord = {
      id: recordId,
      namaKegiatan: namaKegiatan.trim(),
      subSeksi,
      tahapan,
      progres,
      catatan: catatan.trim(),
      lokasi: coordinates,
      photos,
      status: isOnline ? 'SYNCED' : 'PENDING_SYNC',
      createdAt: nowIso,
      syncedAt: isOnline ? nowIso : null,
    };

    try {
      if (isOnline) {
        // ZONA C: Online -> Langsung kirim ke Google Apps Script (Drive + Sheets)
        await lapanganApi.uploadLapanganRecord(record);
        offlineStorage.saveRecord({
          ...record,
          status: 'SYNCED',
          syncedAt: nowIso,
        });

        Alert.alert(
          'Sukses Terkirim! 🚀',
          `Dokumentasi ${namaKegiatan} berhasil diunggah ke Google Drive BPS dan dicatat di tab Data_Lapangan.`,
          [{ text: 'OK', onPress: navigateBackToTab }]
        );
      } else {
        // ZONA C: Offline / Gagal -> Masuk Antrean Lokal (Database offline storage)
        offlineStorage.saveRecord({
          ...record,
          status: 'PENDING_SYNC',
          syncedAt: null,
        });

        Alert.alert(
          'Disimpan ke Antrean Offline 📦',
          `Koneksi internet terputus. Dokumentasi ${namaKegiatan} telah tersimpan aman di database lokal HP Anda dan otomatis diunggah saat kembali online.`,
          [{ text: 'OK', onPress: navigateBackToTab }]
        );
      }
    } catch (err: any) {
      // Jika upload online mengalami network failure, fallback ke antrean offline
      offlineStorage.saveRecord({
        ...record,
        status: 'PENDING_SYNC',
        syncErrorMessage: err?.message || 'Network error',
      });

      Alert.alert(
        'Tersimpan di Antrean Offline',
        'Server sementara sibuk. Data telah diamankan di antrean offline HP Anda.',
        [{ text: 'OK', onPress: navigateBackToTab }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Form Lapangan</Text>
          <Text style={styles.headerSub}>Zona B: Dokumentasi Kegiatan BPS</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshLocBtn}
          onPress={refreshLocation}
        >
          <Icon name="gps-fixed" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Online / Offline Status Banner */}
      <OfflineBanner isOffline={!isOnline} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* GPS Verification Card */}
        <LapanganGpsCard coordinates={coordinates} />

        {/* Form Input: Nama Kegiatan & Tag Cepat */}
        <LapanganActivityCard
          namaKegiatan={namaKegiatan}
          onChangeNamaKegiatan={setNamaKegiatan}
        />

        {/* Sub-Seksi, Tahapan, Progres, & Catatan Lapangan */}
        <LapanganConfigPickers
          subSeksi={subSeksi}
          onChangeSubSeksi={setSubSeksi}
          tahapan={tahapan}
          onChangeTahapan={setTahapan}
          progres={progres}
          onChangeProgres={setProgres}
          catatan={catatan}
          onChangeCatatan={setCatatan}
        />

        {/* Galeri Foto Ber-Watermark */}
        <LapanganPhotoGallery
          photos={photos}
          onAddMorePhotos={handleAddMorePhotos}
          onRemovePhoto={handleRemovePhoto}
          onPreviewPhoto={setPreviewPhoto}
        />

        {/* Tombol Simpan Final */}
        <View style={styles.submitArea}>
          <CustomButton
            title={
              isOnline
                ? 'SIMPAN & UPLOAD KE GOOGLE DRIVE'
                : 'SIMPAN KE ANTREAN OFFLINE'
            }
            variant={isOnline ? 'primary' : 'accent'}
            iconName={isOnline ? 'cloud-upload' : 'save'}
            size="lg"
            loading={isSubmitting}
            onPress={handleSaveDocumentation}
          />
          <Text style={styles.disclaimerText}>
            {isOnline
              ? '⚡ Terhubung ke server: Foto otomatis diproses ke tab Data_Lapangan.'
              : '📦 Mode Offline aktif: Foto dienkripsi dan disimpan lokal di HP.'}
          </Text>
        </View>
      </ScrollView>

      {/* Modal Zoom Preview Photo */}
      <LapanganPhotoPreviewModal
        photo={previewPhoto}
        onClose={() => setPreviewPhoto(null)}
        activityTitle={namaKegiatan}
      />
    </SafeAreaView>
  );
}
