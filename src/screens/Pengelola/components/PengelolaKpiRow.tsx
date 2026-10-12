import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../PengelolaScreen.styles';

interface PengelolaKpiRowProps {
  totalTemplate: number;
  currentCategoryCount: number;
}

export default function PengelolaKpiRow({
  totalTemplate,
  currentCategoryCount,
}: PengelolaKpiRowProps) {
  return (
    <View style={styles.kpiRow}>
      <View style={[styles.kpiCard, { backgroundColor: '#3B38F6' }]}>
        <Text style={[styles.kpiVal, { color: '#FFF' }]}>{totalTemplate}</Text>
        <Text style={[styles.kpiLabel, { color: '#FFF' }]}>Total Preset Cepat</Text>
      </View>
      <View style={[styles.kpiCard, { backgroundColor: '#D4FF32' }]}>
        <Text style={styles.kpiVal}>{currentCategoryCount}</Text>
        <Text style={styles.kpiLabel}>Kategori Ini</Text>
      </View>
    </View>
  );
}
