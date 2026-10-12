import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface OfflineBannerProps {
  isOffline: boolean;
}

export default function OfflineBanner({ isOffline }: OfflineBannerProps) {
  if (!isOffline) {
    return (
      <View style={[styles.container, styles.onlineContainer]}>
        <Icon name="wifi" size={18} color="#111827" />
        <Text style={styles.text}>Status: Terhubung (Online)</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.offlineContainer]}>
      <Icon name="cloud-off" size={18} color="#111827" />
      <Text style={styles.text}>
        Tidak ada internet. Data masuk antrean lokal.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#111827',
    gap: 8,
  },
  offlineContainer: {
    backgroundColor: '#FF7A00', // Vibrant Orange
  },
  onlineContainer: {
    backgroundColor: '#D4FF32', // Neon Green
  },
  text: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '900',
    flex: 1,
    textTransform: 'uppercase',
  },
});
