import Link from 'next/link';
import { CSSProperties } from 'react';
import ProductVisual from './ProductVisual';

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  color: { name: string; hex: string };
  stock: number;
  imagePath: string | null;
};

export default function ProductCard({ product, featured }: { product: Product; featured?: boolean }) {
  const unavailable = product.stock <= 0;
  return (
    <article className={`lux-card${featured ? ' lux-card--feature' : ''}`}>
      <ProductVisual name={product.name} hex={product.color.hex} imagePath={product.imagePath} wide={featured} />
      <div className="lux-card__body">
        <h3 className="lux-card__name">{product.name.replace(` ${product.color.name}`, '')}</h3>
        <span className="lux-swatch" style={{ '--c': product.color.hex } as CSSProperties}>
          <i />
          {product.color.name}
        </span>
        <p className="lux-card__desc">{product.description}</p>
        <div className="lux-price">Rp {product.price.toLocaleString('id-ID')}</div>
        <div className="lux-card__foot">
          {unavailable ? (
            <span className="lux-badge lux-badge--out">Habis</span>
          ) : (
            <Link className="lux-link" href={`/produk/${product.slug}`}>
              Lihat detail
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
