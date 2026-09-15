import SiteHeader from '@/components/SiteHeader';
import ProductCard from '@/components/ProductCard';
import ProductVisual from '@/components/ProductVisual';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const channels = [
  {
    title: 'WhatsApp',
    copy: 'Chat langsung untuk konsultasi produk dan pemesanan.',
    cta: 'Chat di WhatsApp',
    href: process.env.NEXT_PUBLIC_WHATSAPP_URL,
    icon: (
      <path d="M8 34l2.1-6.3A12 12 0 1114.6 32L8 34z" />
    ),
  },
  {
    title: 'Shopee',
    copy: 'Belanja dengan aman melalui toko resmi kami.',
    cta: 'Kunjungi Toko',
    href: process.env.NEXT_PUBLIC_SHOPEE_URL,
    icon: (
      <>
        <path d="M9 13h24l-2.2 21.2a2 2 0 01-2 1.8H13.2a2 2 0 01-2-1.8L9 13z" />
        <path d="M16 17V11a5 5 0 0110 0v6" />
      </>
    ),
  },
  {
    title: 'Instagram',
    copy: 'Ikuti update koleksi, tips styling, dan promo eksklusif.',
    cta: 'Follow Instagram',
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    icon: (
      <>
        <rect x="9" y="9" width="24" height="24" rx="7" />
        <circle cx="21" cy="21" r="6" />
        <circle cx="28.4" cy="13.6" r="1.3" />
      </>
    ),
  },
];

export default async function Home() {
  const products = await prisma.product.findMany({ include: { color: true }, orderBy: { createdAt: 'asc' } });

  return (
    <>
      <SiteHeader />
      <main>
        <section className="lux-hero">
          <div className="container lux-hero__inner">
            <div>
              <span className="lux-eyebrow">Premium Hijab</span>
              <h1 className="lux-display">Shine in Every Shade</h1>
              <p className="lux-tagline">Elegance that moves with you</p>
              <p className="lux-lead">
                Hijab premium dengan tekstur lembut dan warna yang dikurasi untuk menemani setiap momen —
                dari pagi yang sederhana sampai undangan yang istimewa.
              </p>
              <div className="lux-actions">
                <a className="lux-btn" href="#products">Lihat Koleksi</a>
                <a className="lux-btn lux-btn--ghost" href="#how-to-buy">Cara Beli</a>
              </div>
            </div>
            <div className="lux-hero__visual">
              <ProductVisual name="LUMIÉRA Shine" hex="#8B3A3A" imagePath="/branding/hero-tag.jpg" tall />
            </div>
          </div>
        </section>

        <section className="lux-section" id="products">
          <div className="container">
            <div className="lux-head">
              <span className="lux-eyebrow lux-eyebrow--center">The Collection</span>
              <h2>Temukan Shade Favoritmu</h2>
              <p>Tekstur yang nyaman, warna yang berbicara.</p>
            </div>
            <div className="lux-grid">
              {products.map((p, i) => <ProductCard key={p.id} product={p} featured={i % 4 === 0} />)}
            </div>
          </div>
        </section>

        <section className="lux-section lux-section--tint" id="how-to-buy">
          <div className="container">
            <div className="lux-head">
              <span className="lux-eyebrow lux-eyebrow--center">Connect With Us</span>
              <h2>Cara Beli</h2>
              <p>Pilih kanal yang paling nyaman untukmu.</p>
            </div>
            <div className="lux-channels">
              {channels.map((c) => (
                <article className="lux-channel" key={c.title}>
                  <svg className="lux-channel__icon" viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {c.icon}
                  </svg>
                  <h3>{c.title}</h3>
                  <p>{c.copy}</p>
                  <a className="lux-btn lux-btn--ghost" href={c.href} target="_blank" rel="noreferrer">{c.cta}</a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="lux-footer" id="footer">
        <div className="container">
          <div className="lux-footer__grid">
            <div>
              <h3>LUMIÉRA Shine</h3>
              <p>
                Premium hijab crafted to elevate your everyday elegance.
                <br />Shine in Every Shade.
              </p>
            </div>
            <div>
              <h4>Hubungi Kami</h4>
              <p>
                <a href={process.env.NEXT_PUBLIC_WHATSAPP_URL}>WhatsApp</a>
                <br /><a href={process.env.NEXT_PUBLIC_SHOPEE_URL}>Shopee</a>
                <br /><a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}>Instagram</a>
              </p>
            </div>
            <div>
              <h4>Layanan</h4>
              <p>
                Response: 24 jam
                <br />Pengiriman: Seluruh Indonesia
                <br />Kualitas: 100% Terjamin
              </p>
            </div>
          </div>
          <div className="lux-footer__note">© 2026 LUMIÉRA Shine</div>
        </div>
      </footer>
    </>
  );
}
