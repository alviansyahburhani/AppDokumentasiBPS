import { LapanganPhoto, LapanganRecord } from './lapangan';

export type RootStackParamList = {
  MainTabs: undefined;
  LapanganCam: {
    existingPhotos?: LapanganPhoto[];
    returnScreen?: 'LapanganForm';
  } | undefined;
  LapanganForm: {
    initialPhotos?: LapanganPhoto[];
    editRecordId?: string;
  } | undefined;
  LapanganDetail: {
    recordId: string;
  };
};

export type BottomTabParamList = {
  HomeTab: undefined;
  LapanganTab: undefined;
  KameraTab: undefined;
  TamuTab: undefined;
  RapatTab: undefined;
};
