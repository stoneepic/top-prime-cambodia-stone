function MenuIcon({ isOpen }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="icon icon--menu">
      {isOpen ? (
        <>
          <path d="M5 5l14 14" />
          <path d="M19 5L5 19" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export default function Header({
  content,
  language,
  onLanguageChange,
  isMenuOpen,
  onMenuToggle,
  onQuoteClick,
}) {
  const links = [
    ['materials', '#materials'],
    ['products', '#products'],
    ['quarry', '#quarry'],
    ['factory', '#factory'],
    ['videos', '#videos'],
    ['about', '#about'],
    ['contact', '#contact'],
  ];

  return (
    <header className={`site-header ${isMenuOpen ? 'site-header--open' : ''}`}>
      <div className="container site-header__inner">
        <a className="brand-mark" href="#top" onClick={() => onMenuToggle(false)}>
          <img
            className="brand-mark__logo"
            src="/assets/logo.jpg"
            alt="TOP PRIME STONE logo"
            width="39"
            height="36"
          />
          <span className="brand-mark__text">
            <strong>{content.brand.name}</strong>
            <small>{content.brand.location}</small>
          </span>
        </a>

        <nav className={`site-nav ${isMenuOpen ? 'site-nav--open' : ''}`} aria-label="Primary navigation">
          {links.map(([key, href]) => (
            <a key={key} href={href} onClick={() => onMenuToggle(false)}>
              {content.nav[key]}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <button
            className="language-toggle"
            type="button"
            onClick={() => onLanguageChange(language === 'en' ? 'zh' : 'en')}
          >
            {content.nav.language}
          </button>
          <a className="button button--small button--solid site-header__quote" href="#contact" onClick={onQuoteClick}>
            {content.nav.quote}
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={isMenuOpen ? content.nav.close : content.nav.menu}
            aria-expanded={isMenuOpen}
            onClick={() => onMenuToggle(!isMenuOpen)}
          >
            <MenuIcon isOpen={isMenuOpen} />
          </button>
        </div>
      </div>
    </header>
  );
}
