'use client';
import { useState } from 'react';

declare global { interface Window { snap?: { pay: (token: string, options: Record<string, () => void>) => void } } }

export default function CheckoutForm({ product }: { product: { id: string; price: number; stock: number } }) {
  const [data, setData] = useState({ customerName: '', customerEmail: '', customerPhone: '', shippingAddress: '' });
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<{ orderId: string; total: number } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, productId: product.id, quantity }) });
    const j = await r.json();
    setLoading(false);
    if (j.token && window.snap) {
      window.snap.pay(j.token, {
        onSuccess: () => setMessage('Pembayaran berhasil, terima kasih!'),
        onPending: () => setMessage('Menunggu pembayaran. Selesaikan pembayaranmu untuk memproses pesanan.'),
        onError: () => setMessage('Pembayaran gagal. Silakan coba lagi.'),
        onClose: () => setMessage('Popup pembayaran ditutup. Kamu bisa selesaikan pembayaran lewat link yang dikirim ke email.'),
      });
    } else if (j.orderId) {
      setOrder({ orderId: j.orderId, total: j.total });
    } else {
      setMessage(j.message || j.error || 'Checkout gagal.');
    }
  }

  if (order) {
    const waText = encodeURIComponent(`Halo, saya sudah transfer untuk Order ${order.orderId} a.n. ${data.customerName}, total Rp ${order.total.toLocaleString('id-ID')}. Ini bukti transfernya.`);
    const waHref = `${process.env.NEXT_PUBLIC_WHATSAPP_URL}?text=${waText}`;
    return (
      <div className="lux-checkout">
        <h3>Pembayaran</h3>
        <p className="lux-checkout__hint">Scan QRIS di bawah untuk membayar Order {order.orderId}.</p>
        <img src="/branding/qris.jpg" alt="QRIS Lumiera Shine" style={{ width: '100%', maxWidth: 320 }} />
        <p>Total: Rp {order.total.toLocaleString('id-ID')}</p>
        <p className="lux-checkout__hint">Setelah transfer, kirim bukti pembayaran lewat WhatsApp agar pesanan segera diproses.</p>
        <a className="lux-btn lux-btn--block" href={waHref} target="_blank" rel="noopener noreferrer">Konfirmasi via WhatsApp</a>
      </div>
    );
  }

  return (
    <form className="lux-checkout" onSubmit={submit}>
      <h3>Checkout</h3>
      <p className="lux-checkout__hint">Isi data pengiriman, pembayaran diproses lewat Midtrans.</p>
      <input className="form-control" required aria-label="Nama lengkap" placeholder="Nama lengkap" value={data.customerName} onChange={e => setData({ ...data, customerName: e.target.value })} />
      <input className="form-control" required aria-label="Email" type="email" placeholder="Email" value={data.customerEmail} onChange={e => setData({ ...data, customerEmail: e.target.value })} />
      <input className="form-control" aria-label="Nomor WhatsApp" placeholder="Nomor WhatsApp" value={data.customerPhone} onChange={e => setData({ ...data, customerPhone: e.target.value })} />
      <textarea className="form-control" required aria-label="Alamat lengkap pengiriman" placeholder="Alamat lengkap pengiriman (jalan, kota, kecamatan, kode pos)" rows={3} value={data.shippingAddress} onChange={e => setData({ ...data, shippingAddress: e.target.value })} />
      <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', margin: '4px 0' }} htmlFor="checkout-qty">Jumlah (stok tersedia: {product.stock})</label>
      <input id="checkout-qty" className="form-control" type="number" min={1} max={product.stock} value={quantity} onChange={e => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))} />
      <button className="lux-btn lux-btn--block" disabled={loading}>{loading ? 'Memproses…' : 'Bayar Sekarang'}</button>
      {message && <p className="success">{message}</p>}
    </form>
  );
}
