import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../LapanganScreen.styles';

interface LapanganPendingAlertProps {
  pendingCount: number;
  isOnline: boolean;
  isSyncing: boolean;
  onSync: () => void;
}

export default function LapanganPendingAlert({
  pendingCount,
  isOnline,
  isSyncing,
  onSync,
}: LapanganPendingAlertProps) {
  if (pendingCount <= 0) return null;

  return (
    <View style={styles.pendingAlertCard}>
      <View style={styles.pendingAlertLeft}>
        <Icon name="cloud-queue" size={24} color="#FFF" />
        <View style={{ flex: 1 }}>
          <Text style={styles.pendingAlertTitle}>
            {pendingCount} Kegiatan Belum Terunggah
          </Text>
          <Text style={styles.pendingAlertSub}>
            {isOnline
              ? 'Koneksi tersedia. Tekan untuk unggah sekarang.'
              : 'Akan otomatis dikirim saat terhubung internet.'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.syncNowBtn}
        onPress={onSync}
        disabled={isSyncing}
      >
        <Text style={styles.syncNowBtnText}>
          {isSyncing ? 'MENGIRIM...' : 'SINKRONKAN'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
