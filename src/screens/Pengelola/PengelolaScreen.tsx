import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { TemplatePilihanCepat } from '../../types/pengelola';
import { pengelolaStorage } from '../../database/pengelolaStorage';
import { styles } from './PengelolaScreen.styles';
import PengelolaKpiRow from './components/PengelolaKpiRow';
import PengelolaCategoryChips from './components/PengelolaCategoryChips';
import TemplateCard from './components/TemplateCard';
import TemplateModal from './components/TemplateModal';

export default function PengelolaScreen() {
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState(pengelolaStorage.getStats());

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
    setTemplatesList(pengelolaStorage.getTemplatesByKategori(selectedTplKategori));
    setStats(pengelolaStorage.getStats());
  };

  useEffect(() => {
    loadData();
    const unsub = pengelolaStorage.subscribe(loadData);
    return () => unsub();
  }, [selectedTplKategori]);

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

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'HomeTab' });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={handleGoBack}>
            <Icon name="arrow-back" size={20} color="#111827" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Pusat Pengelola BPS</Text>
            <Text style={styles.headerSub}>Template & Pilihan Cepat Instansi</Text>
          </View>
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
        {/* KPI STATS BAR KHUSUS TEMPLATE */}
        <PengelolaKpiRow
          totalTemplate={stats.totalTemplate}
          currentCategoryCount={templatesList.length}
        />

        {/* Short Banner to Rapat */}
        <TouchableOpacity
          style={styles.rapatBannerNotice}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('MainTabs', { screen: 'RapatTab' })}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <View style={styles.rapatBannerIcon}>
              <Icon name="groups" size={20} color="#111827" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rapatBannerTitle}>Kelola Agenda Sesi Rapat?</Text>
              <Text style={styles.rapatBannerSub}>
                Akses tab "Rapat" di menu navigasi bawah untuk buat/tutup sesi & QR code.
              </Text>
            </View>
          </View>
          <Icon name="arrow-forward" size={18} color="#111827" />
        </TouchableOpacity>

        {/* SECTION: TEMPLATE & PILIHAN CEPAT */}
        <View style={styles.contentWrap}>
          {/* Kategori Selector Chips */}
          <PengelolaCategoryChips
            selectedCategory={selectedTplKategori}
            onSelectCategory={setSelectedTplKategori}
          />

          {/* Tombol Tambah Template Baru */}
          <TouchableOpacity
            style={styles.addTplBtn}
            onPress={() => setShowAddTplModal(true)}
          >
            <Icon name="add-circle-outline" size={18} color="#111827" />
            <Text style={styles.addTplBtnText}>+ Tambah Pilihan Cepat Baru</Text>
          </TouchableOpacity>

          {/* List Templates Aktif */}
          <View style={styles.tplListWrap}>
            {templatesList.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                onDelete={(id) => pengelolaStorage.hapusTemplate(id)}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* MODAL TAMBAH TEMPLATE CEPAT */}
      <TemplateModal
        visible={showAddTplModal}
        onClose={() => setShowAddTplModal(false)}
        tplLabel={tplLabel}
        onChangeTplLabel={setTplLabel}
        tplSubLabel={tplSubLabel}
        onChangeTplSubLabel={setTplSubLabel}
        tplNilai={tplNilai}
        onChangeTplNilai={setTplNilai}
        onSubmit={handleTambahTemplate}
      />
    </SafeAreaView>
  );
}
