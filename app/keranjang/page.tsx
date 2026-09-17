'use client';
import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import { useCart } from '@/components/CartProvider';

declare global { interface Window { snap?: { pay: (token: string, options: Record<string, () => void>) => void } } }

export default function CartPage() {
  const { items, removeItem, setQuantity, totalPrice, clear } = useCart();
  const [data, setData] = useState({ customerName: '', customerEmail: '', customerPhone: '', shippingAddress: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [order, setOrder] = useState<{ orderId: string; total: number } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const r = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })) }),
    });
    const j = await r.json();
    setLoading(false);
    if (j.token && window.snap) {
      window.snap.pay(j.token, {
        onSuccess: () => { setMessage('Pembayaran berhasil, terima kasih!'); clear(); },
        onPending: () => setMessage('Menunggu pembayaran. Selesaikan pembayaranmu untuk memproses pesanan.'),
        onError: () => setMessage('Pembayaran gagal. Silakan coba lagi.'),
        onClose: () => setMessage('Popup pembayaran ditutup. Kamu bisa selesaikan pembayaran lewat link yang dikirim ke email.'),
      });
    } else if (j.orderId) {
      setOrder({ orderId: j.orderId, total: j.total });
      clear();
    } else {
      setMessage(j.message || j.error || 'Checkout gagal.');
    }
  }

  if (order) {
    const waText = encodeURIComponent(`Halo, saya sudah transfer untuk Order ${order.orderId} a.n. ${data.customerName}, total Rp ${order.total.toLocaleString('id-ID')}. Ini bukti transfernya.`);
    const waHref = `${process.env.NEXT_PUBLIC_WHATSAPP_URL}?text=${waText}`;
    return (
      <>
        <SiteHeader />
        <main className="lux-detail">
          <div className="container">
            <div className="lux-checkout">
              <h3>Pembayaran</h3>
              <p className="lux-checkout__hint">Scan QRIS di bawah untuk membayar Order {order.orderId}.</p>
              <img src="/branding/qris.jpg" alt="QRIS Lumiera Shine" style={{ width: '100%', maxWidth: 320 }} />
              <p>Total: Rp {order.total.toLocaleString('id-ID')}</p>
              <p className="lux-checkout__hint">Setelah transfer, kirim bukti pembayaran lewat WhatsApp agar pesanan segera diproses.</p>
              <a className="lux-btn lux-btn--block" href={waHref} target="_blank" rel="noopener noreferrer">Konfirmasi via WhatsApp</a>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="lux-detail">
          <div className="container">
            <p className="lux-checkout__hint">Keranjang kamu masih kosong.</p>
            <Link className="lux-link lux-back" href="/"><span aria-hidden="true">←</span>Lihat koleksi</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="lux-detail">
        <div className="container lux-cart-page">
          <div>
            <h1 className="lux-cart-page__title">Keranjang</h1>
            <ul className="lux-cart-list lux-cart-list--page">
              {items.map((item) => (
                <li key={item.productId} className="lux-cart-item">
                  <div className="lux-cart-item__swatch" style={{ background: item.colorHex }} />
                  <div className="lux-cart-item__info">
                    <p className="lux-cart-item__name">{item.name}</p>
                    <p className="lux-cart-item__color">{item.colorName}</p>
                    <div className="lux-cart-item__row">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.productId, Number(e.target.value) || 1)}
                        aria-label={`Jumlah ${item.name}`}
                      />
                      <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <button type="button" className="lux-cart-remove" onClick={() => removeItem(item.productId)} aria-label={`Hapus ${item.name}`}>×</button>
                </li>
              ))}
            </ul>
          </div>
          <form className="lux-checkout" onSubmit={submit}>
            <h3>Checkout</h3>
            <p className="lux-checkout__hint">Isi data pengiriman, pembayaran diproses lewat Midtrans.</p>
            <input className="form-control" required aria-label="Nama lengkap" placeholder="Nama lengkap" value={data.customerName} onChange={(e) => setData({ ...data, customerName: e.target.value })} />
            <input className="form-control" required aria-label="Email" type="email" placeholder="Email" value={data.customerEmail} onChange={(e) => setData({ ...data, customerEmail: e.target.value })} />
            <input className="form-control" aria-label="Nomor WhatsApp" placeholder="Nomor WhatsApp" value={data.customerPhone} onChange={(e) => setData({ ...data, customerPhone: e.target.value })} />
            <textarea className="form-control" required aria-label="Alamat lengkap pengiriman" placeholder="Alamat lengkap pengiriman (jalan, kota, kecamatan, kode pos)" rows={3} value={data.shippingAddress} onChange={(e) => setData({ ...data, shippingAddress: e.target.value })} />
            <div className="lux-cart-total lux-cart-total--form"><span>Total</span><b>Rp {totalPrice.toLocaleString('id-ID')}</b></div>
            <button className="lux-btn lux-btn--block" disabled={loading}>{loading ? 'Memproses…' : 'Bayar Sekarang'}</button>
            {message && <p className="success">{message}</p>}
          </form>
        </div>
      </main>
    </>
  );
}
