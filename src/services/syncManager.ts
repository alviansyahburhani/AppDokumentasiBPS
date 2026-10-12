import { offlineStorage } from '../database/storage';
import { lapanganApi } from './api';

class SyncManager {
  private isSyncing: boolean = false;
  private listeners: Set<(isSyncing: boolean) => void> = new Set();

  public subscribe(listener: (isSyncing: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isSyncing));
  }

  public getIsSyncing(): boolean {
    return this.isSyncing;
  }

  /**
   * Eksekusi sinkronisasi antrean ke Google Drive / Sheets
   */
  public async syncPendingQueue(): Promise<{
    processed: number;
    successCount: number;
    failedCount: number;
  }> {
    if (this.isSyncing) {
      return { processed: 0, successCount: 0, failedCount: 0 };
    }

    const isOnline = offlineStorage.getNetworkStatus();
    if (!isOnline) {
      return { processed: 0, successCount: 0, failedCount: 0 };
    }

    const pendingQueue = offlineStorage.getPendingQueue();
    if (pendingQueue.length === 0) {
      return { processed: 0, successCount: 0, failedCount: 0 };
    }

    this.isSyncing = true;
    this.notify();

    let successCount = 0;
    let failedCount = 0;

    try {
      for (const record of pendingQueue) {
        try {
          const result = await lapanganApi.uploadLapanganRecord(record);
          if (result.success) {
            offlineStorage.updateRecordStatus(
              record.id,
              'SYNCED',
              new Date().toISOString()
            );
            successCount++;
          } else {
            offlineStorage.updateRecordStatus(
              record.id,
              'FAILED',
              undefined,
              result.message
            );
            failedCount++;
          }
        } catch (err: any) {
          offlineStorage.updateRecordStatus(
            record.id,
            'FAILED',
            undefined,
            err?.message || 'Gagal terhubung ke server'
          );
          failedCount++;
        }
      }
    } finally {
      this.isSyncing = false;
      this.notify();
    }

    return {
      processed: pendingQueue.length,
      successCount,
      failedCount,
    };
  }
}

export const syncManager = new SyncManager();
