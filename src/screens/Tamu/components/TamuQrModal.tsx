import React from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../../components/CustomButton';
import { styles } from '../TamuScreen.styles';

interface TamuQrModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TamuQrModal({ visible, onClose }: TamuQrModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.qrModalCard}>
          <View style={styles.qrModalHeader}>
            <View>
              <Text style={styles.qrModalTitle}>QR Code Buku Tamu</Text>
              <Text style={styles.qrModalSubtitle}>
                Tamu scan dari HP untuk mengisi form mandiri
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <View style={styles.qrCodeBox}>
            <Image
              source={{
                uri: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://bps-malang-tamu.web.app',
              }}
              style={styles.qrImage}
              resizeMode="contain"
            />
            <Text style={styles.qrCaption}>
              Letakkan QR ini di Meja Lobby Depan
            </Text>
          </View>

          <View style={{ marginTop: 16 }}>
            <CustomButton
              title="TUTUP TAMPILAN"
              variant="outline"
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
