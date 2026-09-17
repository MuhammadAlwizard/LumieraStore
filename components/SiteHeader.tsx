import CartButton from './CartButton';

export default function SiteHeader() {
  return (
    <header className="lux-header">
      <div className="container lux-header__inner">
        <a className="lux-wordmark" href="/">
          <img className="lux-logo" src="/branding/logo.jpg" alt="LUMIÉRA Shine" />
          <b>LUMIÉRA</b>
          <i>Shine</i>
        </a>
        <div className="lux-header__right">
          <nav className="lux-nav">
            <a href="/#products">Koleksi</a>
            <a href="/#how-to-buy">Cara Beli</a>
            <a href="/#footer">Kontak</a>
          </nav>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
