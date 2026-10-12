import React from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../../components/CustomButton';
import { styles } from '../PengelolaScreen.styles';

interface TemplateModalProps {
  visible: boolean;
  onClose: () => void;
  tplLabel: string;
  onChangeTplLabel: (text: string) => void;
  tplSubLabel: string;
  onChangeTplSubLabel: (text: string) => void;
  tplNilai: string;
  onChangeTplNilai: (text: string) => void;
  onSubmit: () => void;
}

export default function TemplateModal({
  visible,
  onClose,
  tplLabel,
  onChangeTplLabel,
  tplSubLabel,
  onChangeTplSubLabel,
  tplNilai,
  onChangeTplNilai,
  onSubmit,
}: TemplateModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCardLarge}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tambah Template Cepat</Text>
            <TouchableOpacity onPress={onClose}>
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
              onChangeText={onChangeTplLabel}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>SUB-LABEL / KETERANGAN</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="Contoh: Kapasitas 25 orang"
              placeholderTextColor="#9CA3AF"
              value={tplSubLabel}
              onChangeText={onChangeTplSubLabel}
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
              onChangeText={onChangeTplNilai}
            />
          </View>

          <CustomButton
            title="SIMPAN KE PILIHAN CEPAT"
            variant="accent"
            iconName="save"
            onPress={onSubmit}
            style={{ marginTop: 12 }}
          />
        </View>
      </View>
    </Modal>
  );
}
