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
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TamuFormData, TamuPhotoItem, TamuRecord } from '../../types/tamu';
import { tamuStorage } from '../../database/tamuStorage';
import { tamuApi } from '../../services/api';
import { useNetworkSync } from '../../hooks/useNetworkSync';
import CustomButton from '../../components/CustomButton';
import OfflineBanner from '../../components/OfflineBanner';
import { formatIndonesianDate, formatWatermarkTime } from '../../utils/dateUtils';

export default function TamuRekapSubmit() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const formData: TamuFormData = route.params?.formData;
  const photos: TamuPhotoItem[] = route.params?.photos || [];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<TamuPhotoItem | null>(null);

  const { isOnline } = useNetworkSync();

  if (!formData || photos.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Data formulir atau foto tidak ditemukan.</Text>
          <CustomButton
            title="KEMBALI KE HOME"
            variant="dark"
            onPress={() => navigation.navigate('MainTabs')}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const nowIso = new Date().toISOString();

    const record: TamuRecord = {
      id: `tamu_rec_${Date.now()}`,
      ...formData,
      photos,
      status: isOnline ? 'SYNCED' : 'PENDING_SYNC',
      waktuCheckIn: nowIso,
      syncedAt: isOnline ? nowIso : null,
      waTriggered: isOnline,
    };

    try {
      if (isOnline) {
        // Upload langsung ke server Google Apps Script
        const res = await tamuApi.uploadTamuRecord(record);
        tamuStorage.saveRecord({
          ...record,
          status: 'SYNCED',
          syncedAt: nowIso,
          waTriggered: true,
        });

        Alert.alert(
          'Submit Berhasil! 🚀',
          `Data tamu ${formData.nama} berhasil tersimpan ke folder '${res.folder}' & notifikasi WhatsApp otomatis dikirim ke ${formData.bertemuSiapa}.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('MainTabs', { screen: 'TamuTab' }),
            },
          ]
        );
      } else {
        // Simpan offline ke database lokal
        tamuStorage.saveRecord(record);
        Alert.alert(
          'Tersimpan di Antrean Offline 📦',
          `Perangkat sedang offline. Data tamu ${formData.nama} aman tersimpan di HP dan otomatis dikirim saat kembali online.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('MainTabs', { screen: 'TamuTab' }),
            },
          ]
        );
      }
    } catch (err: any) {
      tamuStorage.saveRecord(record);
      Alert.alert(
        'Tersimpan di Antrean Lokal',
        'Data berhasil diamankan di penyimpanan lokal HP.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainTabs', { screen: 'TamuTab' }),
          },
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
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
          <Text style={styles.headerTitle}>Rekapan Sebelum Dikirim</Text>
          <Text style={styles.headerSub}>Verifikasi Akhir Data Tamu BPS</Text>
        </View>
        <View
          style={[
            styles.metodeBadge,
            formData.metode === 'manual'
              ? styles.metodeBadgeManual
              : styles.metodeBadgeQr,
          ]}
        >
          <Text
            style={[
              styles.metodeBadgeText,
              formData.metode === 'manual'
                ? { color: '#FFF' }
                : { color: '#111827' },
            ]}
          >
            {formData.metode === 'manual' ? 'MANUAL' : 'QR CODE'}
          </Text>
        </View>
      </View>

      <OfflineBanner isOffline={!isOnline} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ringkasan Form Tamu */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconBox}>
              <Icon name="person" size={20} color="#111827" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardSectionTitle}>IDENTITAS TAMU</Text>
              <Text style={styles.namaGuest}>{formData.nama}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Asal Instansi:</Text>
            <Text style={styles.infoVal}>{formData.instansi}</Text>
          </View>

          {formData.tanggal ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tanggal Kunjungan:</Text>
              <Text style={styles.infoVal}>{formData.tanggal}</Text>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bertemu Siapa:</Text>
            <Text style={[styles.infoVal, { color: '#3B38F6' }]}>
              {formData.bertemuSiapa}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>No. WhatsApp:</Text>
            <Text style={styles.infoVal}>{formData.noWhatsapp}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Keperluan:</Text>
            <Text style={styles.infoVal}>{formData.keperluan}</Text>
          </View>
        </View>

        {/* Galeri Foto Ber-Watermark */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBox, { backgroundColor: '#FF7A00' }]}>
              <Icon name="photo-library" size={20} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardSectionTitle}>FOTO DOKUMENTASI TERVERIFIKASI</Text>
              <Text style={styles.photoCountText}>
                {photos.length} Foto ber-watermark (Logo BPS, Waktu, Koordinat)
              </Text>
            </View>
          </View>

          <View style={styles.photosGrid}>
            {photos.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.photoThumbWrap}
                activeOpacity={0.8}
                onPress={() => setPreviewPhoto(item)}
              >
                <Image source={{ uri: item.uri }} style={styles.photoImg} />
                <View style={styles.photoIndexBadge}>
                  <Text style={styles.photoIndexText}>#{index + 1}</Text>
                </View>
                <View style={styles.watermarkVerifiedTag}>
                  <Icon name="verified" size={10} color="#D4FF32" />
                  <Text style={styles.watermarkVerifiedText}>WATERMARK FINAL</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifikasi Info Box */}
        <View style={styles.notificationBox}>
          <Icon name="campaign" size={22} color="#3B38F6" />
          <View style={{ flex: 1 }}>
            <Text style={styles.notificationTitle}>Notifikasi Otomatis Siap Dikirim</Text>
            <Text style={styles.notificationText}>
              Setelah menekan SUBMIT, rekaman akan disimpan ke Google Drive Buku Tamu dan pesan WhatsApp langsung diteruskan kepada {formData.bertemuSiapa}.
            </Text>
          </View>
        </View>

        {/* TOMBOL SUBMIT */}
        <View style={styles.submitArea}>
          <CustomButton
            title={isOnline ? 'SUBMIT BUKU TAMU' : 'SUBMIT KE ANTREAN OFFLINE'}
            variant={isOnline ? 'primary' : 'accent'}
            iconName="send"
            size="lg"
            loading={isSubmitting}
            onPress={handleSubmit}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal Zoom Preview Photo */}
      <Modal visible={!!previewPhoto} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Preview Foto Dokumentasi</Text>
              <TouchableOpacity onPress={() => setPreviewPhoto(null)}>
                <Icon name="close" size={22} color="#111827" />
              </TouchableOpacity>
            </View>
            {previewPhoto && (
              <View style={styles.modalImgBox}>
                <Image
                  source={{ uri: previewPhoto.uri }}
                  style={styles.modalImg}
                  resizeMode="cover"
                />
                <View style={styles.modalWatermarkBadge}>
                  <Text style={styles.modalWatermarkText}>
                    {previewPhoto.watermarkText}
                  </Text>
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
    fontSize: 17,
    fontWeight: '900',
    color: '#111827',
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  metodeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  metodeBadgeManual: {
    backgroundColor: '#FF7A00',
  },
  metodeBadgeQr: {
    backgroundColor: '#D4FF32',
  },
  metodeBadgeText: {
    fontSize: 9,
    fontWeight: '900',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#D4FF32',
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  namaGuest: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },
  infoRow: {
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
  },
  infoVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#111827',
    marginTop: 1,
  },
  photoCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
    marginTop: 2,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  photoThumbWrap: {
    width: '48%',
    height: 130,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#111827',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  photoIndexBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#111827',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  photoIndexText: {
    color: '#FFF',
    fontSize: 8.5,
    fontWeight: '900',
  },
  watermarkVerifiedTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(17,24,39,0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  watermarkVerifiedText: {
    color: '#FFF',
    fontSize: 7.5,
    fontWeight: '900',
  },
  notificationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#3B38F6',
    borderRadius: 12,
    padding: 12,
  },
  notificationTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1E40AF',
  },
  notificationText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#3B82F6',
    marginTop: 2,
    lineHeight: 15,
  },
  submitArea: {
    marginTop: 6,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EF4444',
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
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
  },
  modalImgBox: {
    height: 360,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  modalImg: {
    width: '100%',
    height: '100%',
  },
  modalWatermarkBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(17,24,39,0.9)',
    padding: 8,
  },
  modalWatermarkText: {
    color: '#D4FF32',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 13,
  },
});
