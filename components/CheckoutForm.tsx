'use client';
import { useState } from 'react';

export default function CheckoutForm({ product }: { product: { id: string; price: number } }) {
  const [data, setData] = useState({ customerName: '', customerEmail: '', customerPhone: '', shippingAddress: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<{ orderId: string; total: number } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, productId: product.id }) });
    const j = await r.json();
    setLoading(false);
    if (j.orderId) {
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
      <p className="lux-checkout__hint">Isi data pengiriman, pembayaran lewat QRIS.</p>
      <input className="form-control" required placeholder="Nama lengkap" value={data.customerName} onChange={e => setData({ ...data, customerName: e.target.value })} />
      <input className="form-control" required type="email" placeholder="Email" value={data.customerEmail} onChange={e => setData({ ...data, customerEmail: e.target.value })} />
      <input className="form-control" placeholder="Nomor WhatsApp" value={data.customerPhone} onChange={e => setData({ ...data, customerPhone: e.target.value })} />
      <textarea className="form-control" required placeholder="Alamat lengkap pengiriman (jalan, kota, kecamatan, kode pos)" rows={3} value={data.shippingAddress} onChange={e => setData({ ...data, shippingAddress: e.target.value })} />
      <button className="lux-btn lux-btn--block" disabled={loading}>{loading ? 'Memproses…' : 'Bayar Sekarang'}</button>
      {message && <p className="success">{message}</p>}
    </form>
  );
}
