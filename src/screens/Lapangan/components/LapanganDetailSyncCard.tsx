import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../../components/CustomButton';
import { SyncStatusType } from '../../../types/lapangan';
import { formatIndonesianDate, formatWatermarkTime } from '../../../utils/dateUtils';
import { styles } from '../LapanganDetail.styles';

interface LapanganDetailSyncCardProps {
  status: SyncStatusType;
  createdAt: string;
  onSync: () => void;
}

export default function LapanganDetailSyncCard({
  status,
  createdAt,
  onSync,
}: LapanganDetailSyncCardProps) {
  const isSynced = status === 'SYNCED';
  const createdDate = new Date(createdAt);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>STATUS BACKEND GOOGLE APPS SCRIPT</Text>
      <View style={styles.backendRow}>
        <Icon
          name={isSynced ? 'cloud-done' : 'cloud-queue'}
          size={24}
          color={isSynced ? '#10B981' : '#FF7A00'}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.backendStatusText}>
            {isSynced
              ? 'Tersimpan di Google Drive & Tab Data_Lapangan'
              : 'Menunggu koneksi stabil untuk diunggah (Antrean Offline)'}
          </Text>
          <Text style={styles.backendDate}>
            Dibuat: {formatIndonesianDate(createdDate)} -{' '}
            {formatWatermarkTime(createdDate)}
          </Text>
        </View>
      </View>

      {status === 'PENDING_SYNC' && (
        <CustomButton
          title="UNGGAH SEKARANG"
          variant="accent"
          iconName="cloud-upload"
          onPress={onSync}
          style={{ marginTop: 12 }}
        />
      )}
    </View>
  );
}
