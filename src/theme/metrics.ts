import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const metrics = {
  // Dimensi layar dasar
  screenWidth: width,
  screenHeight: height,
  
  // Spacing (Margin & Padding)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16, // Padding standar layar
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Radius untuk gaya melengkung (Playful/Neo-Brutalism)
  radius: {
    sm: 8,
    md: 16,
    lg: 24,       // Radius standar untuk Card konten
    pill: 999,    // Radius penuh untuk kapsul/tombol oval
  },
  
  // Bayangan
  shadows: {
    // Bayangan tajam ala Neo-Brutalism
    neo: {
      shadowColor: '#262626',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 5, // Efek shadow pekat di Android
    },
    // Bayangan lembut standar (Opsional)
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }
  }
};
