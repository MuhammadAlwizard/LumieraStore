'use client';
import { useCart } from './CartProvider';

export default function CartButton() {
  const { totalItems, toggle } = useCart();

  return (
    <button type="button" className="lux-cart-btn" onClick={toggle} aria-label="Buka keranjang">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 4h2l2.4 12.2a2 2 0 002 1.8h8.2a2 2 0 002-1.8L21 8H6" />
        <circle cx="9.5" cy="20" r="1.4" />
        <circle cx="17.5" cy="20" r="1.4" />
      </svg>
      {totalItems > 0 && <span className="lux-cart-badge">{totalItems}</span>}
    </button>
  );
}
