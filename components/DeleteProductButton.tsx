'use client';
import { useState } from 'react';

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (!confirm(`Hapus produk "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setLoading(true);
    const r = await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    const j = await r.json();
    setLoading(false);
    if (r.ok) {
      location.reload();
    } else {
      alert(j.error || 'Gagal menghapus produk.');
    }
  }

  return (
    <button type="button" className="link" onClick={remove} disabled={loading} style={{ color: '#a32222' }}>
      {loading ? 'Menghapus…' : 'Hapus'}
    </button>
  );
}
