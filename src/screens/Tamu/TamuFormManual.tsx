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

const HARI_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAFTAR_PEGAWAI_BPS = [
  'Kepala BPS Kota Malang',
  'Budi Santoso (Statistisi Ahli Muda)',
  'Anisa Rahmawati (Pranata Komputer)',
  'Dedi Kurniawan (Statistik Produksi)',
  'Rina Marlina (Statistik Distribusi)',
  'Fungsi Nerwilis & Analisis',
  'Subbagian Umum & Kepegawaian',
  'Lainnya (Ketik Manual)',
];

export default function TamuFormManual() {
  const navigation = useNavigation<any>();

  // Helper tanggal format Indonesia
  const formatTanggalIndo = (date: Date) => {
    const hari = HARI_NAMES[date.getDay()];
    const tgl = date.getDate();
    const bln = MONTH_NAMES[date.getMonth()];
    const thn = date.getFullYear();
    return `${hari}, ${tgl} ${bln} ${thn}`;
  };

  // State Form
  const [nama, setNama] = useState('');
  const [instansi, setInstansi] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [bertemuSiapa, setBertemuSiapa] = useState('');
  const [isCustomPegawai, setIsCustomPegawai] = useState(false);
  const [noWhatsapp, setNoWhatsapp] = useState('');

  // State Tanggal & Kalender Picker
  const [tanggal, setTanggal] = useState(formatTanggalIndo(new Date()));
  const [showCalendar, setShowCalendar] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  // State Dropdown Bertemu Siapa
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectDate = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day);
    setTanggal(formatTanggalIndo(d));
    setShowCalendar(false);
  };

  const setShortcutDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setTanggal(formatTanggalIndo(d));
    setCalMonth(d.getMonth());
    setCalYear(d.getFullYear());
    setShowCalendar(false);
  };

  const handleSelectPegawaiDropdown = (pegawai: string) => {
    if (pegawai === 'Lainnya (Ketik Manual)') {
      setIsCustomPegawai(true);
      setBertemuSiapa('');
    } else {
      setIsCustomPegawai(false);
      setBertemuSiapa(pegawai);
    }
    setIsDropdownOpen(false);
  };

  const handleLanjutDokumentasi = () => {
    if (!nama.trim()) {
      Alert.alert('Nama Wajib Diisi', 'Harap masukkan nama lengkap tamu.');
      return;
    }
    if (!instansi.trim()) {
      Alert.alert('Instansi Wajib Diisi', 'Harap masukkan instansi atau lembaga tamu.');
      return;
    }
    if (!tanggal.trim()) {
      Alert.alert('Tanggal Kosong', 'Harap pilih tanggal kunjungan.');
      return;
    }
    if (!bertemuSiapa.trim()) {
      Alert.alert('Tujuan Bertemu Kosong', 'Harap pilih atau isi staf/pimpinan yang ingin ditemui.');
      return;
    }
    if (!noWhatsapp.trim()) {
      Alert.alert('No WhatsApp Wajib Diisi', 'Harap masukkan nomor WhatsApp aktif tamu.');
      return;
    }
    if (!keperluan.trim()) {
      Alert.alert('Keperluan Wajib Diisi', 'Harap tuliskan keperluan kunjungan tamu.');
      return;
    }

    const formData: TamuFormData = {
      nama: nama.trim(),
      instansi: instansi.trim(),
      keperluan: keperluan.trim(),
      bertemuSiapa: bertemuSiapa.trim(),
      noWhatsapp: noWhatsapp.trim(),
      metode: 'manual',
      tanggal: tanggal.trim(),
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

        {/* 1. Tanggal Kunjungan dengan Kalender Picker */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>TANGGAL KUNJUNGAN *</Text>
          <View style={styles.inputBoxWithAction}>
            <Icon name="calendar-today" size={18} color="#6B7280" />
            <TextInput
              style={styles.inputFlex}
              placeholder="Pilih tanggal kunjungan..."
              placeholderTextColor="#9CA3AF"
              value={tanggal}
              onChangeText={setTanggal}
            />
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setShowCalendar((prev) => !prev)}
              activeOpacity={0.8}
            >
              <Icon
                name={showCalendar ? 'expand-less' : 'edit-calendar'}
                size={18}
                color="#111827"
              />
            </TouchableOpacity>
          </View>

          {/* Inline Calendar Date Picker */}
          {showCalendar && (
            <View style={styles.inlineCalCard}>
              <View style={styles.inlineCalHeader}>
                <Text style={styles.inlineCalHeaderTitle}>Pilih Tanggal Kunjungan</Text>
                <TouchableOpacity onPress={() => setShowCalendar(false)}>
                  <Icon name="close" size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Navigasi Bulan */}
              <View style={styles.inlineCalNav}>
                <TouchableOpacity
                  style={styles.inlineCalNavBtn}
                  onPress={() => {
                    if (calMonth === 0) {
                      setCalMonth(11);
                      setCalYear((prev) => prev - 1);
                    } else {
                      setCalMonth((prev) => prev - 1);
                    }
                  }}
                >
                  <Icon name="chevron-left" size={18} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.inlineCalMonthTitle}>
                  {MONTH_NAMES[calMonth]} {calYear}
                </Text>
                <TouchableOpacity
                  style={styles.inlineCalNavBtn}
                  onPress={() => {
                    if (calMonth === 11) {
                      setCalMonth(0);
                      setCalYear((prev) => prev + 1);
                    } else {
                      setCalMonth((prev) => prev + 1);
                    }
                  }}
                >
                  <Icon name="chevron-right" size={18} color="#111827" />
                </TouchableOpacity>
              </View>

              {/* Nama Hari */}
              <View style={styles.inlineCalDaysRow}>
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
                  <Text
                    key={d}
                    style={[
                      styles.inlineCalDayHeader,
                      i === 0 && { color: '#EF4444' },
                    ]}
                  >
                    {d}
                  </Text>
                ))}
              </View>

              {/* Grid Tanggal */}
              <View style={styles.inlineCalGrid}>
                {(() => {
                  const firstDay = new Date(calYear, calMonth, 1).getDay();
                  const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
                  const cells = [];

                  for (let i = 0; i < firstDay; i++) {
                    cells.push(
                      <View key={`empty-${i}`} style={styles.inlineCalCell} />
                    );
                  }

                  const now = new Date();
                  const isCurrentMonth =
                    now.getFullYear() === calYear && now.getMonth() === calMonth;
                  const nowDate = now.getDate();

                  for (let day = 1; day <= totalDays; day++) {
                    const isToday = isCurrentMonth && day === nowDate;

                    cells.push(
                      <TouchableOpacity
                        key={`day-${day}`}
                        style={[
                          styles.inlineCalCell,
                          isToday && styles.inlineCalCellToday,
                        ]}
                        onPress={() => handleSelectDate(calYear, calMonth, day)}
                      >
                        <Text
                          style={[
                            styles.inlineCalCellText,
                            isToday && { fontWeight: '900' },
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return cells;
                })()}
              </View>

              {/* Shortcut Tombol Hari Ini / Besok */}
              <View style={styles.inlineCalFooter}>
                <TouchableOpacity
                  style={styles.inlineCalQuickBtn}
                  onPress={() => setShortcutDate(0)}
                >
                  <Text style={styles.inlineCalQuickBtnText}>HARI INI</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.inlineCalQuickBtn}
                  onPress={() => setShortcutDate(1)}
                >
                  <Text style={styles.inlineCalQuickBtnText}>BESOK</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* 2. Nama Tamu */}
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

        {/* 3. Instansi */}
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

        {/* 4. Bertemu Siapa (DROPDOWN SELECTOR - Tidak lagi di-slide) */}
        <View style={[styles.inputCard, { zIndex: 10 }]}>
          <Text style={styles.label}>BERTEMU SIAPA / TUJUAN PEGAWAI *</Text>

          {/* Dropdown Button Trigger */}
          <TouchableOpacity
            style={[
              styles.dropdownTrigger,
              isDropdownOpen && styles.dropdownTriggerOpen,
            ]}
            activeOpacity={0.85}
            onPress={() => setIsDropdownOpen((prev) => !prev)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
              <Icon name="person" size={20} color={bertemuSiapa ? '#3B38F6' : '#9CA3AF'} />
              <Text
                style={[
                  styles.dropdownTriggerText,
                  !bertemuSiapa && styles.dropdownPlaceholder,
                ]}
                numberOfLines={1}
              >
                {bertemuSiapa || 'Pilih Pegawai atau Fungsi BPS...'}
              </Text>
            </View>
            <Icon
              name={isDropdownOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={22}
              color="#111827"
            />
          </TouchableOpacity>

          {/* Dropdown Options List */}
          {isDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {DAFTAR_PEGAWAI_BPS.map((pegawai) => {
                const isSelected =
                  bertemuSiapa === pegawai ||
                  (isCustomPegawai && pegawai === 'Lainnya (Ketik Manual)');

                return (
                  <TouchableOpacity
                    key={pegawai}
                    style={[
                      styles.dropdownItem,
                      isSelected && styles.dropdownItemSelected,
                    ]}
                    onPress={() => handleSelectPegawaiDropdown(pegawai)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={
                        pegawai === 'Lainnya (Ketik Manual)'
                          ? 'edit'
                          : 'account-circle'
                      }
                      size={18}
                      color={isSelected ? '#3B38F6' : '#6B7280'}
                    />
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isSelected && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {pegawai}
                    </Text>
                    {isSelected && (
                      <Icon name="check" size={18} color="#3B38F6" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Input Manual Tambahan Jika Memilih 'Lainnya' atau ingin edit nama */}
          {isCustomPegawai && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.subLabel}>KETIK NAMA PEGAWAI SECARA MANUAL:</Text>
              <TextInput
                style={[styles.input, { borderColor: '#3B38F6' }]}
                placeholder="Masukkan nama pegawai yang dituju..."
                placeholderTextColor="#9CA3AF"
                value={bertemuSiapa}
                onChangeText={setBertemuSiapa}
                autoFocus
              />
            </View>
          )}
        </View>

        {/* 5. Nomor WhatsApp */}
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

        {/* 6. Keperluan */}
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
  inputBoxWithAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  inputFlex: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  actionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#D4FF32',
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  textArea: {
    height: 75,
    textAlignVertical: 'top',
  },

  // ── INLINE CALENDAR STYLES ──
  inlineCalCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  inlineCalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E5E7EB',
  },
  inlineCalHeaderTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
  },
  inlineCalNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inlineCalNavBtn: {
    padding: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#111827',
    backgroundColor: '#FFF',
  },
  inlineCalMonthTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
  },
  inlineCalDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  inlineCalDayHeader: {
    width: 32,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
  },
  inlineCalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inlineCalCell: {
    width: '14.28%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginVertical: 1,
  },
  inlineCalCellToday: {
    backgroundColor: '#D4FF32',
    borderWidth: 1,
    borderColor: '#111827',
  },
  inlineCalCellText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
  },
  inlineCalFooter: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inlineCalQuickBtn: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#111827',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  inlineCalQuickBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111827',
  },

  // ── DROPDOWN STYLES ──
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  dropdownTriggerOpen: {
    borderColor: '#3B38F6',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownTriggerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  dropdownPlaceholder: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  dropdownMenu: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: '#111827',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 8,
  },
  dropdownItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  dropdownItemTextSelected: {
    color: '#3B38F6',
    fontWeight: '900',
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
