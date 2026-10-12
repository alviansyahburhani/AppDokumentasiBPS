import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../../components/CustomButton';
import { styles } from '../LapanganScreen.styles';

interface LapanganHeroBannerProps {
  onOpenCamera: () => void;
}

export default function LapanganHeroBanner({ onOpenCamera }: LapanganHeroBannerProps) {
  return (
    <View style={styles.heroBanner}>
      <View style={styles.heroTextWrap}>
        <View style={styles.heroBadge}>
          <Icon name="verified" size={12} color="#111827" />
          <Text style={styles.heroBadgeText}>SOP DOKUMENTASI BPS</Text>
        </View>
        <Text style={styles.heroTitle}>Mulai Dokumentasi Lapangan</Text>
        <Text style={styles.heroDesc}>
          Kamera ber-watermark otomatis (Logo, GPS, Tanggal, Jam). Dukungan penuh mode offline.
        </Text>
      </View>
      <CustomButton
        title="BUKA KAMERA"
        variant="dark"
        iconName="add-a-photo"
        onPress={onOpenCamera}
        style={styles.heroBtn}
      />
    </View>
  );
}
