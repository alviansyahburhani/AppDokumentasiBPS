import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface FilterOptionItem<T extends string> {
  key: T;
  label: string;
  icon: string;
  desc: string;
  action?: () => void;
}

export interface CalendarFilterModalProps<T extends string> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  activeFilter: T;
  options: FilterOptionItem<T>[];
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  calendarMonth: number;
  calendarYear: number;
  onChangeMonth: (month: number) => void;
  onChangeYear: (year: number) => void;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function CalendarFilterModal<T extends string>({
  visible,
  onClose,
  title = 'Filter',
  activeFilter,
  options,
  selectedDate,
  onSelectDate,
  calendarMonth,
  calendarYear,
  onChangeMonth,
  onChangeYear,
}: CalendarFilterModalProps<T>) {
  const [filterMode, setFilterMode] = useState<'LIST' | 'DATE_PICKER' | 'MONTH_PICKER'>('LIST');

  const handleClose = () => {
    onClose();
    setFilterMode('LIST');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={handleClose}
      >
        <View
          style={styles.filterModalCard}
          onStartShouldSetResponder={() => true}
        >
          {/* Header Modal */}
          <View style={styles.filterModalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {filterMode !== 'LIST' ? (
                <TouchableOpacity
                  onPress={() => setFilterMode('LIST')}
                  style={styles.filterBackBtn}
                >
                  <Icon name="arrow-back" size={18} color="#111827" />
                </TouchableOpacity>
              ) : (
                <Icon name="filter-list" size={20} color="#111827" />
              )}
              <Text style={styles.filterModalTitle}>
                {filterMode === 'DATE_PICKER'
                  ? 'Pilih Tanggal'
                  : filterMode === 'MONTH_PICKER'
                  ? 'Pilih Bulan'
                  : title}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <Icon name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* ── MODE 1: LIST OPSI UTAMA ── */}
          {filterMode === 'LIST' && (
            <View style={{ gap: 8 }}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.filterOption,
                    activeFilter === opt.key && styles.filterOptionActive,
                  ]}
                  onPress={() => {
                    if (opt.key === 'TANGGAL') {
                      setFilterMode('DATE_PICKER');
                    } else if (opt.action) {
                      opt.action();
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.filterOptionIcon,
                      activeFilter === opt.key && { backgroundColor: '#D4FF32' },
                    ]}
                  >
                    <Icon name={opt.icon} size={20} color="#111827" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.filterOptionLabel,
                        activeFilter === opt.key && { color: '#FFF' },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text
                      style={[
                        styles.filterOptionDesc,
                        activeFilter === opt.key && {
                          color: 'rgba(255,255,255,0.7)',
                        },
                      ]}
                    >
                      {opt.desc}
                    </Text>
                  </View>
                  {activeFilter === opt.key ? (
                    <Icon name="check-circle" size={20} color="#D4FF32" />
                  ) : (
                    opt.key === 'TANGGAL' && (
                      <Icon name="chevron-right" size={20} color="#9CA3AF" />
                    )
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── MODE 2: DATE PICKER (KALENDER LENGKAP) ── */}
          {filterMode === 'DATE_PICKER' && (
            <View style={styles.calendarContainer}>
              {/* Navigasi Bulan & Tahun */}
              <View style={styles.calendarNavRow}>
                <TouchableOpacity
                  style={styles.calNavBtn}
                  onPress={() => {
                    if (calendarMonth === 0) {
                      onChangeMonth(11);
                      onChangeYear(calendarYear - 1);
                    } else {
                      onChangeMonth(calendarMonth - 1);
                    }
                  }}
                >
                  <Icon name="chevron-left" size={22} color="#111827" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFilterMode('MONTH_PICKER')}
                  style={styles.calMonthYearBadge}
                >
                  <Text style={styles.calMonthYearText}>
                    {MONTH_NAMES[calendarMonth]} {calendarYear}
                  </Text>
                  <Icon name="arrow-drop-down" size={18} color="#111827" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.calNavBtn}
                  onPress={() => {
                    if (calendarMonth === 11) {
                      onChangeMonth(0);
                      onChangeYear(calendarYear + 1);
                    } else {
                      onChangeMonth(calendarMonth + 1);
                    }
                  }}
                >
                  <Icon name="chevron-right" size={22} color="#111827" />
                </TouchableOpacity>
              </View>

              {/* Nama Hari */}
              <View style={styles.calDaysHeader}>
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
                  <Text
                    key={d}
                    style={[
                      styles.calDayHeaderText,
                      i === 0 && { color: '#EF4444' },
                    ]}
                  >
                    {d}
                  </Text>
                ))}
              </View>

              {/* Grid Tanggal */}
              <View style={styles.calGrid}>
                {(() => {
                  const firstDayIndex = new Date(
                    calendarYear,
                    calendarMonth,
                    1
                  ).getDay();
                  const daysInMonth = new Date(
                    calendarYear,
                    calendarMonth + 1,
                    0
                  ).getDate();
                  const slots = [];

                  for (let i = 0; i < firstDayIndex; i++) {
                    slots.push(
                      <View key={`empty-${i}`} style={styles.calDayCell} />
                    );
                  }

                  const today = new Date();
                  const isCurrentMonth =
                    today.getFullYear() === calendarYear &&
                    today.getMonth() === calendarMonth;
                  const todayDate = today.getDate();

                  for (let day = 1; day <= daysInMonth; day++) {
                    const dateStr = `${calendarYear}-${String(
                      calendarMonth + 1
                    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isSelected = selectedDate === dateStr;
                    const isToday = isCurrentMonth && day === todayDate;

                    slots.push(
                      <TouchableOpacity
                        key={dateStr}
                        style={[
                          styles.calDayCell,
                          isSelected && styles.calDayCellSelected,
                          isToday && !isSelected && styles.calDayCellToday,
                        ]}
                        onPress={() => {
                          onSelectDate(dateStr);
                          handleClose();
                        }}
                      >
                        <Text
                          style={[
                            styles.calDayText,
                            isSelected && styles.calDayTextSelected,
                            isToday && !isSelected && styles.calDayTextToday,
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

              {/* Shortcut Hari ini */}
              <View style={styles.calFooterActions}>
                <TouchableOpacity
                  style={styles.calTodayBtn}
                  onPress={() => {
                    const now = new Date();
                    onChangeMonth(now.getMonth());
                    onChangeYear(now.getFullYear());
                    const todayStr = `${now.getFullYear()}-${String(
                      now.getMonth() + 1
                    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                    onSelectDate(todayStr);
                    handleClose();
                  }}
                >
                  <Icon name="today" size={14} color="#111827" />
                  <Text style={styles.calTodayBtnText}>PILIH HARI INI</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── MODE 3: MONTH PICKER ── */}
          {filterMode === 'MONTH_PICKER' && (
            <View style={styles.monthPickerContainer}>
              <View style={styles.calendarNavRow}>
                <TouchableOpacity
                  style={styles.calNavBtn}
                  onPress={() => onChangeYear(calendarYear - 1)}
                >
                  <Icon name="chevron-left" size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.calYearTitle}>{calendarYear}</Text>
                <TouchableOpacity
                  style={styles.calNavBtn}
                  onPress={() => onChangeYear(calendarYear + 1)}
                >
                  <Icon name="chevron-right" size={22} color="#111827" />
                </TouchableOpacity>
              </View>

              <View style={styles.monthsGrid}>
                {MONTH_NAMES.map((name, idx) => {
                  const isSelected = calendarMonth === idx;
                  return (
                    <TouchableOpacity
                      key={name}
                      style={[
                        styles.monthCell,
                        isSelected && styles.monthCellSelected,
                      ]}
                      onPress={() => {
                        onChangeMonth(idx);
                        setFilterMode('DATE_PICKER');
                      }}
                    >
                      <Text
                        style={[
                          styles.monthCellText,
                          isSelected && styles.monthCellTextSelected,
                        ]}
                      >
                        {name.substring(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  filterModalCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#111827',
    padding: 18,
    gap: 8,
    shadowColor: '#111827',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  filterModalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  filterBackBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#111827',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  filterOptionActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  filterOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterOptionLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
  },
  filterOptionDesc: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 1,
  },
  calendarContainer: {
    paddingVertical: 4,
  },
  calendarNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 6,
  },
  calNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#111827',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calMonthYearBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#111827',
    backgroundColor: '#D4FF32',
  },
  calMonthYearText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  calYearTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  calDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 6,
  },
  calDayHeaderText: {
    width: 38,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calDayCell: {
    width: '14.28%',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  calDayCellSelected: {
    backgroundColor: '#111827',
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  calDayCellToday: {
    backgroundColor: '#D4FF32',
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  calDayText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  calDayTextSelected: {
    color: '#FFF',
    fontWeight: '900',
  },
  calDayTextToday: {
    color: '#111827',
    fontWeight: '900',
  },
  calFooterActions: {
    marginTop: 12,
  },
  calTodayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#111827',
    backgroundColor: '#F3F4F6',
  },
  calTodayBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
  },
  monthPickerContainer: {
    paddingVertical: 6,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    justifyContent: 'space-between',
  },
  monthCell: {
    width: '30%',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCellSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  monthCellText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
  },
  monthCellTextSelected: {
    color: '#D4FF32',
  },
});
