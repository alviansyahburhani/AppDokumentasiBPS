import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GpsCoordinates } from '../../../types/lapangan';
import { styles } from '../LapanganCam.styles';

interface CameraTopBarProps {
  onClose: () => void;
  coordinates: GpsCoordinates;
  isSearching: boolean;
  accuracyQuality: 'TINGGI' | 'SEDANG' | 'RENDAH';
  onRefreshLocation: () => void;
  flashMode: 'off' | 'on' | 'auto';
  onToggleFlash: () => void;
}

export default function CameraTopBar({
  onClose,
  coordinates,
  isSearching,
  accuracyQuality,
  onRefreshLocation,
  flashMode,
  onToggleFlash,
}: CameraTopBarProps) {
  const isHighAccuracy = accuracyQuality === 'TINGGI';

  const flashIcon =
    flashMode === 'on'
      ? 'flash-on'
      : flashMode === 'off'
      ? 'flash-off'
      : 'flash-auto';

  return (
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.circleBtn} onPress={onClose}>
        <Icon name="close" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* GPS Accuracy Status Badge */}
      <TouchableOpacity
        style={[
          styles.gpsPill,
          isHighAccuracy ? styles.gpsPillHigh : styles.gpsPillMedium,
        ]}
        onPress={onRefreshLocation}
      >
        <Icon
          name={isSearching ? 'autorenew' : 'my-location'}
          size={14}
          color="#111827"
        />
        <Text style={styles.gpsPillText}>
          {isSearching
            ? 'MENCARI GPS...'
            : `GPS AKURAT (±${coordinates.accuracy.toFixed(1)}m)`}
        </Text>
      </TouchableOpacity>

      {/* Flash Mode Toggle */}
      <TouchableOpacity style={styles.circleBtn} onPress={onToggleFlash}>
        <Icon
          name={flashIcon}
          size={22}
          color={flashMode === 'off' ? '#9CA3AF' : '#D4FF32'}
        />
      </TouchableOpacity>
    </View>
  );
}
