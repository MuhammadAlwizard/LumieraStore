'use client';
import { useState } from 'react';

export default function ConfirmOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  async function confirmPaid() {
    if (!confirm(`Tandai order ${orderId} sebagai lunas?`)) return;
    setLoading(true);
    const r = await fetch('/api/admin/orders/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId }) });
    const j = await r.json();
    setLoading(false);
    if (r.ok) {
      location.reload();
    } else {
      alert(j.error || 'Gagal menandai order lunas.');
    }
  }

  return (
    <button type="button" className="link" onClick={confirmPaid} disabled={loading}>
      {loading ? 'Memproses…' : 'Tandai Lunas'}
    </button>
  );
}
