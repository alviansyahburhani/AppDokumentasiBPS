import React from 'react';
import { View, Text } from 'react-native';
import { GpsCoordinates } from '../../../types/lapangan';
import { styles } from '../LapanganDetail.styles';

interface LapanganDetailGpsCardProps {
  lokasi: GpsCoordinates;
}

export default function LapanganDetailGpsCard({ lokasi }: LapanganDetailGpsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>METADATA VERIFIKASI GPS</Text>
      <View style={styles.gpsGrid}>
        <View style={styles.gpsItem}>
          <Text style={styles.gpsLabel}>Latitude</Text>
          <Text style={styles.gpsVal}>{lokasi.latitude.toFixed(6)}</Text>
        </View>
        <View style={styles.gpsItem}>
          <Text style={styles.gpsLabel}>Longitude</Text>
          <Text style={styles.gpsVal}>{lokasi.longitude.toFixed(6)}</Text>
        </View>
        <View style={styles.gpsItem}>
          <Text style={styles.gpsLabel}>Akurasi Satelit</Text>
          <Text style={styles.gpsVal}>±{lokasi.accuracy.toFixed(1)} Meter</Text>
        </View>
        <View style={styles.gpsItem}>
          <Text style={styles.gpsLabel}>Alamat / Wilayah</Text>
          <Text style={styles.gpsVal}>{lokasi.addressName || 'Kota Malang'}</Text>
        </View>
      </View>
    </View>
  );
}
