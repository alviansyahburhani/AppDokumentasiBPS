import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import CameraWatermark from '../../../components/CameraWatermark';
import { LapanganPhoto } from '../../../types/lapangan';
import { styles } from '../LapanganDetail.styles';

interface LapanganDetailPhotoViewerProps {
  photos: LapanganPhoto[];
  selectedPhotoIdx: number;
  onSelectPhotoIdx: (idx: number) => void;
  activityTitle: string;
}

export default function LapanganDetailPhotoViewer({
  photos,
  selectedPhotoIdx,
  onSelectPhotoIdx,
  activityTitle,
}: LapanganDetailPhotoViewerProps) {
  const selectedPhoto = photos[selectedPhotoIdx] || photos[0];

  if (!selectedPhoto) return null;

  return (
    <>
      {/* Main Photo with Watermark Overlay */}
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: selectedPhoto.uri }}
          style={styles.mainPhoto}
          resizeMode="cover"
        />
        <View style={styles.watermarkWrap}>
          <CameraWatermark
            coordinates={selectedPhoto.coordinates}
            activityTitle={activityTitle}
            compact
          />
        </View>
      </View>

      {/* Thumbnail Selector if multiple photos */}
      {photos.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.multiThumbRow}>
            {photos.map((p, index) => {
              const isSelected = selectedPhotoIdx === index;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.thumbBox, isSelected && styles.thumbBoxActive]}
                  onPress={() => onSelectPhotoIdx(index)}
                >
                  <Image source={{ uri: p.uri }} style={styles.thumbImg} />
                  <View style={styles.thumbBadge}>
                    <Text style={styles.thumbBadgeText}>#{index + 1}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}
    </>
  );
}
