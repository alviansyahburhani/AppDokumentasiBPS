import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LapanganPhoto } from '../../../types/lapangan';
import { styles } from '../LapanganCam.styles';

interface CameraBottomControlsProps {
  photos: LapanganPhoto[];
  onFlipCamera: () => void;
  onCapture: () => void;
  onProceed: () => void;
}

export default function CameraBottomControls({
  photos,
  onFlipCamera,
  onCapture,
  onProceed,
}: CameraBottomControlsProps) {
  const hasPhotos = photos.length > 0;

  return (
    <View style={styles.bottomControlsArea}>
      {/* Photo Gallery Thumbnail Strip */}
      {hasPhotos && (
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
          <Text style={styles.photoCountText}>{photos.length} foto siap</Text>
        </View>
      )}

      {/* Main Action Bar */}
      <View style={styles.shutterRow}>
        {/* Switch Camera */}
        <TouchableOpacity
          style={styles.sideControlBtn}
          onPress={onFlipCamera}
        >
          <Icon name="flip-camera-android" size={26} color="#FFF" />
        </TouchableOpacity>

        {/* Shutter Button (Jepret Foto) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onCapture}
          style={styles.shutterOuterRing}
        >
          <View style={styles.shutterInnerBtn}>
            <View style={styles.shutterCenterDot} />
          </View>
        </TouchableOpacity>

        {/* Selesai / Form Button */}
        <TouchableOpacity
          style={[
            styles.nextFormBtn,
            !hasPhotos && styles.nextFormBtnDisabled,
          ]}
          onPress={onProceed}
          disabled={!hasPhotos}
        >
          <Text style={styles.nextFormBtnText}>SELESAI</Text>
          <Icon name="arrow-forward" size={18} color="#111827" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
