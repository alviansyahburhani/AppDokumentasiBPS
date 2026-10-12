import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../LapanganScreen.styles';

export type LapanganFilterType = 'ALL' | 'PENDING' | 'SYNCED';

interface LapanganFilterChipsProps {
  filter: LapanganFilterType;
  onSelectFilter: (f: LapanganFilterType) => void;
  totalCount: number;
  pendingCount: number;
  syncedCount: number;
}

export default function LapanganFilterChips({
  filter,
  onSelectFilter,
  totalCount,
  pendingCount,
  syncedCount,
}: LapanganFilterChipsProps) {
  return (
    <View style={styles.filterRow}>
      <TouchableOpacity
        style={[styles.filterChip, filter === 'ALL' && styles.filterChipActive]}
        onPress={() => onSelectFilter('ALL')}
      >
        <Text
          style={[
            styles.filterChipText,
            filter === 'ALL' && styles.filterChipTextActive,
          ]}
        >
          Semua ({totalCount})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterChip,
          filter === 'PENDING' && styles.filterChipActiveWarning,
        ]}
        onPress={() => onSelectFilter('PENDING')}
      >
        <Text
          style={[
            styles.filterChipText,
            filter === 'PENDING' && styles.filterChipTextWarning,
          ]}
        >
          Antrean Offline ({pendingCount})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterChip,
          filter === 'SYNCED' && styles.filterChipActiveSuccess,
        ]}
        onPress={() => onSelectFilter('SYNCED')}
      >
        <Text
          style={[
            styles.filterChipText,
            filter === 'SYNCED' && styles.filterChipTextSuccess,
          ]}
        >
          Terkirim ({syncedCount})
        </Text>
      </TouchableOpacity>
    </View>
  );
}
