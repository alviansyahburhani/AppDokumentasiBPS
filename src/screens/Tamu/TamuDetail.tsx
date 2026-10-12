import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { tamuStorage } from '../../database/tamuStorage';
import { formatIndonesianDate, formatWatermarkTime } from '../../utils/dateUtils';
import CustomButton from '../../components/CustomButton';
import StatusBadge from '../../components/StatusBadge';

export default function TamuDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const recordId: string = route.params?.recordId;

  const record = tamuStorage.getRecordById(recordId);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  if (!record) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.notFoundText}>Data buku tamu tidak ditemukan.</Text>
          <CustomButton
            title="KEMBALI"
            variant="dark"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const activePhoto = record.photos[selectedPhotoIdx] || record.photos[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Detail Buku Tamu</Text>
          <Text style={styles.headerSub}>ID: {record.id}</Text>
        </View>
        <View
          style={[
            styles.metodeBadge,
            record.metode === 'manual'
              ? styles.metodeManual
              : styles.metodeQr,
          ]}
        >
          <Text
            style={[
              styles.metodeBadgeText,
              record.metode === 'manual' ? { color: '#FFF' } : { color: '#111827' },
            ]}
          >
            {record.metode === 'manual' ? 'MANUAL' : 'QR CODE'}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Display Card with Watermark */}
        {activePhoto && (
          <View style={styles.photoCard}>
            <Image
              source={{ uri: activePhoto.uri }}
              style={styles.mainPhoto}
              resizeMode="cover"
            />
            <View style={styles.watermarkTag}>
              <Icon name="verified" size={14} color="#D4FF32" />
              <Text style={styles.watermarkTagText}>
                FOTO #{selectedPhotoIdx + 1} TERVERIFIKASI
              </Text>
            </View>
          </View>
        )}

        {/* Thumbnail Selector if multiple photos */}
        {record.photos.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.multiThumbRow}>
              {record.photos.map((p, index) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.thumbBox,
                    selectedPhotoIdx === index && styles.thumbBoxActive,
                  ]}
                  onPress={() => setSelectedPhotoIdx(index)}
                >
                  <Image source={{ uri: p.uri }} style={styles.thumbImg} />
                  <View style={styles.thumbBadge}>
                    <Text style={styles.thumbBadgeText}>#{index + 1}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Guest Metadata Card */}
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <StatusBadge status={record.status} />
            <Text style={styles.checkInTime}>
              {formatWatermarkTime(new Date(record.waktuCheckIn))}
            </Text>
          </View>

          <Text style={styles.namaText}>{record.nama}</Text>
          <Text style={styles.instansiText}>{record.instansi}</Text>
          <Text style={styles.hpText}>WhatsApp: {record.noWhatsapp}</Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bertemu Siapa:</Text>
            <Text style={[styles.infoVal, { color: '#3B38F6' }]}>
              {record.bertemuSiapa}
            </Text>
          </View>

          <View style={[styles.infoRow, { marginTop: 6 }]}>
            <Text style={styles.infoLabel}>Keperluan:</Text>
            <Text style={styles.infoVal}>{record.keperluan}</Text>
          </View>

          <View style={[styles.infoRow, { marginTop: 6 }]}>
            <Text style={styles.infoLabel}>Waktu Check-In:</Text>
            <Text style={styles.infoVal}>
              {formatIndonesianDate(new Date(record.waktuCheckIn))}
            </Text>
          </View>
        </View>

        {/* WhatsApp & Cloud Notification Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>STATUS NOTIFIKASI OTOMATIS (ZONA D)</Text>
          <View style={styles.notificationStatusBox}>
            <Icon
              name={record.waTriggered ? 'check-circle' : 'schedule'}
              size={22}
              color={record.waTriggered ? '#10B981' : '#FF7A00'}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.notificationTitle}>
                {record.waTriggered
                  ? 'Pesan WhatsApp Terkirim'
                  : 'Menunggu Pengiriman Sinyal'}
              </Text>
              <Text style={styles.notificationDesc}>
                Notifikasi kedatangan tamu otomatis diteruskan ke nomor {record.bertemuSiapa} melalui gateway resmi BPS.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 3,
    borderBottomColor: '#111827',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  metodeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  metodeManual: {
    backgroundColor: '#FF7A00',
  },
  metodeQr: {
    backgroundColor: '#D4FF32',
  },
  metodeBadgeText: {
    fontSize: 9,
    fontWeight: '900',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  photoCard: {
    height: 340,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#111827',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
    shadowColor: '#111827',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
  },
  watermarkTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    borderWidth: 1.5,
    borderColor: '#D4FF32',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  watermarkTagText: {
    color: '#D4FF32',
    fontSize: 10,
    fontWeight: '900',
  },
  multiThumbRow: {
    flexDirection: 'row',
    gap: 8,
  },
  thumbBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#111827',
    overflow: 'hidden',
    position: 'relative',
  },
  thumbBoxActive: {
    borderColor: '#D4FF32',
    borderWidth: 3,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#111827',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  thumbBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  card: {
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#111827',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkInTime: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
  },
  namaText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginTop: 10,
  },
  instansiText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  hpText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },
  infoRow: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  notificationStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  notificationTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
  },
  notificationDesc: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6B7280',
  },
});
