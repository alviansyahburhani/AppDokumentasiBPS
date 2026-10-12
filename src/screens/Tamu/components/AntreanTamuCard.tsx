import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../../components/CustomButton';
import { AntreanTamu } from '../../../types/tamu';
import { formatCompactDateTime } from '../../../utils/dateUtils';
import { styles } from '../TamuScreen.styles';

interface AntreanTamuCardProps {
  item: AntreanTamu;
  onProcess: (item: AntreanTamu) => void;
}

export default function AntreanTamuCard({ item, onProcess }: AntreanTamuCardProps) {
  const isManual = item.metode === 'manual';

  return (
    <View style={styles.antreanCard}>
      <View style={styles.antreanTopRow}>
        <View
          style={[
            styles.qrBadge,
            isManual && { backgroundColor: '#FF7A00' },
          ]}
        >
          <Icon name={isManual ? 'edit-note' : 'qr-code'} size={12} color="#FFF" />
          <Text style={styles.qrBadgeText}>
            {isManual ? 'INPUT MANUAL' : 'HASIL SCAN QR'}
          </Text>
        </View>
        <Text style={styles.antreanTime}>
          {formatCompactDateTime(new Date(item.waktuAntre))}
        </Text>
      </View>

      <Text style={styles.guestName}>{item.nama}</Text>
      <Text style={styles.guestInstansi}>{item.instansi}</Text>

      <View style={styles.guestDetailsBox}>
        <Text style={styles.detailLabel}>Bertemu Siapa:</Text>
        <Text
          style={[
            styles.detailVal,
            { color: isManual ? '#FF7A00' : '#3B38F6' },
          ]}
        >
          {item.bertemuSiapa}
        </Text>

        <Text style={[styles.detailLabel, { marginTop: 4 }]}>Keperluan:</Text>
        <Text style={styles.detailVal} numberOfLines={2}>
          {item.keperluan}
        </Text>
      </View>

      {/* Lanjut ke Ambil Dokumentasi */}
      <CustomButton
        title="AMBIL DOKUMENTASI FOTO"
        variant={isManual ? 'accent' : 'primary'}
        iconName="photo-camera"
        onPress={() => onProcess(item)}
        style={{ marginTop: 12 }}
      />
    </View>
  );
}
