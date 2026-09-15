export default function SiteHeader() {
  return (
    <header className="lux-header">
      <div className="container lux-header__inner">
        <a className="lux-wordmark" href="/">
          <img className="lux-logo" src="/branding/logo.jpg" alt="LUMIÉRA Shine" />
          <b>LUMIÉRA</b>
          <i>Shine</i>
        </a>
        <nav className="lux-nav">
          <a href="/#products">Koleksi</a>
          <a href="/#how-to-buy">Cara Beli</a>
          <a href="/#footer">Kontak</a>
        </nav>
      </div>
    </header>
  );
}
