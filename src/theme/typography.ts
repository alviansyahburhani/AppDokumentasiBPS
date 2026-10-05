export const typography = {
  // Ukuran Font
  size: {
    xs: 12,
    sm: 14,
    md: 16,     // Standar teks body
    lg: 18,
    xl: 24,     // Sub-judul
    xxl: 32,    // Judul layar
    xxxl: 40,   // Teks banner besar
  },
  
  // Ketebalan Font
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
    extraBold: '800' as const,
    black: '900' as const,
  },

  // Nama Font Family (Pastikan nanti font ini di-install/dilink ke RN)
  family: {
    // Sebagai placeholder, kita set nama font yang direkomendasikan di DesainUI.md
    primary: 'Outfit-Bold', 
    primaryRegular: 'Outfit-Regular',
    body: 'Inter-Regular',
    bodyBold: 'Inter-Bold',
  }
};
