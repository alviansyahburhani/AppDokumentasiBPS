# Panduan Desain & UI/UX Aplikasi

Berdasarkan referensi desain yang diberikan, aplikasi ini akan menggunakan gaya visual **Playful Modern / Soft Neo-Brutalism**. Gaya ini sangat berani, interaktif, ramah pengguna, dan cocok untuk memberikan kesan segar serta tidak kaku pada aplikasi instansi.

## 🎨 1. Palet Warna (Color Palette)

Desain ini mengandalkan kontras tinggi yang mencolok. Sesuai permintaan, kita akan menyisipkan warna **Oranye** sebagai pelengkap yang sempurna.

| Peran Warna | Hex Code (Estimasi) | Keterangan / Penggunaan |
| :--- | :--- | :--- |
| **Primary (Neon Green)** | `#D4FF32` (Lime) | Warna dominan untuk *background* layar tertentu, *highlight* teks, atau ilustrasi. Memberikan kesan segar dan energik. |
| **Secondary (Electric Blue)** | `#3B38F6` | Warna kontras utama. Digunakan untuk tombol utama (Call-to-Action), *header*, atau kontainer *card*. |
| **Accent (Vibrant Orange)** | `#FF7A00` | **(Tambahan Baru)** Sangat cocok dipadukan dengan biru dan hijau. Gunakan untuk tombol peringatan, *badge* status (misal: "Proses"), atau elemen interaktif sekunder. |
| **Dark / Surface** | `#262626` | Hitam keabu-abuan. Digunakan untuk teks utama, atau *background* area mode gelap/footer agar mata pengguna bisa istirahat dari warna neon. |
| **Light / Background** | `#F3F4F6` | Putih *Off-white* (sedikit abu-abu). Digunakan untuk *background* aplikasi utama agar tidak terlalu silau. |

---

## 🔠 2. Tipografi (Typography)

Untuk menyesuaikan dengan gaya pada gambar, font yang digunakan harus tebal, modern, dan tanpa kait (*sans-serif*).

*   **Font Family yang Disarankan:** 
    *   *Utama (Heading):* **Outfit, Montserrat, atau Poppins** (Gunakan *weight: Bold / ExtraBold / Black*).
    *   *Paragraf (Body):* **Inter atau Roboto** (Gunakan *weight: Regular / Medium* untuk kemudahan membaca).
*   **Gaya Teks (*Styling*):**
    *   Banyak menggunakan gaya **"Pill Text"** (Teks yang dibungkus dengan *background* berbentuk kapsul lonjong) untuk penekanan kata penting pada *Heading*.
    *   Huruf kapital (UPPERCASE) sering digunakan pada judul.

---

## 📐 3. Bentuk & Komponen UI (Shape & Components)

Gaya desain ini sangat menonjolkan bentuk-bentuk geometris yang melengkung dan *playful*.

1.  **Border Radius (Sudut Melengkung):**
    *   Hampir tidak ada sudut lancip. Semua elemen (*Card*, *Button*, *Input Field*) harus memiliki sudut yang sangat melengkung (`borderRadius: 16` hingga `borderRadius: 999` untuk kapsul).
2.  **Buttons (Tombol):**
    *   Tombol padat (*Solid Button*) tanpa gradien, cukup warna polos (Biru, Hijau, atau Oranye).
    *   Tambahkan *icon* panah (➡) di sebelah kanan teks tombol untuk kesan dinamis.
3.  **Cards (Kartu Konten):**
    *   Kartu menggunakan warna blok (seperti biru atau hitam) dengan teks kontras di dalamnya.
    *   Tidak banyak menggunakan efek *Drop Shadow* (bayangan) yang kabur. Jika ingin memakai bayangan, gunakan gaya *Solid Shadow* (bayangan tajam/keras khas neo-brutalism).
4.  **Elemen Dekoratif:**
    *   Gunakan ornamen seperti bentuk *Starburst* (bintang meledak) untuk label harga/badge.
    *   Gunakan stiker atau maskot (seperti dinosaurus pada referensi) untuk menghiasi halaman yang kosong (*Empty State*).

---

## 💻 4. Implementasi di React Native (Folder `src/theme/`)

Nantinya, Anda bisa merepresentasikan desain ini ke dalam kode Anda di folder `src/theme/colors.ts` seperti ini:

```typescript
// src/theme/colors.ts
export const colors = {
  primary: '#D4FF32',     // Neon Green
  secondary: '#3B38F6',   // Electric Blue
  accent: '#FF7A00',      // Vibrant Orange (Tambahan)
  background: '#F3F4F6',  // Off-white
  surfaceDark: '#262626', // Dark Gray/Black
  text: '#111827',
  white: '#FFFFFF',
};
```
