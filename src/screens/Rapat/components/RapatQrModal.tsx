import React from 'react';
import { View, Text, Modal, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../../components/CustomButton';
import { SesiRapat } from '../../../types/pengelola';
import { styles } from '../RapatScreen.styles';

interface RapatQrModalProps {
  sesi: SesiRapat | null;
  onClose: () => void;
}

export default function RapatQrModal({ sesi, onClose }: RapatQrModalProps) {
  return (
    <Modal visible={!!sesi} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.qrModalCard}>
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="qr-code-2" size={22} color="#111827" />
              <Text style={styles.modalTitle}>QR Code Presensi</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          {sesi && (
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.qrSesiTitle} numberOfLines={2}>
                {sesi.judulRapat}
              </Text>

              <View style={styles.qrContainer}>
                <Image
                  source={{ uri: sesi.qrCodeUrl }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.qrInfoBadge}>
                <Icon name="room" size={14} color="#111827" />
                <Text style={styles.qrInfoText}>{sesi.ruangRapat}</Text>
              </View>

              <Text style={styles.qrHint}>
                Tampilkan atau cetak QR ini di meja resepsionis/depan ruangan.
                Peserta rapat cukup memindai QR ini untuk absensi otomatis.
              </Text>

              <View style={{ width: '100%', marginTop: 16 }}>
                <CustomButton
                  title="TUTUP TAMPILAN"
                  variant="outline"
                  onPress={onClose}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
