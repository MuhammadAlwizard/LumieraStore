# LUMIÉRA Shine

E-commerce hijab berbasis Next.js App Router, Prisma + SQLite, NextAuth Credentials, dan pembayaran QRIS manual (konfirmasi admin).

## Menjalankan lokal

1. `npm install`
2. Salin `.env.example` menjadi `.env` (Prisma CLI membaca `.env`), lalu isi `NEXTAUTH_SECRET`.
3. `npx prisma generate`
4. `npx prisma migrate dev`
5. `npm run prisma:seed`
6. `npm run dev`

Buka `http://localhost:3000`. Panel admin ada di `/admin`.

## Akun admin seed

- Username: `admin`
- Password: `LumieraAdmin2026!`

User disimpan di tabel `User`; admin tambahan dapat dibuat dengan menambah record `User` melalui Prisma/skrip internal.

## Environment yang perlu diisi

- `DATABASE_URL`: default lokal `file:./dev.db`.
- `NEXTAUTH_URL` dan `NEXTAUTH_SECRET`: URL aplikasi serta secret acak panjang.
- `NEXT_PUBLIC_WHATSAPP_URL`: nomor WhatsApp resmi, dipakai juga untuk konfirmasi pembayaran QRIS oleh customer.
- `NEXT_PUBLIC_SHOPEE_URL`: URL toko Shopee resmi.
- `NEXT_PUBLIC_INSTAGRAM_URL`: URL Instagram resmi.

## Alur pembayaran

Checkout membuat `Order` berstatus `PENDING` dan menampilkan QRIS statis (`public/branding/qris.jpg`) plus tombol konfirmasi ke WhatsApp. Setelah customer transfer dan kirim bukti lewat WhatsApp, admin menandai order sebagai lunas lewat tombol "Tandai Lunas" di `/admin` — endpoint `/api/admin/orders/confirm` yang memotong stok dan mengubah status jadi `SETTLEMENT`.
