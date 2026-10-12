import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { QUICK_SURVEY_TAGS } from '../../../utils/constants';
import { styles } from '../LapanganForm.styles';

interface LapanganActivityCardProps {
  namaKegiatan: string;
  onChangeNamaKegiatan: (text: string) => void;
}

export default function LapanganActivityCard({
  namaKegiatan,
  onChangeNamaKegiatan,
}: LapanganActivityCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>NAMA KEGIATAN / SURVEI *</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: SAKERNAS Agustus 2026..."
        placeholderTextColor="#9CA3AF"
        value={namaKegiatan}
        onChangeText={onChangeNamaKegiatan}
      />

      {/* Quick Autocomplete Chips */}
      <Text style={styles.subLabel}>TAG CEPAT SURVEI BPS:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tagChipsRow}>
          {QUICK_SURVEY_TAGS.map((tag) => {
            const isActive = namaKegiatan.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tagChip, isActive && styles.tagChipActive]}
                onPress={() => onChangeNamaKegiatan(tag)}
              >
                <Text style={[styles.tagChipText, isActive && styles.tagChipTextActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
