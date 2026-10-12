import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles as globalStyles } from '../HomeScreen.styles';

export default function RekapCapaian() {
  return (
    <View style={globalStyles.section}>
      <View style={globalStyles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={[globalStyles.sectionDotDark, { backgroundColor: '#FF7A00' }]} />
          <Text style={globalStyles.sectionTitle}>Rekap Capaian</Text>
        </View>
        <TouchableOpacity>
          <Text style={globalStyles.sectionAction}>Lihat Detail</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bentoContainer}>
        {/* ROW 1: Split 50-50 */}
        <View style={styles.bentoRow}>
          {/* Left Column (Tall Box) */}
          <View style={[styles.bentoBox, { flex: 1, backgroundColor: '#D4FF32', justifyContent: 'space-between', minHeight: 160 }]}>
            <View style={styles.iconCircleDark}>
              <Icon name="cloud-done" size={24} color="#FFF" />
            </View>
            <View>
              <Text style={styles.bentoTitle}>Status Sync</Text>
              <Text style={styles.bentoValue}>100% Aman</Text>
              <Text style={styles.bentoSubDark}>Semua antrean terkirim</Text>
            </View>
          </View>

          {/* Right Column (Two small stacked boxes) */}
          <View style={{ flex: 1, gap: 12 }}>
            {/* Top Right Box */}
            <View style={[styles.bentoBox, { backgroundColor: '#FFF', flex: 1, justifyContent: 'center' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Icon name="co-present" size={24} color="#3B38F6" />
                <View style={styles.badgeMini}>
                  <Text style={styles.badgeMiniText}>HARI INI</Text>
                </View>
              </View>
              <Text style={[styles.bentoTitle, { marginTop: 8 }]}>Rapat Terakhir</Text>
              <Text style={[styles.bentoSubDark, { fontWeight: '800', marginTop: 2 }]} numberOfLines={1}>
                Rakor Sakernas
              </Text>
            </View>

            {/* Bottom Right Box */}
            <View style={[styles.bentoBox, { backgroundColor: '#3B38F6', flex: 1, justifyContent: 'center' }]}>
              <Text style={[styles.bentoTitle, { color: '#FFF' }]}>Tamu Dinas</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 4 }}>
                <Text style={[styles.bentoValue, { color: '#FFF', fontSize: 24 }]}>12</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Icon name="trending-up" size={14} color="#D4FF32" />
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#D4FF32', marginLeft: 2 }}>+3</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ROW 2: Wide Box with Progress Bar */}
        <View style={[styles.bentoBox, { backgroundColor: '#FF7A00', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Icon name="track-changes" size={18} color="#FFF" />
              <Text style={[styles.bentoTitle, { color: '#FFF' }]}>Target Lapangan</Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFF', opacity: 0.9 }}>
              4 dari 5 Titik Tersurvei
            </Text>
            
            {/* Progress bar container */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '80%' }]} />
            </View>
          </View>
          <View style={styles.trophyContainer}>
            <Icon name="emoji-events" size={32} color="#FF7A00" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bentoContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoBox: {
    borderWidth: 3,
    borderColor: '#111827',
    borderRadius: 16,
    padding: 14,
    // Solid Shadow khas Neo-Brutalism
    shadowColor: '#111827',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  iconCircleDark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
    textTransform: 'uppercase',
  },
  bentoValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    marginTop: 2,
  },
  bentoSubDark: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  badgeMini: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  badgeMiniText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#111827',
  },
  progressBarBg: {
    height: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.3)', // Semi transparent dark
    borderRadius: 6,
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#111827',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRightWidth: 1.5,
    borderColor: '#111827',
  },
  trophyContainer: {
    width: 52,
    height: 52,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    transform: [{ rotate: '5deg' }],
  },
});
