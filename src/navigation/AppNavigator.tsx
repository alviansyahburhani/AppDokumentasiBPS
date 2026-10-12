import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import {
  LapanganCam,
  LapanganForm,
  LapanganDetail,
} from '../screens/Lapangan';
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
    </Stack.Navigator>
  );
}
