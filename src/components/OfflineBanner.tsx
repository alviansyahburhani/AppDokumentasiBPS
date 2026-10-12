import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// ─── Banner 1: Status Koneksi Internet ───────────────────────────────────────

interface OfflineStatusBannerProps {
  isOffline: boolean;
}

/**
 * Menampilkan status koneksi internet (Online/Offline).
 * Hanya tampil saat OFFLINE untuk menghemat ruang layar.
 */
export function OfflineStatusBanner({ isOffline }: OfflineStatusBannerProps) {
  const slideAnim = useRef(new Animated.Value(isOffline ? 0 : -60)).current;
  const opacityAnim = useRef(new Animated.Value(isOffline ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: isOffline ? 0 : -60,
        useNativeDriver: true,
        friction: 8,
        tension: 120,
      }),
      Animated.timing(opacityAnim, {
        toValue: isOffline ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOffline]);

  if (!isOffline) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.offlineContainer,
        { transform: [{ translateY: slideAnim }], opacity: opacityAnim },
      ]}
    >
      <View style={styles.offlineIconWrap}>
        <Icon name="wifi-off" size={16} color="#FFF" />
      </View>
      <View style={styles.offlineTextWrap}>
        <Text style={styles.offlineTitle}>TIDAK ADA KONEKSI</Text>
        <Text style={styles.offlineDesc}>
          Perangkat sedang offline. Data akan disimpan lokal.
        </Text>
      </View>
      <View style={styles.offlineDot} />
    </Animated.View>
  );
}

// ─── Banner 2: Status Data Lokal (Pending Sync) ──────────────────────────────

interface LocalSyncBannerProps {
  pendingCount: number;
  isSyncing?: boolean;
  onSyncPress?: () => void;
}

/**
 * Menampilkan jumlah data yang tersimpan lokal dan belum diunggah ke server.
 * Hanya tampil jika ada data pending (pendingCount > 0).
 */
export function LocalSyncBanner({
  pendingCount,
  isSyncing = false,
  onSyncPress,
}: LocalSyncBannerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(
    new Animated.Value(pendingCount > 0 ? 0 : -56)
  ).current;

  // Pulse animation saat syncing
  useEffect(() => {
    if (isSyncing) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSyncing]);

  // Slide in/out berdasarkan pendingCount
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: pendingCount > 0 ? 0 : -56,
      useNativeDriver: true,
      friction: 8,
      tension: 120,
    }).start();
  }, [pendingCount]);

  if (pendingCount === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.syncContainer,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Animated.View style={[styles.syncIconWrap, { opacity: pulseAnim }]}>
        <Icon
          name={isSyncing ? 'cloud-sync' : 'cloud-queue'}
          size={16}
          color="#111827"
        />
      </Animated.View>

      <View style={styles.syncTextWrap}>
        <Text style={styles.syncTitle}>
          {isSyncing
            ? 'MENGUNGGAH DATA...'
            : `${pendingCount} DATA TERSIMPAN LOKAL`}
        </Text>
        <Text style={styles.syncDesc}>
          {isSyncing
            ? 'Sedang mengunggah ke server. Harap tunggu.'
            : 'Belum terunggah. Akan dikirim saat online.'}
        </Text>
      </View>

      {!isSyncing && onSyncPress && (
        <TouchableOpacity
          style={styles.syncBtn}
          onPress={onSyncPress}
          activeOpacity={0.8}
        >
          <Icon name="upload" size={14} color="#111827" />
          <Text style={styles.syncBtnText}>KIRIM</Text>
        </TouchableOpacity>
      )}

      {isSyncing && (
        <View style={styles.syncingIndicator}>
          <Animated.View
            style={[styles.syncingDot, { opacity: pulseAnim }]}
          />
        </View>
      )}
    </Animated.View>
  );
}

// ─── Default Export: Banner Lama (Backward Compat) ───────────────────────────
// Tetap tersedia agar screen yang belum diupdate tidak error.

interface OfflineBannerProps {
  isOffline: boolean;
  pendingCount?: number;
  isSyncing?: boolean;
  onSyncPress?: () => void;
}

/**
 * @deprecated Gunakan OfflineStatusBanner dan LocalSyncBanner secara terpisah.
 */
export default function OfflineBanner({
  isOffline,
  pendingCount = 0,
  isSyncing = false,
  onSyncPress,
}: OfflineBannerProps) {
  return (
    <View>
      <OfflineStatusBanner isOffline={isOffline} />
      {pendingCount > 0 && (
        <LocalSyncBanner
          pendingCount={pendingCount}
          isSyncing={isSyncing}
          onSyncPress={onSyncPress}
        />
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Offline Status Banner ──
  offlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: '#DC2626', // Merah tegas
    borderBottomWidth: 2.5,
    borderBottomColor: '#111827',
    gap: 10,
    overflow: 'hidden',
  },
  offlineIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineTextWrap: {
    flex: 1,
  },
  offlineTitle: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  offlineDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  offlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FCA5A5', // Merah muda sebagai indikator
  },

  // ── Local Sync Banner ──
  syncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: '#FF7A00', // Orange seperti warna pending
    borderBottomWidth: 2.5,
    borderBottomColor: '#111827',
    gap: 10,
    overflow: 'hidden',
  },
  syncIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncTextWrap: {
    flex: 1,
  },
  syncTitle: {
    color: '#111827',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  syncDesc: {
    color: 'rgba(17,24,39,0.7)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  syncBtnText: {
    color: '#111827',
    fontSize: 10,
    fontWeight: '900',
  },
  syncingIndicator: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111827',
  },
});
