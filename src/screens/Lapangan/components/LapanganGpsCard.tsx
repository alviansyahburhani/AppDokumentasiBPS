import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GpsCoordinates } from '../../../types/lapangan';
import { styles } from '../LapanganForm.styles';

interface LapanganGpsCardProps {
  coordinates: GpsCoordinates;
}

export default function LapanganGpsCard({ coordinates }: LapanganGpsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: '#D4FF32' }]}>
          <Icon name="place" size={20} color="#111827" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Lokasi GPS Terverifikasi</Text>
          <Text style={styles.cardSub}>
            {coordinates.addressName}, {coordinates.district}
          </Text>
        </View>
        <View style={styles.badgeAkurat}>
          <Text style={styles.badgeAkuratText}>±{coordinates.accuracy.toFixed(1)}M</Text>
        </View>
      </View>
      <View style={styles.coordBox}>
        <Text style={styles.coordText}>
          LAT: {coordinates.latitude.toFixed(6)} | LNG: {coordinates.longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  );
}
