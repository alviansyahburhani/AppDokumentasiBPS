import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/Home/HomeScreen';
import { LapanganScreen } from '../screens/Lapangan';
import { TamuScreen } from '../screens/Tamu';
import { RapatScreen } from '../screens/Rapat';

// Layar kosong sementara untuk tab yang belum diimplementasikan
const DummyScreen = () => <View style={{ flex: 1, backgroundColor: '#F3F4F6' }} />;

// Komponen Ikon Dinamis (Animasi Skala)
const AnimatedTabIcon = ({ name, focused, color }: any) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: focused ? 1.35 : 1, // Skala membesar menjadi 1.35x
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Icon name={name} size={24} color={color} />
    </Animated.View>
  );
};

const Tab = createBottomTabNavigator();

// Komponen Custom untuk Tombol Tengah (Kamera) dengan efek cincin (halo)
const CustomTabBarButton = ({ onPress }: any) => (
  <TouchableOpacity
    style={styles.customBtnContainer}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <View style={styles.haloRing}>
      <View style={styles.customBtn}>
        <Icon name="photo-camera" size={32} color="#FFF" />
      </View>
    </View>
  </TouchableOpacity>
);

export default function TabNavigator() {
  const navigation = useNavigation<any>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true, // Menampilkan teks di bawah ikon
        tabBarActiveTintColor: '#3B38F6', // Electric Blue untuk tab yang aktif
        tabBarInactiveTintColor: '#9CA3AF', // Abu-abu untuk yang tidak aktif
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '900',
          marginBottom: 6,
        },
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* 1. Home */}
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name="home" focused={focused} color={color} />
          ),
        }}
      />

      {/* 2. Lapangan (Zona B: Sisi Pegawai Lapangan BPS) */}
      <Tab.Screen
        name="LapanganTab"
        component={LapanganScreen}
        options={{
          tabBarLabel: 'Lapangan',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name="pin-drop" focused={focused} color={color} />
          ),
        }}
      />

      {/* 3. Tombol Tengah (Kamera Lapangan Langsung) */}
      <Tab.Screen
        name="KameraTab"
        component={DummyScreen}
        listeners={{
          tabPress: (e) => {
            // Prevent default behavior dan buka Kamera Lapangan langsung
            e.preventDefault();
            navigation.navigate('LapanganCam');
          },
        }}
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          ),
        }}
      />

      {/* 4. Resepsionis (Buku Tamu) */}
      <Tab.Screen
        name="TamuTab"
        component={TamuScreen}
        options={{
          tabBarLabel: 'Tamu',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name="badge" focused={focused} color={color} />
          ),
        }}
      />

      {/* 5. Rapat (Zona B: Sisi Pegawai & Resepsionis - Buat/Tutup Sesi Rapat) */}
      <Tab.Screen
        name="RapatTab"
        component={RapatScreen}
        options={{
          tabBarLabel: 'Rapat',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name="groups" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute', // Tetap absolute agar padding dari scrollview tidak terganggu
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    height: 64,
    borderTopWidth: 3,
    borderTopColor: '#111827', // Garis atas tegas khas brutalism
    elevation: 0,
  },
  customBtnContainer: {
    top: -28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  haloRing: {
    // Membuat lingkaran pelindung (warna abu-abu background layar) agar seolah memotong navbar
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customBtn: {
    // Tombol intinya
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B38F6', // Mengikuti warna biru seperti di referensi Anda
    borderWidth: 3,
    borderColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    // Bayangan tegas
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  }
});
