import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { TamuFormData } from '../../types/tamu';
import CustomButton from '../../components/CustomButton';

const DAFTAR_PEGAWAI_BPS = [
  'Kepala BPS Kota Malang',
  'Budi Santoso (Statistisi Ahli Muda)',
  'Anisa Rahmawati (Pranata Komputer)',
  'Dedi Kurniawan (Statistik Produksi)',
  'Rina Marlina (Statistik Distribusi)',
  'Fungsi Nerwilis & Analisis',
  'Subbagian Umum & Kepegawaian',
];

export default function TamuFormManual() {
  const navigation = useNavigation<any>();

  const [nama, setNama] = useState('');
  const [instansi, setInstansi] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [bertemuSiapa, setBertemuSiapa] = useState('');
  const [noWhatsapp, setNoWhatsapp] = useState('');

  const handleLanjutDokumentasi = () => {
    if (!nama.trim()) {
      Alert.alert('Nama Wajib Diisi', 'Harap masukkan nama lengkap tamu.');
      return;
    }
    if (!instansi.trim()) {
      Alert.alert('Instansi Wajib Diisi', 'Harap masukkan instansi atau lembaga tamu.');
      return;
    }
    if (!keperluan.trim()) {
      Alert.alert('Keperluan Wajib Diisi', 'Harap tuliskan keperluan kunjungan tamu.');
      return;
    }
    if (!bertemuSiapa.trim()) {
      Alert.alert('Tujuan Bertemu Kosong', 'Harap isi staf atau pimpinan yang ingin ditemui.');
      return;
    }
    if (!noWhatsapp.trim()) {
      Alert.alert('No WhatsApp Wajib Diisi', 'Harap masukkan nomor WhatsApp aktif tamu.');
      return;
    }

    const formData: TamuFormData = {
      nama: nama.trim(),
      instansi: instansi.trim(),
      keperluan: keperluan.trim(),
      bertemuSiapa: bertemuSiapa.trim(),
      noWhatsapp: noWhatsapp.trim(),
      metode: 'manual',
    };

    // Alur diagram: Mengisi Form Manual -> Ambil Dokumentasi (TamuCam)
    navigation.navigate('TamuCam', { formData });
  };

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
          <Text style={styles.headerTitle}>Formulir Tamu Manual</Text>
          <Text style={styles.headerSub}>Input Langsung oleh Petugas Resepsionis</Text>
        </View>
        <View style={styles.manualBadge}>
          <Text style={styles.manualBadgeText}>MANUAL</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Icon name="info-outline" size={20} color="#111827" />
          <Text style={styles.infoBannerText}>
            Gunakan jalur ini apabila tamu tidak dapat melakukan scan QR Code meja secara mandiri.
          </Text>
        </View>

        {/* 1. Nama Tamu */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>NAMA LENGKAP TAMU *</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Ir. Hendra Kusuma, M.T."
            placeholderTextColor="#9CA3AF"
            value={nama}
            onChangeText={setNama}
          />
        </View>

        {/* 2. Instansi */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>ASAL INSTANSI / LEMBAGA / PRIBADI *</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Dinas Kominfo Kota Malang / Mandiri"
            placeholderTextColor="#9CA3AF"
            value={instansi}
            onChangeText={setInstansi}
          />
        </View>

        {/* 3. Bertemu Siapa */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>BERTEMU SIAPA / TUJUAN PEGAWAI *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ketik nama pegawai atau pilih dari daftar cepat..."
            placeholderTextColor="#9CA3AF"
            value={bertemuSiapa}
            onChangeText={setBertemuSiapa}
          />
          <Text style={styles.subLabel}>PILIHAN CEPAT PEGAWAI / FUNGSI:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipRow}>
              {DAFTAR_PEGAWAI_BPS.map((pegawai) => (
                <TouchableOpacity
                  key={pegawai}
                  style={[
                    styles.chip,
                    bertemuSiapa === pegawai && styles.chipActive,
                  ]}
                  onPress={() => setBertemuSiapa(pegawai)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      bertemuSiapa === pegawai && styles.chipTextActive,
                    ]}
                  >
                    {pegawai}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 4. Nomor WhatsApp */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>NOMOR WHATSAPP TAMU *</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: 081234567890"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            value={noWhatsapp}
            onChangeText={setNoWhatsapp}
          />
          <Text style={styles.hintText}>
            Nomor ini akan menerima pesan konfirmasi dan tanda terima kehadiran resmi.
          </Text>
        </View>

        {/* 5. Keperluan */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>KEPERLUAN KUNJUNGAN *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tuliskan maksud dan keperluan bertamu di BPS..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            value={keperluan}
            onChangeText={setKeperluan}
          />
        </View>

        {/* CTA Lanjut ke Ambil Dokumentasi */}
        <View style={styles.btnArea}>
          <CustomButton
            title="LANJUT KE DOKUMENTASI FOTO"
            variant="primary"
            iconName="arrow-forward"
            size="lg"
            onPress={handleLanjutDokumentasi}
          />
          <Text style={styles.disclaimerText}>
            Langkah selanjutnya: Pengambilan foto dokumentasi dengan watermark resmi BPS (Logo, Tanggal, Jam & GPS Koordinat).
          </Text>
        </View>
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
  manualBadge: {
    backgroundColor: '#FF7A00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  manualBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFF',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#D4FF32',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 12,
    padding: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 16,
  },
  inputCard: {
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#111827',
    borderRadius: 14,
    padding: 14,
    // Solid shadow Neo-Brutalism
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    marginTop: 10,
    marginBottom: 6,
  },
  hintText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  textArea: {
    height: 75,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chipActive: {
    backgroundColor: '#3B38F6',
  },
  chipText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#111827',
  },
  chipTextActive: {
    color: '#FFF',
  },
  btnArea: {
    marginTop: 8,
    gap: 8,
  },
  disclaimerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});
