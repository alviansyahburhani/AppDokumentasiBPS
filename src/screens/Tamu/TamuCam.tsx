import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TamuFormData, TamuPhotoItem } from '../../types/tamu';
import { useLocation } from '../../hooks/useLocation';
import { BPS_CONFIG } from '../../utils/constants';
import { formatIndonesianDate, formatWatermarkTime } from '../../utils/dateUtils';
import CustomButton from '../../components/CustomButton';

export default function TamuCam() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const formData: TamuFormData = route.params?.formData;
  const initialPhotos: TamuPhotoItem[] = route.params?.existingPhotos || [];

  const [photos, setPhotos] = useState<TamuPhotoItem[]>(initialPhotos);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [showTambahFotoModal, setShowTambahFotoModal] = useState(false);
  const [currentClock, setCurrentClock] = useState(new Date());

  const { coordinates, accuracyQuality, refreshLocation } = useLocation();
  const flashAnim = new Animated.Value(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!formData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Data tamu tidak ditemukan.</Text>
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

  const triggerShutterFlash = () => {
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  };

  // Flow: Tombol Foto -> Jepret Foto -> Tambah Foto? (Ya / Tidak)
  const handleShutterPress = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    triggerShutterFlash();

    setTimeout(() => {
      const now = new Date();
      const dateStr = formatIndonesianDate(now);
      const timeStr = formatWatermarkTime(now);

      const newPhoto: TamuPhotoItem = {
        id: `tamu_photo_${Date.now()}_${photos.length + 1}`,
        uri:
          photos.length === 0
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80' // Foto 1: Wajah / Tamu
            : 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80', // Foto 2+: KTP / Dokumen
        timestamp: now.toISOString(),
        coordinates,
        watermarkText: `[BPS KOTA MALANG] ${formData.nama} (${formData.instansi})\nGPS: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)} (±${coordinates.accuracy.toFixed(1)}m)\n${dateStr} - ${timeStr}`,
      };

      setPhotos((prev) => [...prev, newPhoto]);
      setIsCapturing(false);
      // Sesuai Diagram: Setelah tombol foto, tanyakan "Tambah Foto?"
      setShowTambahFotoModal(true);
    }, 300);
  };

  const handlePilihTambahFotoLagi = () => {
    // Alur diagram: Tambah Foto? Ya -> Kembali ke Ambil Dokumentasi
    setShowTambahFotoModal(false);
  };

  const handleLanjutKeRekapan = () => {
    // Alur diagram: Tambah Foto? Tidak -> Rekapan sebelum Dikirim
    setShowTambahFotoModal(false);
    navigation.navigate('TamuRekapSubmit', {
      formData,
      photos,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* VIEWFINDER SCREEN */}
      <View style={styles.viewfinderContainer}>
        {/* Mock realistic viewfinder feed */}
        <Image
          source={{
            uri:
              photos.length === 0
                ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1080&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1080&auto=format&fit=crop&q=80',
          }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {/* Shutter White Flash Animation */}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.flashOverlay, { opacity: flashAnim }]}
        />

        {/* TOP CONTROLS BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
            <Icon name="close" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.gpsBadge} onPress={refreshLocation}>
            <Icon name="my-location" size={13} color="#111827" />
            <Text style={styles.gpsBadgeText}>
              GPS: ±{coordinates.accuracy.toFixed(1)}M
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => setCameraType(cameraType === 'front' ? 'back' : 'front')}
          >
            <Icon name="flip-camera-android" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* TARGET GUIDE OVERLAY */}
        <View style={styles.focusFrame}>
          <Text style={styles.focusLabel}>
            {photos.length === 0
              ? 'Foto 1: Posisikan Wajah / Tamu'
              : `Foto ${photos.length + 1}: Posisikan Dokumen / KTP`}
          </Text>
        </View>

        {/* WATERMARK LIVE RESMI (Logo BPS, Tanggal Waktu, GPS Kordinat) */}
        <View style={styles.watermarkCard}>
          <View style={styles.watermarkHeader}>
            <View style={styles.watermarkLogoWrap}>
              <Image
                source={{ uri: BPS_CONFIG.LOGO_URI }}
                style={styles.watermarkLogo}
                resizeMode="contain"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.watermarkInstansi}>{BPS_CONFIG.INSTANSI_NAME}</Text>
              <Text style={styles.watermarkSatker}>LOBBY BUKU TAMU • {BPS_CONFIG.SATKER_NAME}</Text>
            </View>
            <View style={styles.verifiedTag}>
              <Text style={styles.verifiedTagText}>DOKUMENTASI TAMU</Text>
            </View>
          </View>

          <View style={styles.watermarkDivider} />

          {/* Form details & GPS */}
          <View style={styles.watermarkBody}>
            <View style={{ flex: 1.2 }}>
              <Text style={styles.watermarkNama} numberOfLines={1}>
                {formData.nama.toUpperCase()}
              </Text>
              <Text style={styles.watermarkInstansiText} numberOfLines={1}>
                {formData.instansi}
              </Text>
              <Text style={styles.watermarkBertemu} numberOfLines={1}>
                Bertemu: {formData.bertemuSiapa}
              </Text>
            </View>

            <View style={{ flex: 1.1, alignItems: 'flex-end' }}>
              <View style={styles.coordRow}>
                <Icon name="pin-drop" size={11} color="#D4FF32" />
                <Text style={styles.watermarkCoords}>
                  {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                </Text>
              </View>
              <Text style={styles.watermarkTime}>
                {formatIndonesianDate(currentClock)}
              </Text>
              <Text style={styles.watermarkClock}>
                {formatWatermarkTime(currentClock)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* BOTTOM CONTROLS & THUMBNAILS */}
      <View style={styles.bottomArea}>
        {/* Strip foto yang sudah diambil */}
        {photos.length > 0 && (
          <View style={styles.thumbStrip}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.thumbRow}>
                {photos.map((item, idx) => (
                  <View key={item.id} style={styles.thumbBox}>
                    <Image source={{ uri: item.uri }} style={styles.thumbImg} />
                    <View style={styles.thumbBadge}>
                      <Text style={styles.thumbBadgeText}>#{idx + 1}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={handleLanjutKeRekapan}
            >
              <Text style={styles.doneBtnText}>REKAPAN ({photos.length})</Text>
              <Icon name="arrow-forward" size={16} color="#111827" />
            </TouchableOpacity>
          </View>
        )}

        {/* TOMBOL FOTO */}
        <View style={styles.shutterRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleShutterPress}
            style={styles.shutterOuter}
          >
            <View style={styles.shutterInner}>
              <Icon name="photo-camera" size={32} color="#111827" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL DIALOG "TAMBAH FOTO?" (Sesuai Diagram) */}
      <Modal visible={showTambahFotoModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Icon name="add-a-photo" size={32} color="#FF7A00" />
            </View>
            <Text style={styles.modalTitle}>Tambah Foto?</Text>
            <Text style={styles.modalDesc}>
              Foto dokumentasi #{photos.length} berhasil diambil. Apakah Anda ingin mengambil foto tambahan (misal: KTP / surat tugas / responden)?
            </Text>

            <View style={styles.modalBtnColumn}>
              {/* YA -> Ambil Dokumentasi lagi */}
              <CustomButton
                title="YA, TAMBAH FOTO LAGI"
                variant="accent"
                iconName="photo-camera"
                onPress={handlePilihTambahFotoLagi}
                style={{ width: '100%' }}
              />

              {/* TIDAK -> Rekapan sebelum Dikirim */}
              <CustomButton
                title="TIDAK, LANJUT KE REKAPAN"
                variant="primary"
                iconName="arrow-forward"
                onPress={handleLanjutKeRekapan}
                style={{ width: '100%', marginTop: 8 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EF4444',
  },
  viewfinderContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  flashOverlay: {
    backgroundColor: '#FFF',
    zIndex: 99,
  },
  topBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D4FF32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#111827',
  },
  gpsBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111827',
  },
  focusFrame: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    height: 250,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#D4FF32',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusLabel: {
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    overflow: 'hidden',
  },
  watermarkCard: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(17, 24, 39, 0.92)',
    borderWidth: 2,
    borderColor: '#D4FF32',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    zIndex: 10,
  },
  watermarkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  watermarkLogoWrap: {
    width: 24,
    height: 24,
    backgroundColor: '#FFF',
    borderRadius: 4,
    padding: 2,
  },
  watermarkLogo: {
    width: '100%',
    height: '100%',
  },
  watermarkInstansi: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  watermarkSatker: {
    color: '#D4FF32',
    fontSize: 8.5,
    fontWeight: '800',
  },
  verifiedTag: {
    backgroundColor: '#FF7A00',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedTagText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  watermarkDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 6,
  },
  watermarkBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  watermarkNama: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
  watermarkInstansiText: {
    color: '#D1D5DB',
    fontSize: 9,
    fontWeight: '600',
  },
  watermarkBertemu: {
    color: '#D4FF32',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  watermarkCoords: {
    color: '#D4FF32',
    fontSize: 8.5,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  watermarkTime: {
    color: '#E5E7EB',
    fontSize: 8,
    fontWeight: '600',
    marginTop: 2,
  },
  watermarkClock: {
    color: '#9CA3AF',
    fontSize: 8,
    fontWeight: '600',
  },
  bottomArea: {
    backgroundColor: '#111827',
    borderTopWidth: 3,
    borderTopColor: '#262626',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  thumbStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  thumbRow: {
    flexDirection: 'row',
    gap: 8,
  },
  thumbBox: {
    width: 52,
    height: 52,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D4FF32',
    overflow: 'hidden',
    position: 'relative',
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
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D4FF32',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#111827',
    marginLeft: 12,
  },
  doneBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111827',
  },
  shutterRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#D4FF32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: '#111827',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    // Solid shadow
    shadowColor: '#111827',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  modalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF7ED',
    borderWidth: 2,
    borderColor: '#FF7A00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  modalDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  modalBtnColumn: {
    width: '100%',
    marginTop: 18,
  },
});
