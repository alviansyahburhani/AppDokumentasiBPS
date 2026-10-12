import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LapanganRecord } from '../../../types/lapangan';
import StatusBadge from '../../../components/StatusBadge';
import { formatCompactDateTime } from '../../../utils/dateUtils';
import { styles } from '../LapanganScreen.styles';

interface LapanganRecordCardProps {
  item: LapanganRecord;
  onPress: (recordId: string) => void;
}

export default function LapanganRecordCard({ item, onPress }: LapanganRecordCardProps) {
  const thumbUri =
    item.photos[0]?.uri ||
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400';

  return (
    <TouchableOpacity
      style={styles.recordCard}
      activeOpacity={0.88}
      onPress={() => onPress(item.id)}
    >
      <View style={styles.recordHeader}>
        <View style={styles.subSeksiPill}>
          <Text style={styles.subSeksiPillText}>{item.subSeksi}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.recordBody}>
        {/* Photo Thumbnail */}
        <View style={styles.recordThumbWrap}>
          <Image source={{ uri: thumbUri }} style={styles.recordThumb} />
          {item.photos.length > 1 && (
            <View style={styles.photoCountBadge}>
              <Text style={styles.photoCountBadgeText}>
                +{item.photos.length - 1}
              </Text>
            </View>
          )}
        </View>

        {/* Texts & Meta */}
        <View style={styles.recordInfo}>
          <Text style={styles.recordTitle} numberOfLines={2}>
            {item.namaKegiatan}
          </Text>
          <Text style={styles.recordTahapan}>Tahap: {item.tahapan}</Text>

          <View style={styles.recordCoordRow}>
            <Icon name="pin-drop" size={12} color="#3B38F6" />
            <Text style={styles.recordCoordText} numberOfLines={1}>
              {item.lokasi.addressName || 'Kota Malang'}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.miniProgressWrap}>
            <View
              style={[
                styles.miniProgressFill,
                { width: `${item.progres}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Footer Time & Arrow */}
      <View style={styles.recordFooter}>
        <Text style={styles.recordTime}>
          {formatCompactDateTime(new Date(item.createdAt))}
        </Text>
        <View style={styles.viewDetailRow}>
          <Text style={styles.viewDetailText}>Rincian</Text>
          <Icon name="chevron-right" size={16} color="#111827" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
