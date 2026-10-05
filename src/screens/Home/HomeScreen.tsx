import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen() {
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Main Hero: Geolokasi & Aksi Cepat */}
        <View style={styles.section}>
          <View style={[styles.heroCard, { marginBottom: 0 }]}>
            <View style={styles.heroHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>GPS AKURAT</Text>
                </View>

              </View>
              <TouchableOpacity style={styles.telemetryRefreshBtn} activeOpacity={0.8}>
                <Icon name="refresh" size={30} color="#FFF" />
                <Text style={styles.telemetryRefreshText}>Perbarui</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={styles.heroTitle}>Lokasi Saat Ini</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Icon name="my-location" size={18} color="#D4FF32" />
                  <Text style={{ fontSize: 20, fontWeight: '900', color: '#D4FF32' }}>-6.175392, 106.827153</Text>
                </View>
                <Text style={{ color: '#E0E7FF', fontSize: 13, lineHeight: 20, fontWeight: '600' }} numberOfLines={2}>
                  Jl. Dr. Sutomo No.6-8, Ps. Baru, Sawah Besar
                </Text>
                <Text style={{ color: '#E0E7FF', fontSize: 11, fontWeight: '700', marginTop: 4, opacity: 0.8 }}>
                  Akurasi: ±3.2m • Diperbarui: Baru saja
                </Text>
              </View>
              <View style={[styles.radarBox, { width: 64, height: 64, borderRadius: 32, backgroundColor: '#D4FF32', borderWidth: 3 }]}>
                <View style={[styles.radarCircleOuter, { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5 }]} />
                <View style={[styles.radarCircleInner, { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(17,24,39,0.15)' }]} />
                <Icon name="pin-drop" size={32} color="#111827" />
              </View>
            </View>

            <TouchableOpacity style={[styles.heroButton, { marginTop: 4 }]} activeOpacity={0.8}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="camera-alt" size={20} color="#111827" />
                <Text style={styles.heroButtonText}>AMBIL FOTO DOKUMENTASI</Text>
                <Icon name="arrow-forward" size={20} color="#111827" />
              </View>
            </TouchableOpacity>

            <View style={styles.heroFooter}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="check-circle" size={16} color="#D4FF32" />
                <Text style={styles.heroFooterText}>Logo BPS + GPS Stamp Auto</Text>
              </View>
              <Text style={styles.heroFooterVersion}>v2.4-STABLE</Text>
            </View>
          </View>
        </View>

        {/* Modul Operasional */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.sectionDotDark} />
              <Text style={styles.sectionTitle}>Modul Operasional</Text>
            </View>
            <Text style={styles.sectionAction}>3 Alur Terpadu</Text>
          </View>

          {/* Module 1 */}
          <View style={[styles.moduleCard, { backgroundColor: '#D4FF32' }]}>
            <View style={styles.moduleHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[styles.moduleIconBox, { backgroundColor: '#FFF' }]}>
                  <Icon name="add-a-photo" size={24} color="#111827" />
                </View>
                <View>
                  <Text style={styles.moduleBadge1}>MODUL 01</Text>
                  <Text style={styles.moduleTitle}>Kegiatan Lapangan</Text>
                </View>
              </View>
              <Icon name="explore" size={32} color="#111827" />
            </View>
            <Text style={styles.moduleDesc}>
              Survei, sensus, & verifikasi lapangan dengan watermark logo BPS, koordinat GPS & waktu riil terverifikasi.
            </Text>
            <View style={styles.moduleFooter}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="pin-drop" size={16} color="#111827" />
                <Text style={styles.moduleFooterText}>Geotag Wajib</Text>
              </View>
              <TouchableOpacity style={styles.moduleBtnDark}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.moduleBtnDarkText}>Mulai Survei</Text>
                  <Icon name="arrow-forward" size={14} color="#FFF" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Module 2 */}
          <View style={[styles.moduleCard, { backgroundColor: '#FFF', marginTop: 12 }]}>
            <View style={styles.moduleHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[styles.moduleIconBox, { backgroundColor: '#FF7A00' }]}>
                  <Icon name="how-to-reg" size={24} color="#FFF" />
                </View>
                <View>
                  <Text style={styles.moduleBadge2}>MODUL 02</Text>
                  <Text style={styles.moduleTitle}>Buku Tamu</Text>
                </View>
              </View>
              <Icon name="badge" size={32} color="#FF7A00" />
            </View>
            <Text style={[styles.moduleDesc, { color: '#4B5563' }]}>
              Pencatatan kunjungan tamu dinas, identitas, instansi, keperluan, & swafoto bukti kunjungan kantor.
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <TouchableOpacity style={styles.moduleHalfBtnLight}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon name="edit" size={18} color="#111827" />
                  <Text style={styles.moduleHalfBtnLightText}>Form Manual</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moduleHalfBtnAccent}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon name="qr-code-scanner" size={18} color="#FFF" />
                  <Text style={styles.moduleHalfBtnAccentText}>Scan QR Tamu</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Module 3 */}
          <View style={[styles.moduleCard, { backgroundColor: '#262626', marginTop: 12 }]}>
            <View style={styles.moduleHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[styles.moduleIconBox, { backgroundColor: '#3B38F6', borderColor: '#FFF' }]}>
                  <Icon name="groups" size={24} color="#FFF" />
                </View>
                <View>
                  <Text style={styles.moduleBadge3}>MODUL 03</Text>
                  <Text style={[styles.moduleTitle, { color: '#FFF' }]}>Kelola Rapat</Text>
                </View>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>1 AKTIF</Text>
              </View>
            </View>
            <Text style={[styles.moduleDesc, { color: '#D1D5DB' }]}>
              Buat sesi rapat dinas, auto-generate QR Code presensi peserta, upload notulensi, & dokumentasi foto.
            </Text>
            <View style={styles.moduleFooter}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="co-present" size={16} color="#D4FF32" />
                <Text style={[styles.moduleFooterText, { color: '#D4FF32' }]}>Rakor Sakernas</Text>
              </View>
              <TouchableOpacity style={styles.moduleBtnPrimary}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.moduleBtnPrimaryText}>Buka Sesi</Text>
                  <Icon name="arrow-forward" size={14} color="#111827" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Statistik */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.sectionDotDark, { backgroundColor: '#3B38F6' }]} />
              <Text style={styles.sectionTitle}>Rekap Capaian</Text>
            </View>
            <Text style={styles.dateText}>16 FEB 2025</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#3B38F6' }]}>12</Text>
              <Text style={styles.statLabel}>Foto Lapangan</Text>
              <View style={[styles.statTag, { backgroundColor: '#D4FF32' }]}><Text style={styles.statTagText}>TERSYNC</Text></View>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#FF7A00' }]}>5</Text>
              <Text style={styles.statLabel}>Tamu Dinas</Text>
              <View style={[styles.statTag, { backgroundColor: '#FFE6CC', borderColor: '#FF7A00' }]}><Text style={[styles.statTagText, { color: '#FF7A00' }]}>TERBUKU</Text></View>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#111827' }]}>2</Text>
              <Text style={styles.statLabel}>Sesi Rapat</Text>
              <View style={[styles.statTag, { backgroundColor: '#262626', borderColor: '#111827' }]}><Text style={[styles.statTagText, { color: '#FFF' }]}>SELESAI</Text></View>
            </View>
          </View>
        </View>

        {/* Padding Bottom to clear bottom nav */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 2,
    borderBottomColor: '#111827',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    textTransform: 'uppercase',
  },
  badgeProv: {
    backgroundColor: '#D4FF32',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#111827',
  },
  badgeProvText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#111827',
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E9EDFF',
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF7A00',
    borderWidth: 1,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B38F6',
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  welcomeSub: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF7A00',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#111827',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4FF32',
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  telemetryCard: {
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: '#111827',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#111827',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  telemetryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  telemetryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  telemetryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#E9EDFF',
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  telemetryTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    textTransform: 'uppercase',
  },
  telemetryBadge: {
    backgroundColor: '#D4FF32',
    borderWidth: 1.5,
    borderColor: '#111827',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  telemetryBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#111827',
  },
  telemetryTime: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  telemetryRefreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF7A00',
    borderWidth: 2,
    borderColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  telemetryRefreshText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  telemetryDetails: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 6,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  telemetryCoords: {
    fontSize: 11,
    fontWeight: '900',
    color: '#3B38F6',
  },
  telemetryAddress: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  telemetryAccuracy: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4B5563',
  },
  radarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4FF32',
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  radarCircleOuter: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.3)',
  },
  radarCircleInner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(17,24,39,0.1)',
  },
  heroCard: {
    backgroundColor: '#3B38F6',
    borderWidth: 4,
    borderColor: '#111827',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroBadge: {
    backgroundColor: '#D4FF32',
    borderWidth: 2,
    borderColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  heroBadgeText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    textTransform: 'uppercase',
  },
  heroSubtitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 14,
    color: '#E0E7FF',
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: '#D4FF32',
    borderWidth: 3,
    borderColor: '#111827',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
    textTransform: 'uppercase',
  },
  heroFooter: {
    backgroundColor: '#271CE8',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroFooterText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  heroFooterVersion: {
    color: '#D4FF32',
    fontSize: 11,
    fontWeight: '900',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionDotDark: {
    width: 12,
    height: 12,
    backgroundColor: '#111827',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    textTransform: 'uppercase',
  },
  sectionAction: {
    fontSize: 11,
    fontWeight: '900',
    color: '#4B5563',
    textTransform: 'uppercase',
  },
  moduleCard: {
    borderWidth: 3,
    borderColor: '#111827',
    borderRadius: 12,
    padding: 16,
  },
  moduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleBadge1: {
    fontSize: 10,
    fontWeight: '900',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#111827',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  moduleBadge2: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FF7A00',
    backgroundColor: 'rgba(255,122,0,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FF7A00',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  moduleBadge3: {
    fontSize: 10,
    fontWeight: '900',
    color: '#D4FF32',
    backgroundColor: 'rgba(212,255,50,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4FF32',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  moduleDesc: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 16,
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#111827',
    paddingTop: 12,
  },
  moduleFooterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  moduleBtnDark: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  moduleBtnDarkText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  moduleHalfBtnLight: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#111827',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  moduleHalfBtnLightText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
  },
  moduleHalfBtnAccent: {
    flex: 1,
    backgroundColor: '#FF7A00',
    borderWidth: 2,
    borderColor: '#111827',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  moduleHalfBtnAccentText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF',
  },
  activeBadge: {
    backgroundColor: '#FF7A00',
    borderWidth: 2,
    borderColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  moduleBtnPrimary: {
    backgroundColor: '#D4FF32',
    borderWidth: 2,
    borderColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  moduleBtnPrimaryText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4B5563',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: '#111827',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111827',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  statTag: {
    borderWidth: 1.5,
    borderColor: '#111827',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 8,
  },
  statTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#111827',
  }
});
