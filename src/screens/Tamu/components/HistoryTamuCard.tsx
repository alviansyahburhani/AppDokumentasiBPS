import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TamuRecord } from '../../../types/tamu';
import { formatCompactDateTime } from '../../../utils/dateUtils';
import { styles } from '../TamuScreen.styles';

interface HistoryTamuCardProps {
  rec: TamuRecord;
  onPress: (id: string) => void;
}

export default function HistoryTamuCard({ rec, onPress }: HistoryTamuCardProps) {
  const isManual = rec.metode === 'manual';

  return (
    <TouchableOpacity
      style={styles.historyCard}
      activeOpacity={0.88}
      onPress={() => onPress(rec.id)}
    >
      <View style={styles.historyHeader}>
        <View style={styles.historyThumbWrap}>
          <Image
            source={{
              uri:
                rec.photos[0]?.uri ||
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
            }}
            style={styles.historyThumb}
          />
          {rec.photos.length > 1 && (
            <View style={styles.thumbCountPill}>
              <Text style={styles.thumbCountText}>+{rec.photos.length - 1}</Text>
            </View>
          )}
        </View>

        <View style={styles.historyInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={[
                styles.metodePillMini,
                { backgroundColor: isManual ? '#FF7A00' : '#3B38F6' },
              ]}
            >
              <Text style={styles.metodePillMiniText}>
                {isManual ? 'MANUAL' : 'QR CODE'}
              </Text>
            </View>
            <Text style={styles.historyTime}>
              {formatCompactDateTime(new Date(rec.waktuCheckIn))}
            </Text>
          </View>

          <Text style={styles.historyNama}>{rec.nama}</Text>
          <Text style={styles.historyInstansi}>{rec.instansi}</Text>
          <Text style={styles.historyBertemu} numberOfLines={1}>
            Bertemu: {rec.bertemuSiapa}
          </Text>
        </View>
      </View>

      <View style={styles.historyFooter}>
        <View style={styles.footerTag}>
          <Icon name="verified" size={12} color="#111827" />
          <Text style={styles.footerTagText}>
            {rec.photos.length} FOTO WATERMARK
          </Text>
        </View>
        <View style={styles.viewRow}>
          <Text style={styles.viewRowText}>Rincian</Text>
          <Icon name="chevron-right" size={16} color="#111827" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
