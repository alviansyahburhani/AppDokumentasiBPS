import { LapanganPhoto, LocationCoordinates } from '../types/lapangan';
import { formatIndonesianDate, formatWatermarkTime } from './dateUtils';

// Mock generator for photo URI with varied field sample images for instant, reliable rendering
const SAMPLE_FIELD_IMAGES = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80', // Field inspection / agriculture
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80', // Community survey
  'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80', // Rural survey
  'https://images.unsplash.com/photo-1524813686514-a57563d77d66?w=800&auto=format&fit=crop&q=80', // Urban business listing
];

let sampleIndex = 0;

export function generateMockFieldPhoto(
  coordinates: LocationCoordinates,
  activityName: string = 'Kegiatan Lapangan BPS'
): LapanganPhoto {
  const now = new Date();
  const uri = SAMPLE_FIELD_IMAGES[sampleIndex % SAMPLE_FIELD_IMAGES.length];
  sampleIndex++;

  const id = `photo_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const dateStr = formatIndonesianDate(now);
  const timeStr = formatWatermarkTime(now);

  const watermarkText = `[BPS KOTA MALANG] ${activityName}\nGPS: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)} (±${coordinates.accuracy.toFixed(1)}m)\n${dateStr} - ${timeStr}`;

  return {
    id,
    uri,
    timestamp: now.toISOString(),
    coordinates,
    watermarkText,
    // Realistic small placeholder base64 marker
    base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...',
  };
}

export function formatFileSize(bytes: number = 245000): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
