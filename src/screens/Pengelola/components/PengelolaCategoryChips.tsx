import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { TemplatePilihanCepat } from '../../../types/pengelola';
import { styles } from '../PengelolaScreen.styles';

const CATEGORIES: { key: TemplatePilihanCepat['kategori']; label: string }[] = [
  { key: 'PEGAWAI', label: 'Staf & Pegawai BPS' },
  { key: 'RUANGAN', label: 'Ruang Rapat' },
  { key: 'PESAN_WA', label: 'Template Pesan WA' },
  { key: 'SURVEI', label: 'Survei & Lapangan' },
];

interface PengelolaCategoryChipsProps {
  selectedCategory: TemplatePilihanCepat['kategori'];
  onSelectCategory: (kategori: TemplatePilihanCepat['kategori']) => void;
}

export default function PengelolaCategoryChips({
  selectedCategory,
  onSelectCategory,
}: PengelolaCategoryChipsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.tplKategoriRow}>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.tplCatChip, isActive && styles.tplCatChipActive]}
              onPress={() => onSelectCategory(cat.key)}
            >
              <Text
                style={[
                  styles.tplCatChipText,
                  isActive && styles.tplCatChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
