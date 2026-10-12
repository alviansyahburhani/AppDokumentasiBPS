import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../HomeScreen.styles';

interface GpsLocationCardProps {
  watermarkEnabled: boolean;
  onWatermarkToggle: () => void;
}

export default function GpsLocationCard({ watermarkEnabled, onWatermarkToggle }: GpsLocationCardProps) {
  return (
    <View style={styles.section}>
      <View style={styles.walletCardOuter}>
        {/* Inner Blue Card (Lokasi Utama) */}
        <View style={styles.walletCardInner}>
          <View style={styles.walletHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="my-location" size={16} color="#D4FF32" />
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#E0E7FF' }}>GPS SAAT INI</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#D4FF32', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 }}>
              <Icon name="refresh" size={14} color="#3B38F6" />
              <Text style={{ fontSize: 10, fontWeight: '900', color: '#3B38F6' }}>PERBARUI</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 26, fontWeight: '900', color: '#FFF', letterSpacing: 0.5 }}>-6.175392, 106.8271</Text>
            <Text style={{ color: '#E0E7FF', fontSize: 12, lineHeight: 18, fontWeight: '500', marginTop: 4, opacity: 0.9 }}>
              Jl. Dr. Sutomo No.6-8, Ps. Baru, Sawah Besar
            </Text>
          </View>

          <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>Akurasi ±3.2m • Baru saja</Text>
            <Icon name="chevron-right" size={18} color="#FFF" />
          </View>
        </View>

        {/* Pengaturan Watermark */}
        <View style={styles.watermarkSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.watermarkIconBox}>
              <Icon name="branding-watermark" size={20} color="#3B38F6" />
            </View>
            <View>
              <Text style={styles.watermarkTitle}>Tamplate Watermark</Text>
              <Text style={styles.watermarkDesc}>Edit watermark yang akan digunakan</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity style={styles.watermarkTuneBtn} activeOpacity={0.7}>
              <Icon name="tune" size={20} color="#111827" />
            </TouchableOpacity>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#D4FF32' }}
              thumbColor={watermarkEnabled ? '#111827' : '#F9FAFB'}
              ios_backgroundColor="#D1D5DB"
              onValueChange={onWatermarkToggle}
              value={watermarkEnabled}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
