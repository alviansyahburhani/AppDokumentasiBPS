import { PermissionsAndroid, Platform } from 'react-native';

export interface PermissionStatusResult {
  camera: boolean;
  location: boolean;
}

export async function requestAppPermissions(): Promise<PermissionStatusResult> {
  if (Platform.OS !== 'android') {
    return { camera: true, location: true };
  }

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    const cameraGranted =
      granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
      PermissionsAndroid.RESULTS.GRANTED;

    const locationGranted =
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED ||
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;

    return {
      camera: cameraGranted,
      location: locationGranted,
    };
  } catch (err) {
    console.warn('Permission request error:', err);
    return { camera: true, location: true };
  }
}
