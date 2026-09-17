import Link from 'next/link';
import { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import SiteHeader from '@/components/SiteHeader';
import ProductVisual from '@/components/ProductVisual';
import AddToCartButton from '@/components/AddToCartButton';
import { getStockStatus } from '@/lib/stock';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await prisma.product.findUnique({ where: { slug: params.slug }, include: { color: true } });
  if (!p) return {};
  const title = `${p.name} - ${p.color.name} | LUMIÉRA Shine`;
  const image = p.imagePath || '/branding/hero-tag.jpg';
  return {
    title,
    description: p.description,
    openGraph: { title, description: p.description, url: `/produk/${p.slug}`, images: [{ url: image }] },
    twitter: { card: 'summary_large_image', title, description: p.description, images: [image] },
  };
}

const STOCK_AVAILABILITY: Record<string, string> = {
  available: 'https://schema.org/InStock',
  low: 'https://schema.org/LimitedAvailability',
  out: 'https://schema.org/OutOfStock',
};

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await prisma.product.findUnique({ where: { slug: params.slug }, include: { color: true } });
  if (!p) return notFound();
  const stockStatus = getStockStatus(p.stock);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: [p.imagePath || 'https://lumierastore.online/branding/hero-tag.jpg'],
    sku: p.id,
    color: p.color.name,
    brand: { '@type': 'Brand', name: 'LUMIÉRA Shine' },
    offers: {
      '@type': 'Offer',
      url: `https://lumierastore.online/produk/${p.slug}`,
      priceCurrency: 'IDR',
      price: p.price,
      availability: STOCK_AVAILABILITY[stockStatus],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
              {stockStatus === 'out' ? (
                <>
                  <p className="lux-stock">Stok sedang kosong</p>
                  <span className="lux-badge lux-badge--out">Habis</span>
                </>
              ) : (
                <>
                  {stockStatus === 'low' && <span className="lux-badge lux-badge--low">Stok terbatas</span>}
                  <AddToCartButton
                    className="lux-btn lux-btn--block"
                    label="+ Tambah ke Keranjang"
                    product={{ id: p.id, name: p.name, price: p.price, slug: p.slug, imagePath: p.imagePath, colorName: p.color.name, colorHex: p.color.hex }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
