import Link from 'next/link';
import { CSSProperties } from 'react';
import ProductVisual from './ProductVisual';
import AddToCartButton from './AddToCartButton';
import { getStockStatus } from '@/lib/stock';

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
  const stockStatus = getStockStatus(product.stock);
  return (
    <article className={`lux-card${featured ? ' lux-card--feature' : ''}`}>
      <ProductVisual name={product.name} hex={product.color.hex} imagePath={product.imagePath} wide={featured} />
      <div className="lux-card__body">
        <h3 className="lux-card__name">{product.name.replace(` ${product.color.name}`, '')}</h3>
        <span className="lux-swatch" style={{ '--c': product.color.hex } as CSSProperties}>
          <i />
          {product.color.name}
        </span>
        {stockStatus === 'low' && <span className="lux-badge lux-badge--low">Stok terbatas</span>}
        <p className="lux-card__desc">{product.description}</p>
        <div className="lux-price">Rp {product.price.toLocaleString('id-ID')}</div>
        <div className="lux-card__foot">
          {stockStatus === 'out' ? (
            <span className="lux-badge lux-badge--out">Habis</span>
          ) : (
            <>
              <Link className="lux-link" href={`/produk/${product.slug}`}>
                Lihat detail
                <span aria-hidden="true">→</span>
              </Link>
              <AddToCartButton
                className="lux-cart-quickadd"
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  slug: product.slug,
                  imagePath: product.imagePath,
                  colorName: product.color.name,
                  colorHex: product.color.hex,
                }}
              />
            </>
          )}
        </div>
      </div>
    </article>
  );
}
