import SiteHeader from '@/components/SiteHeader';

export const metadata = { title: 'Kebijakan Privasi — LUMIÉRA Shine' };

export default function PrivacyPolicy() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="lux-section">
          <div className="container" style={{ maxWidth: 760 }}>
            <h1>Kebijakan Privasi</h1>
            <p>Terakhir diperbarui: 17 September 2026</p>

            <h2>Data yang Kami Kumpulkan</h2>
            <p>Saat kamu melakukan pemesanan, kami mengumpulkan nama, alamat email, nomor WhatsApp (opsional), dan alamat pengiriman. Data ini hanya digunakan untuk memproses dan mengirimkan pesananmu.</p>

            <h2>Penggunaan Data</h2>
            <p>Data pelanggan digunakan semata-mata untuk keperluan transaksi: konfirmasi pesanan, komunikasi terkait pengiriman, dan penanganan keluhan. Kami tidak menjual atau membagikan data pribadimu ke pihak ketiga untuk kepentingan pemasaran.</p>

            <h2>Penyimpanan Data</h2>
            <p>Data disimpan secara aman di infrastruktur database pihak ketiga (Supabase) yang kami gunakan untuk operasional toko. Kami tidak menyimpan detail kartu pembayaran atau data rekening — pembayaran dilakukan melalui transfer QRIS langsung dan bukti transfer dikirim manual lewat WhatsApp.</p>

            <h2>Hak Kamu</h2>
            <p>Kamu berhak meminta salinan, koreksi, atau penghapusan data pribadimu yang tersimpan di sistem kami. Hubungi kami melalui WhatsApp atau Instagram untuk permintaan tersebut.</p>

            <h2>Kontak</h2>
            <p>Ada pertanyaan soal privasi datamu? Hubungi kami lewat kanal yang tersedia di halaman utama.</p>
          </div>
        </section>
      </main>
    </>
  );
}
