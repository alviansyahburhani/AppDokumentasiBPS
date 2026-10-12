import { offlineStorage } from './storage';
import { LapanganRecord } from '../types/lapangan';

export const queueService = {
  getQueue: () => offlineStorage.getPendingQueue(),
  getAllRecords: () => offlineStorage.getAllRecords(),
  getRecordById: (id: string) => offlineStorage.getRecordById(id),
  saveRecord: (record: LapanganRecord) => offlineStorage.saveRecord(record),
  deleteRecord: (id: string) => offlineStorage.deleteRecord(id),
  getCounts: () => offlineStorage.getCounts(),
  subscribe: (listener: () => void) => offlineStorage.subscribe(listener),
};
