# LUMIÉRA Shine

Toko online untuk brand hijab premium LUMIÉRA Shine (Instagram: @lumiera.shine). Katalog produk, keranjang multi-item, checkout, dan panel admin untuk mengelola produk, stok, dan pesanan.

## Fitur

**Toko (publik)**
- Katalog produk dengan grid tidak seragam, halaman detail per produk, dan pilihan warna dinamis.
- Keranjang multi-item, pilihan jumlah, checkout dengan alamat pengiriman.
- Stok dipesan secara atomik saat checkout (mencegah oversell); pesanan `PENDING` yang lewat 24 jam otomatis kedaluwarsa dan stoknya dikembalikan.
- Rate limit checkout per IP.
- Halaman Kebijakan Privasi dan Syarat & Ketentuan.
- SEO: `robots.txt`, `sitemap.xml`, metadata unik per produk, JSON-LD `Product` (stok hanya sebagai status, bukan angka), Open Graph dan Twitter card.

**Admin (`/admin`)**
- Login (NextAuth Credentials, multi-admin) dan reset password lewat email.
- CRUD produk dengan upload foto, manajemen warna, pergerakan stok (masuk/keluar).
- Dashboard omzet: total omzet, hari terbaik, grafik 14 hari, produk terlaris.
- Konfirmasi pembayaran manual ("Tandai Lunas") sebagai cadangan.

## Tech stack

Next.js 14 (App Router), TypeScript, Prisma, PostgreSQL (Supabase), Supabase Storage (foto produk), NextAuth, Midtrans Snap, Resend, font Cormorant Garamond dan Jost.

## Menjalankan lokal

1. `npm install` (otomatis menjalankan `prisma generate`).
2. Salin `.env.example` menjadi `.env`, lalu isi semua nilainya (lihat komentar di file tersebut). Butuh project Supabase sendiri. **Pakai database terpisah untuk development**, jangan database produksi.
3. `npx prisma migrate deploy` untuk menerapkan migrasi.
4. `npm run prisma:seed` membuat akun `admin` dengan password dari `ADMIN_SEED_PASSWORD` serta contoh produk. Seed tidak menimpa password admin yang sudah ada.
5. `npm run dev`, lalu buka `http://localhost:3000`. Panel admin di `/admin`.

## Deploy

Berjalan di Next.js Node runtime. Hal yang perlu diperhatikan:
- Semua variabel di `.env.example` harus diisi di dashboard hosting. Di Vercel, variabel `NEXT_PUBLIC_*` dan `NEXTAUTH_SECRET` harus bertipe **Config** (bukan Secret) karena dibaca middleware atau di-inline saat build.
- `postinstall` menjalankan `prisma generate`; migrasi dijalankan manual (`prisma migrate deploy`).
- Untuk pembayaran otomatis, daftarkan `https://DOMAIN-KAMU/api/midtrans/notification` sebagai Payment Notification URL di dashboard Midtrans.

## Status (jujur)

Belum selesai atau belum berjalan penuh:
- **Midtrans belum aktif penuh.** Integrasi Snap sudah ada, tapi akun merchant masih menunggu aktivasi channel pembayaran, sehingga situs produksi masih memakai alur cadangan QRIS + konfirmasi WhatsApp.
- Pengiriman email reset password memakai sender testing Resend, yang hanya mengirim ke email pemilik akun Resend. Domain belum diverifikasi.
- Belum ada database staging terpisah, dan belum ada tes otomatis.
- Password admin disimpan sebagai SHA-256 tanpa salt, dan sebaiknya diganti ke bcrypt/argon2.
- Belum ada screenshot di README (akan ditambahkan dari data contoh).

## Lisensi dan brand

Kode ini dibuat untuk LUMIÉRA Shine. Nama, logo, foto produk, dan aset brand adalah milik LUMIÉRA Shine dan tidak boleh dipakai ulang tanpa izin. Tidak ada file LICENSE, jadi semua hak dilindungi.
