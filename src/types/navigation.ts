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
  TamuFormManual: undefined;
  TamuCam: {
    formData: import('./tamu').TamuFormData;
    existingPhotos?: import('./tamu').TamuPhotoItem[];
  };
  TamuRekapSubmit: {
    formData: import('./tamu').TamuFormData;
    photos: import('./tamu').TamuPhotoItem[];
  };
  TamuDetail: {
    recordId: string;
  };
  PengelolaScreen: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  LapanganTab: undefined;
  KameraTab: undefined;
  TamuTab: undefined;
  RapatTab: undefined;
};
