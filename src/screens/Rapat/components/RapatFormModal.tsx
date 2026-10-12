import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../../components/CustomButton';
import { styles } from '../RapatScreen.styles';

const HARI_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

interface RapatFormModalProps {
  visible: boolean;
  onClose: () => void;
  judulRapat: string;
  onChangeJudulRapat: (text: string) => void;
  tanggal: string;
  onChangeTanggal: (text: string) => void;
  waktu: string;
  onChangeWaktu: (text: string) => void;
  ruang: string;
  onChangeRuang: (text: string) => void;
  keterangan: string;
  onChangeKeterangan: (text: string) => void;
  onSubmit: () => void;
}

export default function RapatFormModal({
  visible,
  onClose,
  judulRapat,
  onChangeJudulRapat,
  tanggal,
  onChangeTanggal,
  waktu,
  onChangeWaktu,
  ruang,
  onChangeRuang,
  keterangan,
  onChangeKeterangan,
  onSubmit,
}: RapatFormModalProps) {
  // State untuk Date Picker kalender inline
  const [showCalendar, setShowCalendar] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  const formatTanggalIndo = (date: Date) => {
    const hari = HARI_NAMES[date.getDay()];
    const tgl = date.getDate();
    const bln = MONTH_NAMES[date.getMonth()];
    const thn = date.getFullYear();
    return `${hari}, ${tgl} ${bln} ${thn}`;
  };

  const handleSelectDate = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day);
    onChangeTanggal(formatTanggalIndo(d));
    setShowCalendar(false);
  };

  const setShortcutDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    onChangeTanggal(formatTanggalIndo(d));
    setCalMonth(d.getMonth());
    setCalYear(d.getFullYear());
    setShowCalendar(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="add-circle" size={22} color="#3B38F6" />
              <Text style={styles.modalTitle}>Buat Sesi Rapat Baru</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 1. Judul Rapat */}
            <Text style={styles.inputLabel}>Agenda / Judul Rapat *</Text>
            <View style={styles.inputBox}>
              <Icon name="title" size={18} color="#6B7280" />
              <TextInput
                placeholder="Misal: Rakor Sensus Pertanian 2026"
                placeholderTextColor="#9CA3AF"
                style={styles.textInput}
                value={judulRapat}
                onChangeText={onChangeJudulRapat}
              />
            </View>

            {/* 2. Tanggal Pelaksanaan dengan Tombol Kalender */}
            <Text style={styles.inputLabel}>Tanggal Pelaksanaan *</Text>
            <View style={styles.inputBox}>
              <Icon name="calendar-today" size={18} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                value={tanggal}
                onChangeText={onChangeTanggal}
                placeholder="Pilih atau ketik tanggal..."
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                style={styles.formActionBtn}
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

            {/* Kalender Langsung (Inline Date Picker) */}
            {showCalendar && (
              <View style={styles.inlinePickerCard}>
                <View style={styles.inlinePickerHeader}>
                  <Text style={styles.inlinePickerTitle}>Pilih Tanggal dari Kalender</Text>
                  <TouchableOpacity onPress={() => setShowCalendar(false)}>
                    <Icon name="close" size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Navigasi Bulan & Tahun */}
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
                  <Text style={styles.inlineCalMonthText}>
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

                {/* Header Hari */}
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
                    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
                    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                    const slots = [];

                    for (let i = 0; i < firstDayIndex; i++) {
                      slots.push(
                        <View key={`empty-${i}`} style={styles.inlineCalCell} />
                      );
                    }

                    const today = new Date();
                    const isCurMonth =
                      today.getFullYear() === calYear && today.getMonth() === calMonth;
                    const todayDate = today.getDate();

                    for (let day = 1; day <= daysInMonth; day++) {
                      const isToday = isCurMonth && day === todayDate;

                      slots.push(
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
                              styles.inlineCalText,
                              isToday && { fontWeight: '900' },
                            ]}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                    return slots;
                  })()}
                </View>

                {/* Shortcut Cepat */}
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
                  <TouchableOpacity
                    style={styles.inlineCalQuickBtn}
                    onPress={() => setShortcutDate(2)}
                  >
                    <Text style={styles.inlineCalQuickBtnText}>LUSA</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 3. Waktu / Durasi Sesi (Input Bersih) */}
            <Text style={styles.inputLabel}>Waktu / Durasi Sesi *</Text>
            <View style={styles.inputBox}>
              <Icon name="schedule" size={18} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                value={waktu}
                onChangeText={onChangeWaktu}
                placeholder="Misal: 09:00 - 12:00 WIB"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* 4. Ruang Rapat (Input Bersih) */}
            <Text style={styles.inputLabel}>Ruang Rapat *</Text>
            <View style={styles.inputBox}>
              <Icon name="meeting-room" size={18} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                value={ruang}
                onChangeText={onChangeRuang}
                placeholder="Misal: Ruang Rapat Utama Lt. 2"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* 5. Keterangan Tambahan */}
            <Text style={styles.inputLabel}>Keterangan Tambahan</Text>
            <View style={[styles.inputBox, { height: 70, alignItems: 'flex-start' }]}>
              <TextInput
                placeholder="Catatan agenda atau instruksi peserta..."
                placeholderTextColor="#9CA3AF"
                multiline
                style={[styles.textInput, { paddingTop: 6 }]}
                value={keterangan}
                onChangeText={onChangeKeterangan}
              />
            </View>

            <View style={styles.modalBannerNotice}>
              <Icon name="info" size={18} color="#111827" />
              <Text style={styles.modalBannerNoticeText}>
                Setelah dibuat, sistem Web Form Tamu akan otomatis menampilkan opsi
                rapat ini untuk peserta yang hadir.
              </Text>
            </View>

            <View style={{ marginTop: 14 }}>
              <CustomButton
                title="AKTIFKAN SESI RAPAT"
                variant="primary"
                iconName="check"
                onPress={onSubmit}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
