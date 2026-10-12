import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StatusBadge from '../../../components/StatusBadge';
import { LapanganRecord } from '../../../types/lapangan';
import { styles } from '../LapanganDetail.styles';

interface LapanganDetailInfoCardProps {
  record: LapanganRecord;
}

export default function LapanganDetailInfoCard({ record }: LapanganDetailInfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.statusRow}>
        <StatusBadge status={record.status} />
        <View style={styles.progresPill}>
          <Text style={styles.progresPillText}>PROGRES: {record.progres}%</Text>
        </View>
      </View>

      <Text style={styles.title}>{record.namaKegiatan}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaBadge}>
          <Icon name="business" size={12} color="#111827" />
          <Text style={styles.metaBadgeText}>{record.subSeksi}</Text>
        </View>
        <View style={[styles.metaBadge, { backgroundColor: '#E0E7FF' }]}>
          <Icon name="timeline" size={12} color="#3B38F6" />
          <Text style={[styles.metaBadgeText, { color: '#3B38F6' }]}>
            {record.tahapan}
          </Text>
        </View>
      </View>

      {record.catatan ? (
        <View style={styles.catatanBox}>
          <Text style={styles.catatanLabel}>CATATAN LAPANGAN:</Text>
          <Text style={styles.catatanText}>{record.catatan}</Text>
        </View>
      ) : null}
    </View>
  );
}
