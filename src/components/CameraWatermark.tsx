import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LocationCoordinates } from '../types/lapangan';
import { BPS_CONFIG } from '../utils/constants';
import { formatIndonesianDate, formatWatermarkTime } from '../utils/dateUtils';

interface CameraWatermarkProps {
  coordinates: LocationCoordinates;
  activityTitle?: string;
  officerName?: string;
  timestamp?: Date;
  compact?: boolean;
  style?: ViewStyle;
}

export default function CameraWatermark({
  coordinates,
  activityTitle = 'DOKUMENTASI KEGIATAN LAPANGAN',
  officerName = BPS_CONFIG.DEFAULT_PETUGAS.nama,
  timestamp = new Date(),
  compact = false,
  style,
}: CameraWatermarkProps) {
  const dateStr = formatIndonesianDate(timestamp);
  const timeStr = formatWatermarkTime(timestamp);

  return (
    <View style={[styles.container, compact && styles.containerCompact, style]}>
      {/* Top Banner: Logo BPS & Instansi Name */}
      <View style={styles.headerRow}>
        <View style={styles.logoBadge}>
          <Image
            source={{ uri: BPS_CONFIG.LOGO_URI }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerTexts}>
          <Text style={styles.instansiTitle}>{BPS_CONFIG.INSTANSI_NAME}</Text>
          <Text style={styles.satkerSubtitle}>{BPS_CONFIG.SATKER_NAME}</Text>
        </View>
        <View style={styles.verifiedPill}>
          <Icon name="verified" size={12} color="#D4FF32" />
          <Text style={styles.verifiedText}>GEO-TAG</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Main Metadata Grid */}
      <View style={styles.infoRow}>
        {/* Activity & Officer */}
        <View style={styles.infoColLeft}>
          <Text style={styles.activityText} numberOfLines={1}>
            {activityTitle.toUpperCase()}
          </Text>
          <View style={styles.officerRow}>
            <Icon name="person" size={11} color="#FFF" />
            <Text style={styles.officerText}>
              Petugas: {officerName}
            </Text>
          </View>
        </View>

        {/* GPS Coordinates */}
        <View style={styles.infoColRight}>
          <View style={styles.coordRow}>
            <Icon name="pin-drop" size={12} color="#D4FF32" />
            <Text style={styles.coordText}>
              {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
            </Text>
          </View>
          <View style={styles.timeRow}>
            <Icon name="schedule" size={11} color="#FF7A00" />
            <Text style={styles.timeText}>{dateStr} • {timeStr}</Text>
          </View>
        </View>
      </View>

      {/* District / Address Location Tag */}
      {coordinates.addressName && (
        <View style={styles.addressTag}>
          <Icon name="location-city" size={11} color="#9CA3AF" />
          <Text style={styles.addressText} numberOfLines={1}>
            {coordinates.addressName}, {coordinates.district || 'Malang'} (±{coordinates.accuracy.toFixed(1)}m)
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(17, 24, 39, 0.88)', // Dark semi-translucent backdrop
    borderWidth: 2,
    borderColor: '#D4FF32', // Neon accent border
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  containerCompact: {
    padding: 6,
    marginHorizontal: 6,
    marginBottom: 6,
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 26,
    height: 26,
    backgroundColor: '#FFF',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  headerTexts: {
    flex: 1,
  },
  instansiTitle: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  satkerSubtitle: {
    color: '#D4FF32',
    fontSize: 9,
    fontWeight: '800',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#D4FF32',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  verifiedText: {
    color: '#D4FF32',
    fontSize: 8,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoColLeft: {
    flex: 1.2,
  },
  activityText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
  officerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  officerText: {
    color: '#D1D5DB',
    fontSize: 9,
    fontWeight: '600',
  },
  infoColRight: {
    flex: 1.3,
    alignItems: 'flex-end',
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coordText: {
    color: '#D4FF32',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  timeText: {
    color: '#E5E7EB',
    fontSize: 8.5,
    fontWeight: '600',
  },
  addressTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  addressText: {
    color: '#9CA3AF',
    fontSize: 8.5,
    fontWeight: '500',
    flex: 1,
  },
});
