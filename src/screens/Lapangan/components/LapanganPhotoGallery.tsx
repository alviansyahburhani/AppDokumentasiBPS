import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LapanganPhoto } from '../../../types/lapangan';
import { styles } from '../LapanganForm.styles';

interface LapanganPhotoGalleryProps {
  photos: LapanganPhoto[];
  onAddMorePhotos: () => void;
  onRemovePhoto: (photoId: string) => void;
  onPreviewPhoto: (photo: LapanganPhoto) => void;
}

export default function LapanganPhotoGallery({
  photos,
  onAddMorePhotos,
  onRemovePhoto,
  onPreviewPhoto,
}: LapanganPhotoGalleryProps) {
  return (
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
          onPress={onAddMorePhotos}
        >
          <Icon name="add-a-photo" size={16} color="#111827" />
          <Text style={styles.addPhotoSmallText}>+ FOTO</Text>
        </TouchableOpacity>
      </View>

      {photos.length === 0 ? (
        <TouchableOpacity
          style={styles.emptyPhotoBox}
          onPress={onAddMorePhotos}
        >
          <Icon name="camera-alt" size={32} color="#9CA3AF" />
          <Text style={styles.emptyPhotoText}>Belum ada foto. Tekan untuk jepret.</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.photosGrid}>
          {photos.map((item, idx) => (
            <View key={item.id} style={styles.photoCard}>
              <TouchableOpacity
                onPress={() => onPreviewPhoto(item)}
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
                  onPress={() => onRemovePhoto(item.id)}
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
  );
}
