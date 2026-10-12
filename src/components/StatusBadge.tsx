import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SyncStatusType } from '../types/lapangan';

import { colors } from '../theme/colors';

interface StatusBadgeProps {
  status: SyncStatusType;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'SYNCED':
        return {
          label: 'TERKIRIM (CLOUD)',
          bgColor: colors.primary, // Neon Green
          textColor: colors.textDark,
          icon: 'cloud-done',
        };
      case 'PENDING_SYNC':
        return {
          label: 'ANTREAN OFFLINE',
          bgColor: colors.accent, // Vibrant Orange
          textColor: colors.white,
          icon: 'schedule',
        };
      case 'FAILED':
        return {
          label: 'GAGAL KIRIM',
          bgColor: colors.error,
          textColor: colors.white,
          icon: 'error-outline',
        };
      case 'DRAFT':
      default:
        return {
          label: 'DRAFT LOKAL',
          bgColor: colors.border,
          textColor: colors.textDark,
          icon: 'edit-note',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
      <Icon name={config.icon} size={12} color={config.textColor} />
      <Text style={[styles.text, { color: config.textColor }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  text: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
