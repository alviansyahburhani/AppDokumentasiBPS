import { useState, useEffect, useCallback } from 'react';
import { LocationCoordinates } from '../types/lapangan';
import { BPS_CONFIG } from '../utils/constants';

export interface UseLocationReturn {
  coordinates: LocationCoordinates;
  isSearching: boolean;
  accuracyQuality: 'TINGGI' | 'SEDANG' | 'RENDAH';
  refreshLocation: () => Promise<void>;
}

export function useLocation(): UseLocationReturn {
  const [coordinates, setCoordinates] = useState<LocationCoordinates>(
    BPS_CONFIG.DEFAULT_LOCATION
  );
  const [isSearching, setIsSearching] = useState(false);

  const getAccuracyQuality = (accuracy: number): 'TINGGI' | 'SEDANG' | 'RENDAH' => {
    if (accuracy <= 10) return 'TINGGI';
    if (accuracy <= 25) return 'SEDANG';
    return 'RENDAH';
  };

  const refreshLocation = useCallback(async () => {
    setIsSearching(true);
    // Simulasi akuisisi satelit GPS akurat
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));

    // Berikan sedikit variasi realistis pada koordinat
    const randomDeltaLat = (Math.random() - 0.5) * 0.0005;
    const randomDeltaLng = (Math.random() - 0.5) * 0.0005;
    const newAccuracy = Number((3.0 + Math.random() * 3.5).toFixed(1));

    setCoordinates((prev) => ({
      ...prev,
      latitude: Number((prev.latitude + randomDeltaLat).toFixed(6)),
      longitude: Number((prev.longitude + randomDeltaLng).toFixed(6)),
      accuracy: newAccuracy,
    }));
    setIsSearching(false);
  }, []);

  useEffect(() => {
    // Initial fetch
    refreshLocation();
  }, [refreshLocation]);

  return {
    coordinates,
    isSearching,
    accuracyQuality: getAccuracyQuality(coordinates.accuracy),
    refreshLocation,
  };
}
