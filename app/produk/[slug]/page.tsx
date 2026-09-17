import Link from 'next/link';
import { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SiteHeader from '@/components/SiteHeader';
import ProductVisual from '@/components/ProductVisual';
import CheckoutForm from '@/components/CheckoutForm';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await prisma.product.findUnique({ where: { slug: params.slug }, include: { color: true } });
  if (!p) return notFound();
  const soldOut = p.stock <= 0;

  return (
    <>
      <SiteHeader />
      <main className="lux-detail">
        <div className="container">
          <Link className="lux-link lux-back" href="/">
            <span aria-hidden="true">←</span>
            Kembali
          </Link>
          <div className="lux-detail__grid">
            <ProductVisual name={p.name} hex={p.color.hex} imagePath={p.imagePath} />
            <div className="lux-detail__info">
              <span className="lux-swatch" style={{ '--c': p.color.hex } as CSSProperties}>
                <i />
                {p.color.name}
              </span>
              <h1>{p.name.replace(` ${p.color.name}`, '')}</h1>
              <div className="lux-detail__price">Rp {p.price.toLocaleString('id-ID')}</div>
              <p className="lux-detail__desc">{p.description}</p>
              {soldOut ? (
                <>
                  <p className="lux-stock">Stok sedang kosong</p>
                  <span className="lux-badge lux-badge--out">Habis</span>
                </>
              ) : (
                <>
                  <p className="lux-stock">Stok tersedia — {p.stock} pcs</p>
                  <CheckoutForm product={{ id: p.id, price: p.price, stock: p.stock }} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
