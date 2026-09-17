import SiteHeader from '@/components/SiteHeader';

export const metadata = { title: 'Syarat & Ketentuan — LUMIÉRA Shine' };

export default function TermsOfService() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="lux-section">
          <div className="container" style={{ maxWidth: 760 }}>
            <h1>Syarat & Ketentuan</h1>
            <p>Terakhir diperbarui: 17 September 2026</p>

            <h2>Pemesanan</h2>
            <p>Pesanan dianggap sah setelah kamu mengisi form checkout dan menerima nomor Order. Stok akan dikunci untuk pesananmu selama proses pembayaran berlangsung.</p>

            <h2>Pembayaran</h2>
            <p>Pembayaran dilakukan melalui QRIS. Setelah transfer, kirim bukti pembayaran lewat WhatsApp agar pesanan dapat segera diverifikasi dan diproses oleh tim kami.</p>

            <h2>Batas Waktu Pembayaran</h2>
            <p>Pesanan yang belum dibayar dalam waktu 24 jam akan otomatis dibatalkan dan stok dikembalikan. Jika ini terjadi padahal kamu sudah membayar, hubungi kami segera lewat WhatsApp dengan bukti transfer.</p>

            <h2>Pengiriman</h2>
            <p>Pesanan diproses dan dikirim setelah pembayaran dikonfirmasi oleh admin. Estimasi waktu pengiriman mengikuti jasa ekspedisi yang digunakan.</p>

            <h2>Pengembalian & Komplain</h2>
            <p>Kalau produk yang diterima cacat produksi atau tidak sesuai pesanan, hubungi kami maksimal 2x24 jam setelah barang diterima lewat WhatsApp dengan foto/video bukti untuk proses lebih lanjut.</p>

            <h2>Perubahan Ketentuan</h2>
            <p>Kami dapat memperbarui syarat & ketentuan ini sewaktu-waktu. Perubahan akan berlaku sejak dipublikasikan di halaman ini.</p>
          </div>
        </section>
      </main>
    </>
  );
}
