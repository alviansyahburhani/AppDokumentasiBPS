import { useState, useEffect, useCallback } from 'react';
import { offlineStorage } from '../database/storage';
import { syncManager } from '../services/syncManager';

export function useNetworkSync() {
  const [isOnline, setIsOnline] = useState<boolean>(
    offlineStorage.getNetworkStatus()
  );
  const [counts, setCounts] = useState(offlineStorage.getCounts());
  const [isSyncing, setIsSyncing] = useState<boolean>(
    syncManager.getIsSyncing()
  );

  useEffect(() => {
    // Subscribe to storage changes (records, queue, network toggle)
    const unsubStorage = offlineStorage.subscribe(() => {
      setIsOnline(offlineStorage.getNetworkStatus());
      setCounts(offlineStorage.getCounts());
    });

    // Subscribe to syncManager state
    const unsubSync = syncManager.subscribe((syncing) => {
      setIsSyncing(syncing);
      setCounts(offlineStorage.getCounts());
    });

    return () => {
      unsubStorage();
      unsubSync();
    };
  }, []);

  const toggleNetwork = useCallback(() => {
    const newState = offlineStorage.toggleNetworkStatus();
    // Auto-sync jika online
    if (newState) {
      syncManager.syncPendingQueue();
    }
  }, []);

  const triggerSync = useCallback(async () => {
    return await syncManager.syncPendingQueue();
  }, []);

  return {
    isOnline,
    pendingCount: counts.pending,
    syncedCount: counts.synced,
    totalCount: counts.total,
    isSyncing,
    toggleNetwork,
    triggerSync,
  };
}
