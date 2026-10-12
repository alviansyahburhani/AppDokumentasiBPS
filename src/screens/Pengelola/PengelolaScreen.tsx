import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SesiRapat, TemplatePilihanCepat } from '../../types/pengelola';
import { pengelolaStorage } from '../../database/pengelolaStorage';
import CustomButton from '../../components/CustomButton';

export default function PengelolaScreen() {
  const [activeSection, setActiveSection] = useState<'RAPAT' | 'TEMPLATES'>('RAPAT');
  const [sesiList, setSesiList] = useState<SesiRapat[]>([]);
  const [stats, setStats] = useState(pengelolaStorage.getStats());

  // Modal Tambah Sesi Rapat
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [judulRapat, setJudulRapat] = useState('');
  const [tanggal, setTanggal] = useState('Senin, 12 Oktober 2026');
  const [waktu, setWaktu] = useState('09:00 - 12:00 WIB');
  const [ruang, setRuang] = useState('Ruang Rapat Utama Lt. 2');
  const [keterangan, setKeterangan] = useState('');

  // Modal Lihat QR Code Presensi Rapat
  const [selectedQrSesi, setSelectedQrSesi] = useState<SesiRapat | null>(null);

  // Filter Kategori Template
  const [selectedTplKategori, setSelectedTplKategori] =
    useState<TemplatePilihanCepat['kategori']>('PEGAWAI');
  const [templatesList, setTemplatesList] = useState<TemplatePilihanCepat[]>([]);

  // Modal Tambah Template Cepat
  const [showAddTplModal, setShowAddTplModal] = useState(false);
  const [tplLabel, setTplLabel] = useState('');
  const [tplSubLabel, setTplSubLabel] = useState('');
  const [tplNilai, setTplNilai] = useState('');

  const loadData = () => {
    setSesiList(pengelolaStorage.getSesiRapatList());
    setTemplatesList(pengelolaStorage.getTemplatesByKategori(selectedTplKategori));
    setStats(pengelolaStorage.getStats());
  };

  useEffect(() => {
    loadData();
    const unsub = pengelolaStorage.subscribe(loadData);
    return () => unsub();
  }, [selectedTplKategori]);

  // Alur Diagram: Isi Detail Rapat -> Submit -> Sistem Otomatis Mengaktifkan Web Form / Auto Generate QR Code
  const handleSubmitSesiBaru = () => {
    if (!judulRapat.trim()) {
      Alert.alert('Judul Kosong', 'Harap masukkan nama atau judul rapat.');
      return;
    }
    if (!ruang.trim()) {
      Alert.alert('Ruangan Kosong', 'Harap tentukan ruang rapat.');
      return;
    }

    const created = pengelolaStorage.tambahSesiRapat({
      judulRapat: judulRapat.trim(),
      tanggalPelaksanaan: tanggal.trim(),
      waktuMulai: waktu.trim(),
      ruangRapat: ruang.trim(),
      keterangan: keterangan.trim() || 'Presensi dan dokumentasi rapat BPS Kota Malang.',
    });

    setShowTambahModal(false);
    setJudulRapat('');
    setKeterangan('');

    Alert.alert(
      'Sesi Rapat Diaktifkan! 📢',
      `Web Form presensi telah AKTIF dan QR Code otomatis dibuat untuk "${created.judulRapat}". Tamu peserta rapat sekarang dapat melakukan presensi.`
    );
  };

  const handleToggleSesi = (id: string, judul: string, currentStatus: string) => {
    const isNowClosing = currentStatus === 'AKTIF';
    Alert.alert(
      isNowClosing ? 'Tutup Sesi Rapat?' : 'Buka Kembali Sesi?',
      isNowClosing
        ? `Menutup sesi "${judul}" akan menonaktifkan Web Form presensi di sistem tamu.`
        : `Mengaktifkan kembali sesi "${judul}" agar dapat menerima presensi tamu.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: isNowClosing ? 'TUTUP SESI' : 'BUKA SESI',
          style: isNowClosing ? 'destructive' : 'default',
          onPress: () => pengelolaStorage.toggleStatusSesi(id),
        },
      ]
    );
  };

  const handleHapusSesi = (id: string, judul: string) => {
    Alert.alert('Hapus Sesi?', `Hapus catatan sesi "${judul}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => pengelolaStorage.hapusSesi(id),
      },
    ]);
  };

  const handleTambahTemplate = () => {
    if (!tplLabel.trim() || !tplNilai.trim()) {
      Alert.alert('Form Belum Lengkap', 'Label dan isi nilai wajib diisi.');
      return;
    }

    pengelolaStorage.tambahTemplate({
      kategori: selectedTplKategori,
      label: tplLabel.trim(),
      subLabel: tplSubLabel.trim() || undefined,
      nilai: tplNilai.trim(),
    });

    setShowAddTplModal(false);
    setTplLabel('');
    setTplSubLabel('');
    setTplNilai('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Pusat Pengelola BPS</Text>
          <Text style={styles.headerSub}>Sesi Rapat, Template & Pilihan Cepat</Text>
        </View>
        <View style={styles.adminBadge}>
          <Icon name="tune" size={14} color="#111827" />
          <Text style={styles.adminBadgeText}>ADMIN</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI STATS BAR */}
        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, { backgroundColor: '#D4FF32' }]}>
            <Text style={styles.kpiVal}>{stats.aktifCount}</Text>
            <Text style={styles.kpiLabel}>Sesi Aktif</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor: '#FFF' }]}>
            <Text style={styles.kpiVal}>{stats.ditutupCount}</Text>
            <Text style={styles.kpiLabel}>Sesi Ditutup</Text>
          </View>
          <View style={[styles.kpiCard, { backgroundColor: '#3B38F6' }]}>
            <Text style={[styles.kpiVal, { color: '#FFF' }]}>{stats.totalTemplate}</Text>
            <Text style={[styles.kpiLabel, { color: '#FFF' }]}>Template Presets</Text>
          </View>
        </View>

        {/* SECTION TOGGLE: KELOLA RAPAT vs TEMPLATES */}
        <View style={styles.navSectionRow}>
          <TouchableOpacity
            style={[
              styles.navSectionBtn,
              activeSection === 'RAPAT' && styles.navSectionBtnActive,
            ]}
            onPress={() => setActiveSection('RAPAT')}
          >
            <Icon
              name="meeting-room"
              size={18}
              color={activeSection === 'RAPAT' ? '#D4FF32' : '#111827'}
            />
            <Text
              style={[
                styles.navSectionText,
                activeSection === 'RAPAT' && styles.navSectionTextActive,
              ]}
            >
              KELOLA RAPAT ({stats.totalRapat})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navSectionBtn,
              activeSection === 'TEMPLATES' && styles.navSectionBtnActive,
            ]}
            onPress={() => setActiveSection('TEMPLATES')}
          >
            <Icon
              name="bookmarks"
              size={18}
              color={activeSection === 'TEMPLATES' ? '#D4FF32' : '#111827'}
            />
            <Text
              style={[
                styles.navSectionText,
                activeSection === 'TEMPLATES' && styles.navSectionTextActive,
              ]}
            >
              TEMPLATE & PILIHAN
            </Text>
          </TouchableOpacity>
        </View>

        {/* ---------------- SECTION 1: KELOLA RAPAT (SESUAI DIAGRAM) ---------------- */}
        {activeSection === 'RAPAT' ? (
          <View style={styles.contentWrap}>
            {/* CTA TAMBAH SESI BARU (Sesuai Diagram) */}
            <TouchableOpacity
              style={styles.addSesiHero}
              activeOpacity={0.9}
              onPress={() => setShowTambahModal(true)}
            >
              <View style={styles.addSesiHeroLeft}>
                <View style={styles.iconHeroBox}>
                  <Icon name="add" size={24} color="#111827" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.addSesiHeroTitle}>Tambah Sesi Rapat Baru</Text>
                  <Text style={styles.addSesiHeroDesc}>
                    Otomatis aktifkan Web Form & generate QR Code presensi peserta.
                  </Text>
                </View>
              </View>
              <Icon name="arrow-forward" size={20} color="#111827" />
            </TouchableOpacity>

            {/* DAFTAR SESI RAPAT */}
            <View style={styles.sesiListHeader}>
              <Text style={styles.sectionTitleText}>DAFTAR SESI RAPAT BPS</Text>
            </View>

            {sesiList.map((sesi) => (
              <View key={sesi.id} style={styles.sesiCard}>
                <View style={styles.sesiTopRow}>
                  {/* Status Badge: AKTIF / DITUTUP */}
                  <View
                    style={[
                      styles.statusPill,
                      sesi.status === 'AKTIF'
                        ? styles.statusPillActive
                        : styles.statusPillClosed,
                    ]}
                  >
                    <Icon
                      name={sesi.status === 'AKTIF' ? 'sensors' : 'block'}
                      size={12}
                      color={sesi.status === 'AKTIF' ? '#111827' : '#FFF'}
                    />
                    <Text
                      style={[
                        styles.statusPillText,
                        sesi.status === 'AKTIF'
                          ? { color: '#111827' }
                          : { color: '#FFF' },
                      ]}
                    >
                      {sesi.status === 'AKTIF' ? 'SESI AKTIF (WEB FORM ON)' : 'SESI DITUTUP'}
                    </Text>
                  </View>

                  <Text style={styles.totalPesertaBadge}>
                    👥 {sesi.totalPeserta} Peserta
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

                {/* ACTION BUTTONS (Sesuai Diagram: Tutup Sesi & QR Code) */}
                <View style={styles.sesiActionsRow}>
                  {/* Tombol Lihat QR Code */}
                  <TouchableOpacity
                    style={styles.btnQrPresensi}
                    onPress={() => setSelectedQrSesi(sesi)}
                  >
                    <Icon name="qr-code-2" size={16} color="#111827" />
                    <Text style={styles.btnQrPresensiText}>QR CODE PRESENSI</Text>
                  </TouchableOpacity>

                  {/* Tombol Toggle Tutup / Buka Sesi */}
                  <TouchableOpacity
                    style={[
                      styles.btnToggleSesi,
                      sesi.status === 'AKTIF'
                        ? styles.btnTutupSesi
                        : styles.btnBukaSesi,
                    ]}
                    onPress={() =>
                      handleToggleSesi(sesi.id, sesi.judulRapat, sesi.status)
                    }
                  >
                    <Icon
                      name={sesi.status === 'AKTIF' ? 'power-settings-new' : 'replay'}
                      size={14}
                      color={sesi.status === 'AKTIF' ? '#EF4444' : '#10B981'}
                    />
                    <Text
                      style={[
                        styles.btnToggleSesiText,
                        {
                          color:
                            sesi.status === 'AKTIF' ? '#EF4444' : '#10B981',
                        },
                      ]}
                    >
                      {sesi.status === 'AKTIF' ? 'TUTUP SESI' : 'BUKA SESI'}
                    </Text>
                  </TouchableOpacity>

                  {/* Tombol Hapus */}
                  <TouchableOpacity
                    style={styles.btnHapusSesi}
                    onPress={() => handleHapusSesi(sesi.id, sesi.judulRapat)}
                  >
                    <Icon name="delete-outline" size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* ---------------- SECTION 2: TEMPLATE & PILIHAN CEPAT ---------------- */
          <View style={styles.contentWrap}>
            {/* Kategori Selector Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tplKategoriRow}>
                {[
                  { key: 'PEGAWAI', label: 'Staf & Pegawai BPS' },
                  { key: 'RUANGAN', label: 'Ruang Rapat' },
                  { key: 'PESAN_WA', label: 'Template Pesan WA' },
                  { key: 'SURVEI', label: 'Survei & Lapangan' },
                ].map((cat) => (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.tplCatChip,
                      selectedTplKategori === cat.key && styles.tplCatChipActive,
                    ]}
                    onPress={() =>
                      setSelectedTplKategori(cat.key as TemplatePilihanCepat['kategori'])
                    }
                  >
                    <Text
                      style={[
                        styles.tplCatChipText,
                        selectedTplKategori === cat.key && styles.tplCatChipTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Tombol Tambah Template Baru */}
            <TouchableOpacity
              style={styles.addTplBtn}
              onPress={() => setShowAddTplModal(true)}
            >
              <Icon name="add-circle-outline" size={18} color="#111827" />
              <Text style={styles.addTplBtnText}>
                + Tambah Pilihan Cepat Baru
              </Text>
            </TouchableOpacity>

            {/* List Templates Aktif */}
            <View style={styles.tplListWrap}>
              {templatesList.map((tpl) => (
                <View key={tpl.id} style={styles.tplCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tplLabel}>{tpl.label}</Text>
                    {tpl.subLabel ? (
                      <Text style={styles.tplSub}>{tpl.subLabel}</Text>
                    ) : null}
                    <View style={styles.tplValBox}>
                      <Text style={styles.tplValText}>{tpl.nilai}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.tplDeleteBtn}
                    onPress={() => pengelolaStorage.hapusTemplate(tpl.id)}
                  >
                    <Icon name="delete-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ---------------- MODAL TAMBAH SESI RAPAT (SESUAI DIAGRAM) ---------------- */}
      <Modal visible={showTambahModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardLarge}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Tambah Sesi Rapat Baru</Text>
                <Text style={styles.modalSubtitle}>
                  Isi detail rapat untuk auto-generate Web Form & QR Code
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowTambahModal(false)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>NAMA / JUDUL RAPAT *</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Contoh: Rapat Evaluasi SAKERNAS Agustus 2026"
                  placeholderTextColor="#9CA3AF"
                  value={judulRapat}
                  onChangeText={setJudulRapat}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>TANGGAL PELAKSANAAN *</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Contoh: Senin, 12 Oktober 2026"
                  placeholderTextColor="#9CA3AF"
                  value={tanggal}
                  onChangeText={setTanggal}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>WAKTU PELAKSANAAN *</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Contoh: 09:00 - 12:30 WIB"
                  placeholderTextColor="#9CA3AF"
                  value={waktu}
                  onChangeText={setWaktu}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>KET / RUANG RAPAT *</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Contoh: Ruang Rapat Utama Lt. 2"
                  placeholderTextColor="#9CA3AF"
                  value={ruang}
                  onChangeText={setRuang}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.fieldLabel}>KETERANGAN AGENDA / CATATAN</Text>
                <TextInput
                  style={[styles.fieldInput, { height: 70, textAlignVertical: 'top' }]}
                  placeholder="Tuliskan keterangan singkat agenda rapat..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  value={keterangan}
                  onChangeText={setKeterangan}
                />
              </View>

              <CustomButton
                title="SUBMIT & AKTIFKAN SESI"
                variant="primary"
                iconName="check-circle"
                size="lg"
                onPress={handleSubmitSesiBaru}
                style={{ marginTop: 14 }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ---------------- MODAL QR CODE PRESENSI RAPAT ---------------- */}
      <Modal visible={!!selectedQrSesi} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardLarge}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>QR Code Presensi Rapat</Text>
                <Text style={styles.modalSubtitle} numberOfLines={1}>
                  {selectedQrSesi?.judulRapat}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedQrSesi(null)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {selectedQrSesi && (
              <View style={styles.qrDisplayBox}>
                <Image
                  source={{ uri: selectedQrSesi.qrCodeUrl }}
                  style={styles.qrImageLarge}
                  resizeMode="contain"
                />
                <Text style={styles.qrNoticeTitle}>
                  Tampilkan Layar Ini / Cetak di Meja Presensi
                </Text>
                <Text style={styles.qrNoticeDesc}>
                  Peserta rapat memindai QR Code ini untuk otomatis mengisi form kehadiran & dokumentasi foto.
                </Text>

                <View style={styles.qrStatusTag}>
                  <Icon
                    name={selectedQrSesi.webFormActive ? 'wifi' : 'wifi-off'}
                    size={14}
                    color="#111827"
                  />
                  <Text style={styles.qrStatusTagText}>
                    STATUS: {selectedQrSesi.webFormActive ? 'ONLINE & SIAP' : 'DITUTUP'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ---------------- MODAL TAMBAH TEMPLATE CEPAT ---------------- */}
      <Modal visible={showAddTplModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardLarge}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Template Cepat</Text>
              <TouchableOpacity onPress={() => setShowAddTplModal(false)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>LABEL / NAMA *</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="Contoh: Ruang Pelatihan Lt. 3 / Nama Pegawai"
                placeholderTextColor="#9CA3AF"
                value={tplLabel}
                onChangeText={setTplLabel}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>SUB-LABEL / KETERANGAN</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="Contoh: Kapasitas 25 orang"
                placeholderTextColor="#9CA3AF"
                value={tplSubLabel}
                onChangeText={setTplSubLabel}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>NILAI / ISI TEMPLATE *</Text>
              <TextInput
                style={[styles.fieldInput, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Tuliskan teks nilai yang akan digunakan secara cepat..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={tplNilai}
                onChangeText={setTplNilai}
              />
            </View>

            <CustomButton
              title="SIMPAN KE PILIHAN CEPAT"
              variant="accent"
              iconName="save"
              onPress={handleTambahTemplate}
              style={{ marginTop: 12 }}
            />
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 3,
    borderBottomColor: '#111827',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D4FF32',
    borderWidth: 2,
    borderColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111827',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#111827',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  kpiVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  kpiLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#111827',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  navSectionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  navSectionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#111827',
    borderRadius: 12,
    paddingVertical: 11,
  },
  navSectionBtnActive: {
    backgroundColor: '#111827',
  },
  navSectionText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
  },
  navSectionTextActive: {
    color: '#D4FF32',
  },
  contentWrap: {
    gap: 12,
  },
  addSesiHero: {
    backgroundColor: '#D4FF32',
    borderWidth: 3,
    borderColor: '#111827',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  addSesiHeroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconHeroBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSesiHeroTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111827',
  },
  addSesiHeroDesc: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
    lineHeight: 15,
  },
  sesiListHeader: {
    marginTop: 4,
  },
  sectionTitleText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  sesiCard: {
    backgroundColor: '#FFF',
    borderWidth: 2.5,
    borderColor: '#111827',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#111827',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  sesiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  statusPillActive: {
    backgroundColor: '#D4FF32',
  },
  statusPillClosed: {
    backgroundColor: '#EF4444',
  },
  statusPillText: {
    fontSize: 8.5,
    fontWeight: '900',
  },
  totalPesertaBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3B38F6',
  },
  sesiJudul: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  sesiMetaBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 10,
    marginTop: 10,
    gap: 4,
  },
  sesiMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sesiMetaText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
  },
  sesiKetText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  sesiActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  btnQrPresensi: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#D4FF32',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 8,
    paddingVertical: 8,
  },
  btnQrPresensiText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111827',
  },
  btnToggleSesi: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 8,
    paddingVertical: 8,
  },
  btnTutupSesi: {
    backgroundColor: '#FEE2E2',
  },
  btnBukaSesi: {
    backgroundColor: '#ECFDF5',
  },
  btnToggleSesiText: {
    fontSize: 10,
    fontWeight: '900',
  },
  btnHapusSesi: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  tplKategoriRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tplCatChip: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tplCatChipActive: {
    backgroundColor: '#3B38F6',
  },
  tplCatChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
  },
  tplCatChipTextActive: {
    color: '#FFF',
  },
  addTplBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#D4FF32',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 10,
    paddingVertical: 10,
  },
  addTplBtnText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#111827',
  },
  tplListWrap: {
    gap: 10,
  },
  tplCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#111827',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tplLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  tplSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 1,
  },
  tplValBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 6,
    marginTop: 6,
  },
  tplValText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  tplDeleteBtn: {
    padding: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCardLarge: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#111827',
    padding: 18,
    maxHeight: '85%',
    shadowColor: '#111827',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  formGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  fieldInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  qrDisplayBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#111827',
    padding: 16,
  },
  qrImageLarge: {
    width: 220,
    height: 220,
  },
  qrNoticeTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    marginTop: 12,
  },
  qrNoticeDesc: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  qrStatusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D4FF32',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#111827',
    marginTop: 12,
  },
  qrStatusTagText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#111827',
  },
});
