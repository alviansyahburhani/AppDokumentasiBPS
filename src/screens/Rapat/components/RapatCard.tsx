import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SesiRapat } from '../../../types/pengelola';
import { styles } from '../RapatScreen.styles';

interface RapatCardProps {
  sesi: SesiRapat;
  onOpenQr: (sesi: SesiRapat) => void;
  onToggleStatus: (id: string, judul: string, currentStatus: string) => void;
  onDelete: (id: string, judul: string) => void;
}

export default function RapatCard({
  sesi,
  onOpenQr,
  onToggleStatus,
  onDelete,
}: RapatCardProps) {
  const isAktif = sesi.status === 'AKTIF';

  return (
    <View style={styles.sesiCard}>
      {/* Status Top Row */}
      <View style={styles.sesiTopRow}>
        <View
          style={[
            styles.statusPill,
            isAktif ? styles.statusPillActive : styles.statusPillClosed,
          ]}
        >
          <Icon
            name={isAktif ? 'sensors' : 'check-circle'}
            size={12}
            color={isAktif ? '#111827' : '#FFF'}
          />
          <Text
            style={[
              styles.statusPillText,
              isAktif ? { color: '#111827' } : { color: '#FFF' },
            ]}
          >
            {isAktif ? 'SESI AKTIF (WEB FORM ON)' : 'RAPAT SELESAI'}
          </Text>
        </View>

        <Text style={styles.totalPesertaBadge}>
          👥 {sesi.totalPeserta} Peserta Hadir
        </Text>
      </View>

      {/* Judul & Detail */}
      <Text style={styles.sesiJudul}>{sesi.judulRapat}</Text>

      <View style={styles.sesiMetaBox}>
        <View style={styles.sesiMetaItem}>
          <Icon name="calendar-today" size={13} color="#3B38F6" />
          <Text style={styles.sesiMetaText}>
            {sesi.tanggalPelaksanaan} ({sesi.waktuMulai})
          </Text>
        </View>
        <View style={styles.sesiMetaItem}>
          <Icon name="room" size={13} color="#FF7A00" />
          <Text style={styles.sesiMetaText}>{sesi.ruangRapat}</Text>
        </View>
        {sesi.keterangan ? (
          <Text style={styles.sesiKetText} numberOfLines={2}>
            Ket: {sesi.keterangan}
          </Text>
        ) : null}
      </View>

      {/* Action Buttons: QR, Toggle Status, Delete */}
      <View style={styles.sesiActionsRow}>
        <TouchableOpacity
          style={styles.qrBtn}
          activeOpacity={0.8}
          onPress={() => onOpenQr(sesi)}
        >
          <Icon name="qr-code" size={16} color="#111827" />
          <Text style={styles.qrBtnText}>QR CODE PRESENSI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleStatusBtn,
            isAktif ? styles.toggleStatusBtnClose : styles.toggleStatusBtnOpen,
          ]}
          activeOpacity={0.8}
          onPress={() => onToggleStatus(sesi.id, sesi.judulRapat, sesi.status)}
        >
          <Icon
            name={isAktif ? 'power-settings-new' : 'replay'}
            size={16}
            color="#FFF"
          />
          <Text style={styles.toggleStatusBtnText}>
            {isAktif ? 'TUTUP SESI' : 'BUKA KEMBALI'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnHapusSesi}
          onPress={() => onDelete(sesi.id, sesi.judulRapat)}
        >
          <Icon name="delete-outline" size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
