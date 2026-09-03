import { useRef, useState } from 'react';

function ChevronLeft() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path d="M15 4l-8 8 8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path d="M9 4l8 8-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FactorySection({ content }) {
  const items = content.factory || [];
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(items.length <= 1);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.factory-slide');
    const amount = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
    setTimeout(updateEdges, 320);
  };

  return (
    <section className="section quarry-section" id="factory" aria-labelledby="factory-title">
      <div className="container">
        <div className="section-heading section-heading--split section-heading--light">
          <div>
            <p className="section-kicker">{content.sectionLabels.factory}</p>
            <h2 id="factory-title">{content.sectionTitles.factory}</h2>
          </div>
          <div className="quarry-nav">
            <button
              type="button"
              className="quarry-nav__btn"
              aria-label="Previous slide"
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              className="quarry-nav__btn"
              aria-label="Next slide"
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div
          className="factory-track"
          ref={trackRef}
          onScroll={updateEdges}
          tabIndex={0}
          role="region"
          aria-label="Factory image slides"
        >
          {items.map((item, i) => (
            <figure className="factory-slide" key={item.id}>
              <img src={item.image} alt={item.alt} loading="eager" />
              <figcaption>
                <span className="factory-slide__index">{String(i + 1).padStart(2, '0')}</span>
                <div className="factory-slide__text">
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="quarry-hint">{content.factoryHint}</p>
      </div>
    </section>
  );
}
