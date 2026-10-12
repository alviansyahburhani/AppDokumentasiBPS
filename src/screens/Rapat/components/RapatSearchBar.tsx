import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../RapatScreen.styles';

interface RapatSearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  isFilterActive: boolean;
  filterLabel: string;
  onFilterPress: () => void;
  onResetFilter: () => void;
}

export default function RapatSearchBar({
  searchQuery,
  onSearchChange,
  isFilterActive,
  filterLabel,
  onFilterPress,
  onResetFilter,
}: RapatSearchBarProps) {
  return (
    <>
      <View style={styles.searchFilterRow}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#111827" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari agenda rapat, ruangan, atau tanggal..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => onSearchChange('')}>
              <Icon name="close" size={18} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          style={[styles.filterBtn, isFilterActive && styles.filterBtnActive]}
          onPress={onFilterPress}
          activeOpacity={0.8}
        >
          <Icon
            name="filter-list"
            size={20}
            color={isFilterActive ? '#FFF' : '#111827'}
          />
          {isFilterActive && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      {/* Active Filter Pill */}
      {isFilterActive && (
        <View style={styles.activeFilterRow}>
          <View style={styles.activeFilterPill}>
            <Icon name="filter-list" size={12} color="#111827" />
            <Text style={styles.activeFilterText}>Filter: {filterLabel}</Text>
            <TouchableOpacity onPress={onResetFilter}>
              <Icon name="close" size={14} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}
