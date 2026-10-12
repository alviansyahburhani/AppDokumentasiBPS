import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { styles } from '../LapanganCam.styles';

interface CameraViewfinderOverlayProps {
  flashAnim: Animated.Value;
}

export default function CameraViewfinderOverlay({ flashAnim }: CameraViewfinderOverlayProps) {
  return (
    <>
      {/* Viewfinder Grid Guide Lines */}
      <View style={styles.gridOverlay}>
        <View style={styles.gridLineHorizontal1} />
        <View style={styles.gridLineHorizontal2} />
        <View style={styles.gridLineVertical1} />
        <View style={styles.gridLineVertical2} />
      </View>

      {/* Focus Target in Center */}
      <View style={styles.focusReticle}>
        <View style={styles.focusCornerTopLeft} />
        <View style={styles.focusCornerTopRight} />
        <View style={styles.focusCornerBottomLeft} />
        <View style={styles.focusCornerBottomRight} />
      </View>

      {/* Shutter White Flash Effect */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          styles.flashOverlay,
          { opacity: flashAnim },
        ]}
      />
    </>
  );
}
