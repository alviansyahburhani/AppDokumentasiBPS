import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  LapanganPhoto,
  LapanganRecord,
  SubSeksiBps,
  TahapanKegiatan,
} from '../../types/lapangan';
import {
  SUB_SEKSI_OPTIONS,
  TAHAPAN_OPTIONS,
  QUICK_SURVEY_TAGS,
  BPS_CONFIG,
} from '../../utils/constants';
import { useLocation } from '../../hooks/useLocation';
import { useNetworkSync } from '../../hooks/useNetworkSync';
import { offlineStorage } from '../../database/storage';
import { lapanganApi } from '../../services/api';
import CustomButton from '../../components/CustomButton';
import OfflineBanner from '../../components/OfflineBanner';
import CameraWatermark from '../../components/CameraWatermark';

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
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('MainTabs', { screen: 'LapanganTab' }),
            },
          ]
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
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('MainTabs', { screen: 'LapanganTab' }),
            },
          ]
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
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainTabs', { screen: 'LapanganTab' }),
          },
        ]
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
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#D4FF32' }]}>
              <Icon name="place" size={20} color="#111827" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Lokasi GPS Terverifikasi</Text>
              <Text style={styles.cardSub}>
                {coordinates.addressName}, {coordinates.district}
              </Text>
            </View>
            <View style={styles.badgeAkurat}>
              <Text style={styles.badgeAkuratText}>±{coordinates.accuracy.toFixed(1)}M</Text>
            </View>
          </View>
          <View style={styles.coordBox}>
            <Text style={styles.coordText}>
              LAT: {coordinates.latitude.toFixed(6)} | LNG: {coordinates.longitude.toFixed(6)}
            </Text>
          </View>
        </View>

        {/* Form Input: Nama Kegiatan */}
        <View style={styles.card}>
          <Text style={styles.label}>NAMA KEGIATAN / SURVEI *</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: SAKERNAS Agustus 2026..."
            placeholderTextColor="#9CA3AF"
            value={namaKegiatan}
            onChangeText={setNamaKegiatan}
          />

          {/* Quick Autocomplete Chips */}
          <Text style={styles.subLabel}>TAG CEPAT SURVEI BPS:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tagChipsRow}>
              {QUICK_SURVEY_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagChip,
                    namaKegiatan.includes(tag) && styles.tagChipActive,
                  ]}
                  onPress={() => setNamaKegiatan(tag)}
                >
                  <Text
                    style={[
                      styles.tagChipText,
                      namaKegiatan.includes(tag) && styles.tagChipTextActive,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Sub-Seksi BPS Selection */}
        <View style={styles.card}>
          <Text style={styles.label}>SUB-SEKSI / FUNGSI BPS</Text>
          <View style={styles.optionsWrap}>
            {SUB_SEKSI_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.optionPill,
                  subSeksi === item && styles.optionPillActive,
                ]}
                onPress={() => setSubSeksi(item)}
              >
                <Text
                  style={[
                    styles.optionPillText,
                    subSeksi === item && styles.optionPillTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tahapan Kegiatan */}
        <View style={styles.card}>
          <Text style={styles.label}>TAHAPAN KEGIATAN</Text>
          <View style={styles.optionsWrap}>
            {TAHAPAN_OPTIONS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.optionPill,
                  tahapan === t && styles.optionPillSecondary,
                ]}
                onPress={() => setTahapan(t)}
              >
                <Text
                  style={[
                    styles.optionPillText,
                    tahapan === t && styles.optionPillTextLight,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Progres Slider/Buttons (0% - 100%) */}
        <View style={styles.card}>
          <View style={styles.progresHeader}>
            <Text style={styles.label}>PROGRES PELAKSANAAN</Text>
            <View style={styles.progresPill}>
              <Text style={styles.progresPillText}>{progres}% SELESAI</Text>
            </View>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progres}%` },
              ]}
            />
          </View>
          <View style={styles.progresBtnRow}>
            {[25, 50, 75, 100].map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.progresValBtn,
                  progres === val && styles.progresValBtnActive,
                ]}
                onPress={() => setProgres(val)}
              >
                <Text
                  style={[
                    styles.progresValText,
                    progres === val && styles.progresValTextActive,
                  ]}
                >
                  {val}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Catatan Lapangan */}
        <View style={styles.card}>
          <Text style={styles.label}>CATATAN & KENDALA LAPANGAN (OPSIONAL)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tuliskan catatan blok sensus, responden, atau kendala lapangan..."
            placeholderTextColor="#9CA3AF"
            value={catatan}
            onChangeText={setCatatan}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Galeri Foto Ber-Watermark (Zona B - B18) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#FF7A00' }]}>
              <Icon name="photo-library" size={20} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Foto Ber-Watermark Final</Text>
              <Text style={styles.cardSub}>
                {photos.length} foto siap disatukan dengan metadata
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addPhotoSmallBtn}
              onPress={handleAddMorePhotos}
            >
              <Icon name="add-a-photo" size={16} color="#111827" />
              <Text style={styles.addPhotoSmallText}>+ FOTO</Text>
            </TouchableOpacity>
          </View>

          {photos.length === 0 ? (
            <TouchableOpacity
              style={styles.emptyPhotoBox}
              onPress={handleAddMorePhotos}
            >
              <Icon name="camera-alt" size={32} color="#9CA3AF" />
              <Text style={styles.emptyPhotoText}>Belum ada foto. Tekan untuk jepret.</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.photosGrid}>
              {photos.map((item, idx) => (
                <View key={item.id} style={styles.photoCard}>
                  <TouchableOpacity
                    onPress={() => setPreviewPhoto(item)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: item.uri }} style={styles.photoImg} />
                    <View style={styles.photoWatermarkTag}>
                      <Icon name="verified" size={10} color="#D4FF32" />
                      <Text style={styles.photoWatermarkTagText}>WATERMARK FINAL</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.photoActions}>
                    <Text style={styles.photoIdxText}>Foto #{idx + 1}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemovePhoto(item.id)}
                      style={styles.deletePhotoBtn}
                    >
                      <Icon name="delete-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Tombol Simpan Final (Zona B - B19) */}
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
      <Modal visible={!!previewPhoto} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Preview Foto Watermark</Text>
              <TouchableOpacity onPress={() => setPreviewPhoto(null)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            {previewPhoto && (
              <View style={styles.modalImgWrapper}>
                <Image
                  source={{ uri: previewPhoto.uri }}
                  style={styles.modalImg}
                  resizeMode="cover"
                />
                <View style={styles.modalWatermarkWrap}>
                  <CameraWatermark
                    coordinates={previewPhoto.coordinates}
                    activityTitle={namaKegiatan || 'DOKUMENTASI LAPANGAN BPS'}
                    compact
                  />
                </View>
              </View>
            )}
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
  refreshLocBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#D4FF32',
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#111827',
    borderRadius: 16,
    padding: 14,
    // Solid shadow
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  cardSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  badgeAkurat: {
    backgroundColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeAkuratText: {
    color: '#D4FF32',
    fontSize: 10,
    fontWeight: '900',
  },
  coordBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 8,
    marginTop: 10,
  },
  coordText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  tagChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tagChip: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagChipActive: {
    backgroundColor: '#D4FF32',
  },
  tagChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
  },
  tagChipTextActive: {
    color: '#111827',
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  optionPillActive: {
    backgroundColor: '#D4FF32',
  },
  optionPillSecondary: {
    backgroundColor: '#3B38F6',
  },
  optionPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
  },
  optionPillTextActive: {
    color: '#111827',
  },
  optionPillTextLight: {
    color: '#FFF',
  },
  progresHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progresPill: {
    backgroundColor: '#3B38F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  progresPillText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
  progressBarBackground: {
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#111827',
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D4FF32',
  },
  progresBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  progresValBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#111827',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  progresValBtnActive: {
    backgroundColor: '#111827',
  },
  progresValText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
  },
  progresValTextActive: {
    color: '#D4FF32',
  },
  addPhotoSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D4FF32',
    borderWidth: 1.5,
    borderColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addPhotoSmallText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111827',
  },
  emptyPhotoBox: {
    borderWidth: 2,
    borderColor: '#9CA3AF',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  emptyPhotoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  photoCard: {
    width: '48%',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  photoImg: {
    width: '100%',
    height: 110,
  },
  photoWatermarkTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(17,24,39,0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  photoWatermarkTagText: {
    color: '#FFF',
    fontSize: 7.5,
    fontWeight: '900',
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    borderTopWidth: 1.5,
    borderTopColor: '#111827',
  },
  photoIdxText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
  },
  deletePhotoBtn: {
    padding: 2,
  },
  submitArea: {
    marginTop: 8,
    gap: 8,
  },
  disclaimerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#111827',
    padding: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  modalImgWrapper: {
    height: 380,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  modalImg: {
    width: '100%',
    height: '100%',
  },
  modalWatermarkWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
