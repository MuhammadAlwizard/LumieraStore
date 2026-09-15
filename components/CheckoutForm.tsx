'use client';
import { useState } from 'react';

declare global { interface Window { snap?: { pay: (token: string, options: Record<string, () => void>) => void } } }

export default function CheckoutForm({ product }: { product: { id: string; price: number } }) {
  const [data, setData] = useState({ customerName: '', customerEmail: '', customerPhone: '', shippingAddress: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, productId: product.id }) });
    const j = await r.json();
    setLoading(false);
    if (j.token && window.snap) {
      window.snap.pay(j.token, {
        onSuccess: () => setMessage('Pembayaran berhasil.'),
        onPending: () => setMessage('Menunggu pembayaran.'),
        onError: () => setMessage('Pembayaran gagal.'),
        onClose: () => setMessage('Popup pembayaran ditutup.'),
      });
    } else {
      setMessage(j.message || j.error || 'Checkout gagal.');
    }
  }

  return (
    <form className="lux-checkout" onSubmit={submit}>
      <h3>Checkout</h3>
      <p className="lux-checkout__hint">Isi data pengiriman, pembayaran diproses lewat Midtrans.</p>
      <input className="form-control" required placeholder="Nama lengkap" value={data.customerName} onChange={e => setData({ ...data, customerName: e.target.value })} />
      <input className="form-control" required type="email" placeholder="Email" value={data.customerEmail} onChange={e => setData({ ...data, customerEmail: e.target.value })} />
      <input className="form-control" placeholder="Nomor WhatsApp" value={data.customerPhone} onChange={e => setData({ ...data, customerPhone: e.target.value })} />
      <textarea className="form-control" required placeholder="Alamat lengkap pengiriman (jalan, kota, kecamatan, kode pos)" rows={3} value={data.shippingAddress} onChange={e => setData({ ...data, shippingAddress: e.target.value })} />
      <button className="lux-btn lux-btn--block" disabled={loading}>{loading ? 'Memproses…' : 'Bayar Sekarang'}</button>
      {message && <p className="success">{message}</p>}
    </form>
  );
}
