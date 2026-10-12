import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LapanganPhoto } from '../../types/lapangan';
import { useLocation } from '../../hooks/useLocation';
import CameraWatermark from '../../components/CameraWatermark';
import { generateMockFieldPhoto } from '../../utils/imageUtils';
import { styles } from './LapanganCam.styles';
import CameraViewfinderOverlay from './components/CameraViewfinderOverlay';
import CameraTopBar from './components/CameraTopBar';
import CameraBottomControls from './components/CameraBottomControls';

export default function LapanganCam() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const initialPhotos: LapanganPhoto[] = route.params?.existingPhotos || [];
  const [photos, setPhotos] = useState<LapanganPhoto[]>(initialPhotos);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('auto');
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentClock, setCurrentClock] = useState(new Date());

  const { coordinates, isSearching, accuracyQuality, refreshLocation } = useLocation();

  // Animasi shutter flash
  const flashAnim = useRef(new Animated.Value(0)).current;

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

  const toggleCameraType = () => {
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
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

        {/* Viewfinder Grid, Focus Reticle, & Flash Overlay */}
        <CameraViewfinderOverlay flashAnim={flashAnim} />

        {/* Top Controls Bar */}
        <CameraTopBar
          onClose={() => navigation.goBack()}
          coordinates={coordinates}
          isSearching={isSearching}
          accuracyQuality={accuracyQuality}
          onRefreshLocation={refreshLocation}
          flashMode={flashMode}
          onToggleFlash={toggleFlash}
        />

        {/* Live Watermark Overlay (Zona B - B14) */}
        <View style={styles.watermarkWrapper}>
          <CameraWatermark
            coordinates={coordinates}
            timestamp={currentClock}
            activityTitle="DOKUMENTASI KEGIATAN LAPANGAN"
          />
        </View>
      </View>

      {/* Bottom Controls & Multi-capture Strip (Zona B - B15 & B16) */}
      <CameraBottomControls
        photos={photos}
        onFlipCamera={toggleCameraType}
        onCapture={handleCapture}
        onProceed={handleProceedToForm}
      />
    </SafeAreaView>
  );
}
