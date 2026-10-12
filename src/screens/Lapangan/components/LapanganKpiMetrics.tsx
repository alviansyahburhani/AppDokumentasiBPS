import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../LapanganScreen.styles';

interface LapanganKpiMetricsProps {
  totalCount: number;
  pendingCount: number;
  syncedCount: number;
}

export default function LapanganKpiMetrics({
  totalCount,
  pendingCount,
  syncedCount,
}: LapanganKpiMetricsProps) {
  return (
    <View style={styles.kpiRow}>
      {/* Total */}
      <View style={[styles.kpiCard, { backgroundColor: '#FFF' }]}>
        <Text style={styles.kpiVal}>{totalCount}</Text>
        <Text style={styles.kpiLabel}>Total Form</Text>
      </View>

      {/* Pending Queue */}
      <View style={[styles.kpiCard, { backgroundColor: '#FF7A00' }]}>
        <Text style={[styles.kpiVal, { color: '#FFF' }]}>{pendingCount}</Text>
        <Text style={[styles.kpiLabel, { color: '#FFF' }]}>Antrean</Text>
      </View>

      {/* Synced */}
      <View style={[styles.kpiCard, { backgroundColor: '#D4FF32' }]}>
        <Text style={styles.kpiVal}>{syncedCount}</Text>
        <Text style={styles.kpiLabel}>Terkirim</Text>
      </View>
    </View>
  );
}
