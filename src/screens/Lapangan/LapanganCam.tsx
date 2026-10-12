import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LapanganPhoto } from '../../types/lapangan';
import { useLocation } from '../../hooks/useLocation';
import CameraWatermark from '../../components/CameraWatermark';
import { generateMockFieldPhoto } from '../../utils/imageUtils';

export default function LapanganCam() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const initialPhotos: LapanganPhoto[] = route.params?.existingPhotos || [];
  const returnScreen: string = route.params?.returnScreen || 'LapanganForm';

  const [photos, setPhotos] = useState<LapanganPhoto[]>(initialPhotos);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('auto');
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentClock, setCurrentClock] = useState(new Date());

  const { coordinates, isSearching, accuracyQuality, refreshLocation } = useLocation();

  // Animasi shutter flash
  const flashAnim = new Animated.Value(0);

  // Update live clock every second for watermark
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentClock(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCapture = () => {
    if (isCapturing) return;
    setIsCapturing(true);

    // Trigger visual shutter flash
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      const newPhoto = generateMockFieldPhoto(coordinates);
      setPhotos((prev) => [...prev, newPhoto]);
      setIsCapturing(false);
    }, 300);
  };

  const handleProceedToForm = () => {
    if (photos.length === 0) {
      Alert.alert(
        'Foto Diperlukan',
        'Silakan jepret minimal 1 foto dokumentasi kegiatan lapangan terlebih dahulu.',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('LapanganForm', {
      initialPhotos: photos,
    });
  };

  const toggleFlash = () => {
    if (flashMode === 'auto') setFlashMode('on');
    else if (flashMode === 'on') setFlashMode('off');
    else setFlashMode('auto');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Full Simulated Camera Viewfinder with Overlay */}
      <View style={styles.viewfinderContainer}>
        {/* Mock Realistic Camera Feed Background */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1080&auto=format&fit=crop&q=80',
          }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {/* Viewfinder Grid Guide Lines */}
        <View style={styles.gridOverlay}>
          <View style={styles.gridLineHorizontal1} />
          <View style={styles.gridLineHorizontal2} />
          <View style={styles.gridLineVertical1} />
          <View style={styles.gridLineVertical2} />
        </View>

        {/* Focus Target in Center */}
        <View style={styles.focusReticle}>
          <View style={styles.focusCornerTopLeft} />
          <View style={styles.focusCornerTopRight} />
          <View style={styles.focusCornerBottomLeft} />
          <View style={styles.focusCornerBottomRight} />
        </View>

        {/* Shutter White Flash Effect */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.flashOverlay,
            { opacity: flashAnim },
          ]}
        />

        {/* TOP CONTROLS BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={24} color="#FFF" />
          </TouchableOpacity>

          {/* GPS Accuracy Status Badge */}
          <TouchableOpacity
            style={[
              styles.gpsPill,
              accuracyQuality === 'TINGGI'
                ? styles.gpsPillHigh
                : styles.gpsPillMedium,
            ]}
            onPress={refreshLocation}
          >
            <Icon
              name={isSearching ? 'autorenew' : 'my-location'}
              size={14}
              color="#111827"
            />
            <Text style={styles.gpsPillText}>
              {isSearching
                ? 'MENCARI GPS...'
                : `GPS AKURAT (±${coordinates.accuracy.toFixed(1)}m)`}
            </Text>
          </TouchableOpacity>

          {/* Flash Mode Toggle */}
          <TouchableOpacity style={styles.circleBtn} onPress={toggleFlash}>
            <Icon
              name={
                flashMode === 'on'
                  ? 'flash-on'
                  : flashMode === 'off'
                  ? 'flash-off'
                  : 'flash-auto'
              }
              size={22}
              color={flashMode === 'off' ? '#9CA3AF' : '#D4FF32'}
            />
          </TouchableOpacity>
        </View>

        {/* LIVE WATERMARK OVERLAY (Zona B - B14) */}
        <View style={styles.watermarkWrapper}>
          <CameraWatermark
            coordinates={coordinates}
            timestamp={currentClock}
            activityTitle="DOKUMENTASI KEGIATAN LAPANGAN"
          />
        </View>
      </View>

      {/* BOTTOM CONTROLS & MULTI-CAPTURE STRIP (Zona B - B15 & B16) */}
      <View style={styles.bottomControlsArea}>
        {/* Photo Gallery Thumbnail Strip */}
        {photos.length > 0 && (
          <View style={styles.thumbnailStrip}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.thumbRow}>
                {photos.map((item, index) => (
                  <View key={item.id} style={styles.thumbWrapper}>
                    <Image source={{ uri: item.uri }} style={styles.thumbImage} />
                    <View style={styles.thumbBadge}>
                      <Text style={styles.thumbBadgeText}>#{index + 1}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
            <Text style={styles.photoCountText}>
              {photos.length} foto siap
            </Text>
          </View>
        )}

        {/* Main Action Bar */}
        <View style={styles.shutterRow}>
          {/* Switch Camera */}
          <TouchableOpacity
            style={styles.sideControlBtn}
            onPress={() =>
              setCameraType(cameraType === 'back' ? 'front' : 'back')
            }
          >
            <Icon name="flip-camera-android" size={26} color="#FFF" />
          </TouchableOpacity>

          {/* Shutter Button (Jepret Foto - B15) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCapture}
            style={styles.shutterOuterRing}
          >
            <View style={styles.shutterInnerBtn}>
              <View style={styles.shutterCenterDot} />
            </View>
          </TouchableOpacity>

          {/* Selesai / Form Button (B16 -> B17) */}
          <TouchableOpacity
            style={[
              styles.nextFormBtn,
              photos.length === 0 && styles.nextFormBtnDisabled,
            ]}
            onPress={handleProceedToForm}
            disabled={photos.length === 0}
          >
            <Text style={styles.nextFormBtnText}>SELESAI</Text>
            <Icon name="arrow-forward" size={18} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
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
  gridOverlay: {
    ...StyleSheet.absoluteFill,
  },
  gridLineHorizontal1: {
    position: 'absolute',
    top: '33.3%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  gridLineHorizontal2: {
    position: 'absolute',
    top: '66.6%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  gridLineVertical1: {
    position: 'absolute',
    left: '33.3%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  gridLineVertical2: {
    position: 'absolute',
    left: '66.6%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  focusReticle: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    width: 64,
    height: 64,
    marginLeft: -32,
    marginTop: -32,
  },
  focusCornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 14,
    height: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#D4FF32',
  },
  focusCornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#D4FF32',
  },
  focusCornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 14,
    height: 14,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#D4FF32',
  },
  focusCornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#D4FF32',
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
  gpsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#111827',
  },
  gpsPillHigh: {
    backgroundColor: '#D4FF32', // Neon Green
  },
  gpsPillMedium: {
    backgroundColor: '#FF7A00', // Vibrant Orange
  },
  gpsPillText: {
    color: '#111827',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  watermarkWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomControlsArea: {
    backgroundColor: '#111827',
    borderTopWidth: 3,
    borderTopColor: '#262626',
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  thumbnailStrip: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumbRow: {
    flexDirection: 'row',
    gap: 8,
  },
  thumbWrapper: {
    width: 52,
    height: 52,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D4FF32',
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
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
  photoCountText: {
    color: '#D4FF32',
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 12,
    textTransform: 'uppercase',
  },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideControlBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#262626',
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuterRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#D4FF32',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  shutterInnerBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterCenterDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B38F6',
  },
  nextFormBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D4FF32',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#111827',
    // Solid shadow
    shadowColor: '#111827',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  nextFormBtnDisabled: {
    backgroundColor: '#4B5563',
    borderColor: '#6B7280',
    opacity: 0.5,
  },
  nextFormBtnText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
