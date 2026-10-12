import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles as globalStyles } from '../HomeScreen.styles';

export default function ModulOperasional() {
  const navigation = useNavigation<any>();

  return (
    <View style={globalStyles.section}>
      <View style={globalStyles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={globalStyles.sectionDotDark} />
          <Text style={globalStyles.sectionTitle}>Modul Utama</Text>
        </View>
      </View>

      <View style={styles.container}>
        {/* HERO CARD: Kegiatan Lapangan */}
        <TouchableOpacity
          style={[styles.card, styles.cardHero]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('LapanganCam')}
        >
          <View style={styles.heroHeader}>
            <View style={styles.iconBoxHero}>
              <Icon name="add-a-photo" size={24} color="#111827" />
            </View>
            <View style={styles.badgeHero}>
              <Icon name="pin-drop" size={12} color="#111827" />
              <Text style={styles.badgeHeroText}>GPS WAJIB</Text>
            </View>
          </View>
          <View style={{ marginTop: 12 }}>
            <Text style={styles.titleHero}>Kegiatan Lapangan</Text>
            <Text style={styles.descHero}>
              Kamera ber-watermark dengan koordinat akurat. Mendukung sinkronisasi offline.
            </Text>
          </View>
          <View style={styles.btnHero}>
            <Text style={styles.btnHeroText}>BUKA KAMERA</Text>
            <Icon name="arrow-forward" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* SPLIT GRID: Buku Tamu & Kelola Rapat */}
        <View style={styles.splitRow}>
          {/* Card: Buku Tamu */}
          <TouchableOpacity style={[styles.card, styles.cardSplit, { backgroundColor: '#FFF' }]} activeOpacity={0.9}>
            <View style={[styles.iconBoxSplit, { backgroundColor: '#FF7A00' }]}>
              <Icon name="qr-code-scanner" size={22} color="#FFF" />
            </View>
            <Text style={[styles.titleSplit, { color: '#111827' }]}>Buku Tamu</Text>
            <Text style={[styles.descSplit, { color: '#4B5563' }]} numberOfLines={2}>
              Catat identitas & swafoto tamu
            </Text>
            <View style={[styles.btnSplit, { backgroundColor: '#F9FAFB', borderColor: '#111827' }]}>
              <Text style={[styles.btnSplitText, { color: '#111827' }]}>SCAN QR</Text>
            </View>
          </TouchableOpacity>

          {/* Card: Kelola Rapat */}
          <TouchableOpacity style={[styles.card, styles.cardSplit, { backgroundColor: '#111827' }]} activeOpacity={0.9}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <View style={[styles.iconBoxSplit, { backgroundColor: '#3B38F6', borderColor: '#FFF' }]}>
                 <Icon name="groups" size={22} color="#FFF" />
               </View>
               <View style={{ backgroundColor: '#FF7A00', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                 <Text style={{ fontSize: 9, fontWeight: '900', color: '#FFF' }}>1 AKTIF</Text>
               </View>
            </View>
            <Text style={[styles.titleSplit, { color: '#FFF' }]}>Kelola Rapat</Text>
            <Text style={[styles.descSplit, { color: '#9CA3AF' }]} numberOfLines={2}>
              Presensi & dokumentasi
            </Text>
            <View style={[styles.btnSplit, { backgroundColor: '#D4FF32', borderColor: '#D4FF32' }]}>
              <Text style={[styles.btnSplitText, { color: '#111827' }]}>BUKA SESI</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    borderWidth: 3,
    borderColor: '#111827',
    borderRadius: 16,
    padding: 16,
    // Solid shadow Neo-Brutalism
    shadowColor: '#111827',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  // --- HERO ---
  cardHero: {
    backgroundColor: '#D4FF32', // Neon Green
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconBoxHero: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  badgeHeroText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#111827',
  },
  titleHero: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    textTransform: 'uppercase',
  },
  descHero: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
    lineHeight: 18,
  },
  btnHero: {
    marginTop: 16,
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnHeroText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },

  // --- SPLIT ---
  splitRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardSplit: {
    flex: 1,
    padding: 14,
  },
  iconBoxSplit: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titleSplit: {
    fontSize: 14,
    fontWeight: '900',
  },
  descSplit: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 12,
    minHeight: 28, // Menjaga ketinggian agar rata antara kartu kiri dan kanan
  },
  btnSplit: {
    borderWidth: 2,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSplitText: {
    fontSize: 11,
    fontWeight: '900',
  },
});
