# LUMIÉRA Shine

E-commerce hijab berbasis Next.js App Router, Prisma + SQLite, NextAuth Credentials, dan Midtrans Snap sandbox.

## Menjalankan lokal

1. `npm install`
2. Salin `.env.example` menjadi `.env.local`, lalu isi `NEXTAUTH_SECRET` dan key Midtrans bila checkout ingin aktif.
3. `npx prisma generate`
4. `npx prisma migrate dev --name init`
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
- `MIDTRANS_SERVER_KEY`: server key sandbox/production dari Midtrans.
- `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`: client key yang sesuai environment.
- `NEXT_PUBLIC_WHATSAPP_URL`: nomor WhatsApp resmi.
- `NEXT_PUBLIC_SHOPEE_URL`: URL toko Shopee resmi.
- `NEXT_PUBLIC_INSTAGRAM_URL`: URL Instagram resmi.

Webhook Midtrans diarahkan ke `/api/midtrans/notification`. Endpoint memverifikasi `signature_key` sebelum memperbarui status order.
