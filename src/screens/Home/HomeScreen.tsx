import React, { useState } from 'react';
import { View, ScrollView, Text, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './HomeScreen.styles';
import GpsLocationCard from './components/GpsLocationCard';
import ModulOperasional from './components/ModulOperasional';
import RekapCapaian from './components/RekapCapaian';
import OfflineBanner from '../../components/OfflineBanner';
import { useNetworkSync } from '../../hooks/useNetworkSync';

export default function HomeScreen() {
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const { isOnline } = useNetworkSync();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida/AEtjO1UwyTrm0-BZ3EIeFjg0-rLh4iW75JYVPyWdtpWNBAwBwZ2xELUxh0usHxnXm3Ez5i7kuN9tNgx1vXIZcS_--fu7ExE3ETapQkSqTBmm_g99g3A2j0ZwUe33d9MKSimKz5qzCsGb2amDRMHG0JjaRRmHIxWGYMuuzxF2bZNoxu6WqskZ10xv9QhrVbKRE17-mH0RXZp-tPakuTKdRRreyNMwDc0qu5wKDtT6epL93NoCGAH1kMLKejedZ8oJ' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <View>
              <Text style={styles.welcomeText}>Halo, Budi Santoso</Text>
              <Text style={styles.welcomeSub}>Statistisi Ahli Muda • BPS Kota Malang</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.profileAvatar}>
            <Icon name="person" size={24} color="#FFF" />
          </View>
        </View>
      </View>

      {/* Banner Status Koneksi */}
      <OfflineBanner isOffline={!isOnline} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* GPS Location & Watermark Settings */}
        <GpsLocationCard
          watermarkEnabled={watermarkEnabled}
          onWatermarkToggle={() => setWatermarkEnabled(!watermarkEnabled)}
        />

        {/* Modul Operasional */}
        <ModulOperasional />

        {/* Rekap Capaian */}
        <RekapCapaian />

        {/* Padding Bottom to clear bottom nav */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
