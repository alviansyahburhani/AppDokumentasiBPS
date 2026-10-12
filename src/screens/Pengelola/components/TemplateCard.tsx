import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TemplatePilihanCepat } from '../../../types/pengelola';
import { styles } from '../PengelolaScreen.styles';

interface TemplateCardProps {
  template: TemplatePilihanCepat;
  onDelete: (id: string) => void;
}

export default function TemplateCard({ template, onDelete }: TemplateCardProps) {
  return (
    <View style={styles.tplCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.tplLabel}>{template.label}</Text>
        {template.subLabel ? (
          <Text style={styles.tplSub}>{template.subLabel}</Text>
        ) : null}
        <View style={styles.tplValBox}>
          <Text style={styles.tplValText}>{template.nilai}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.tplDeleteBtn}
        onPress={() => onDelete(template.id)}
      >
        <Icon name="delete-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
}
