import React from 'react';
import { View, Text, Modal, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CameraWatermark from '../../../components/CameraWatermark';
import { LapanganPhoto } from '../../../types/lapangan';
import { styles } from '../LapanganForm.styles';

interface LapanganPhotoPreviewModalProps {
  photo: LapanganPhoto | null;
  onClose: () => void;
  activityTitle: string;
}

export default function LapanganPhotoPreviewModal({
  photo,
  onClose,
  activityTitle,
}: LapanganPhotoPreviewModalProps) {
  return (
    <Modal visible={!!photo} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Preview Foto Watermark</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>
          {photo && (
            <View style={styles.modalImgWrapper}>
              <Image
                source={{ uri: photo.uri }}
                style={styles.modalImg}
                resizeMode="cover"
              />
              <View style={styles.modalWatermarkWrap}>
                <CameraWatermark
                  coordinates={photo.coordinates}
                  activityTitle={activityTitle || 'DOKUMENTASI LAPANGAN BPS'}
                  compact
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
