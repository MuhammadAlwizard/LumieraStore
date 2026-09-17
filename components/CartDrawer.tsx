'use client';
import Link from 'next/link';
import { useCart } from './CartProvider';

export default function CartDrawer() {
  const { items, isOpen, close, removeItem, setQuantity, totalPrice } = useCart();
  if (!isOpen) return null;

  return (
    <div className="lux-cart-overlay" onClick={close}>
      <aside className="lux-cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="lux-cart-drawer__head">
          <h3>Keranjang</h3>
          <button type="button" className="lux-cart-close" onClick={close} aria-label="Tutup keranjang">×</button>
        </div>
        {items.length === 0 ? (
          <p className="lux-cart-empty">Keranjang masih kosong.</p>
        ) : (
          <>
            <ul className="lux-cart-list">
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
            <div className="lux-cart-drawer__foot">
              <div className="lux-cart-total"><span>Subtotal</span><b>Rp {totalPrice.toLocaleString('id-ID')}</b></div>
              <Link href="/keranjang" className="lux-btn lux-btn--block" onClick={close}>Lanjut ke Pembayaran</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
