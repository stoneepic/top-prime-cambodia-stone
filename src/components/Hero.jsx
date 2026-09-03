import { useEffect, useState } from 'react';

const HERO_IMAGES = [
  { src: '/assets/factory/warehouse-hero.jpg', alt: 'TOP PRIME warehouse' },
  { src: '/assets/factory/office-hero.jpg', alt: 'TOP PRIME office' },
];

const ROTATE_MS = 5000;

export default function Hero({ content, onExplore, onQuote }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % HERO_IMAGES.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        {HERO_IMAGES.map((image, i) => (
          <img
            key={image.src}
            className={`hero__bg-img ${i === current ? 'hero__bg-img--active' : ''}`}
            src={image.src}
            alt=""
            loading="eager"
          />
        ))}
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="container hero__content">
        <h1 id="hero-title">{content.hero.title}</h1>
        <p className="hero__description">{content.hero.description}</p>
        <div className="hero__actions">
          <a className="button button--outline" href="#materials" onClick={onExplore}>
            {content.hero.explore}
          </a>
          <button className="button button--solid" type="button" onClick={onQuote}>
            {content.hero.quote}
          </button>
        </div>
      </div>
    </section>
  );
}
