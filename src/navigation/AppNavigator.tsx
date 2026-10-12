import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import {
  LapanganCam,
  LapanganForm,
  LapanganDetail,
} from '../screens/Lapangan';
import {
  TamuScreen,
  TamuFormManual,
  TamuCam,
  TamuRekapSubmit,
  TamuDetail,
} from '../screens/Tamu';
import { PengelolaScreen } from '../screens/Pengelola';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tab Navigator Utama */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* Rute Alur Kegiatan Lapangan (Zona B & C) */}
      <Stack.Screen
        name="LapanganCam"
        component={LapanganCam}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="LapanganForm"
        component={LapanganForm}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="LapanganDetail"
        component={LapanganDetail}
        options={{ animation: 'slide_from_right' }}
      />

      {/* Rute Alur Buku Tamu (2 Cara: Manual & QRCode) */}
      <Stack.Screen
        name="TamuFormManual"
        component={TamuFormManual}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="TamuCam"
        component={TamuCam}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="TamuRekapSubmit"
        component={TamuRekapSubmit}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="TamuDetail"
        component={TamuDetail}
        options={{ animation: 'slide_from_right' }}
      />

      {/* Rute Pengelola (Akses dari Header Home) */}
      <Stack.Screen
        name="PengelolaScreen"
        component={PengelolaScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
