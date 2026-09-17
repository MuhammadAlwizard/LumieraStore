'use client';
import { useCart } from './CartProvider';

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    slug: string;
    imagePath: string | null;
    colorName: string;
    colorHex: string;
  };
  className?: string;
  label?: string;
};

export default function AddToCartButton({ product, className, label }: Props) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      className={className ?? 'lux-btn'}
      onClick={() =>
        addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          slug: product.slug,
          imagePath: product.imagePath,
          colorName: product.colorName,
          colorHex: product.colorHex,
        })
      }
    >
      {label ?? '+ Keranjang'}
    </button>
  );
}
