'use client';
import { useEffect, useState } from 'react';

type Color = { id: string; name: string; hex: string };

export default function ColorManager() {
  const [colors, setColors] = useState<Color[]>([]);
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#8B3A3A');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editHex, setEditHex] = useState('#8B3A3A');

  async function load() {
    setColors(await (await fetch('/api/admin/colors')).json());
  }
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch('/api/admin/colors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, hex }) });
    const j = await r.json();
    setMessage(r.ok ? 'Warna ditambahkan.' : j.error);
    if (r.ok) { setName(''); await load(); }
  }

  async function remove(id: string) {
    const r = await fetch('/api/admin/colors', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    const j = await r.json();
    setMessage(r.ok ? 'Warna dihapus.' : j.error);
    if (r.ok) load();
  }

  function startEdit(c: Color) {
    setEditingId(c.id);
    setEditName(c.name);
    setEditHex(c.hex);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    const r = await fetch('/api/admin/colors', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, name: editName, hex: editHex }) });
    const j = await r.json();
    setMessage(r.ok ? 'Warna diperbarui.' : j.error);
    if (r.ok) { setEditingId(null); load(); }
  }

  return (
    <>
      <form className="admin-card" onSubmit={add}>
        <input className="form-control" required placeholder="Nama warna" value={name} onChange={e => setName(e.target.value)} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" value={hex} onChange={e => setHex(e.target.value)} />
          <input className="form-control" required pattern="^#[0-9A-Fa-f]{6}$" value={hex} onChange={e => setHex(e.target.value.toUpperCase())} />
        </div>
        <button className="button">Tambah Warna</button>
        {message && <p className="success">{message}</p>}
      </form>
      <table className="admin-table">
        <thead><tr><th>Warna</th><th>Nama</th><th>HEX</th><th>Aksi</th></tr></thead>
        <tbody>
          {colors.map(c => editingId === c.id ? (
            <tr key={c.id}>
              <td>
                <input type="color" value={editHex} onChange={e => setEditHex(e.target.value)} />
              </td>
              <td>
                <input className="form-control" style={{ margin: 0 }} value={editName} onChange={e => setEditName(e.target.value)} />
              </td>
              <td>
                <input className="form-control" style={{ margin: 0 }} required pattern="^#[0-9A-Fa-f]{6}$" value={editHex} onChange={e => setEditHex(e.target.value.toUpperCase())} />
              </td>
              <td>
                <button className="link" onClick={() => saveEdit(c.id)}>Simpan</button> <button className="link" onClick={cancelEdit}>Batal</button>
              </td>
            </tr>
          ) : (
            <tr key={c.id}>
              <td><span style={{ display: 'inline-block', width: 22, height: 22, background: c.hex, border: '1px solid #ccc' }} /></td>
              <td>{c.name}</td>
              <td>{c.hex}</td>
              <td><button className="link" onClick={() => startEdit(c)}>Edit</button> <button className="link" onClick={() => remove(c.id)}>Hapus</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
