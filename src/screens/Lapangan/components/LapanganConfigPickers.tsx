import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SubSeksiBps, TahapanKegiatan } from '../../../types/lapangan';
import { SUB_SEKSI_OPTIONS, TAHAPAN_OPTIONS } from '../../../utils/constants';
import { styles } from '../LapanganForm.styles';

interface LapanganConfigPickersProps {
  subSeksi: SubSeksiBps;
  onChangeSubSeksi: (val: SubSeksiBps) => void;
  tahapan: TahapanKegiatan;
  onChangeTahapan: (val: TahapanKegiatan) => void;
  progres: number;
  onChangeProgres: (val: number) => void;
  catatan: string;
  onChangeCatatan: (val: string) => void;
}

const PROGRES_STEPS = [25, 50, 75, 100];

export default function LapanganConfigPickers({
  subSeksi,
  onChangeSubSeksi,
  tahapan,
  onChangeTahapan,
  progres,
  onChangeProgres,
  catatan,
  onChangeCatatan,
}: LapanganConfigPickersProps) {
  return (
    <>
      {/* Sub-Seksi BPS Selection */}
      <View style={styles.card}>
        <Text style={styles.label}>SUB-SEKSI / FUNGSI BPS</Text>
        <View style={styles.optionsWrap}>
          {SUB_SEKSI_OPTIONS.map((item) => {
            const isSelected = subSeksi === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.optionPill, isSelected && styles.optionPillActive]}
                onPress={() => onChangeSubSeksi(item)}
              >
                <Text
                  style={[
                    styles.optionPillText,
                    isSelected && styles.optionPillTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Tahapan Kegiatan */}
      <View style={styles.card}>
        <Text style={styles.label}>TAHAPAN KEGIATAN</Text>
        <View style={styles.optionsWrap}>
          {TAHAPAN_OPTIONS.map((t) => {
            const isSelected = tahapan === t;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.optionPill, isSelected && styles.optionPillSecondary]}
                onPress={() => onChangeTahapan(t)}
              >
                <Text
                  style={[
                    styles.optionPillText,
                    isSelected && styles.optionPillTextLight,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Progres Slider/Buttons (0% - 100%) */}
      <View style={styles.card}>
        <View style={styles.progresHeader}>
          <Text style={styles.label}>PROGRES PELAKSANAAN</Text>
          <View style={styles.progresPill}>
            <Text style={styles.progresPillText}>{progres}% SELESAI</Text>
          </View>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progres}%` }]} />
        </View>
        <View style={styles.progresBtnRow}>
          {PROGRES_STEPS.map((val) => {
            const isSelected = progres === val;
            return (
              <TouchableOpacity
                key={val}
                style={[styles.progresValBtn, isSelected && styles.progresValBtnActive]}
                onPress={() => onChangeProgres(val)}
              >
                <Text
                  style={[
                    styles.progresValText,
                    isSelected && styles.progresValTextActive,
                  ]}
                >
                  {val}%
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Catatan Lapangan */}
      <View style={styles.card}>
        <Text style={styles.label}>CATATAN & KENDALA LAPANGAN (OPSIONAL)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tuliskan catatan blok sensus, responden, atau kendala lapangan..."
          placeholderTextColor="#9CA3AF"
          value={catatan}
          onChangeText={onChangeCatatan}
          multiline
          numberOfLines={4}
        />
      </View>
    </>
  );
}
