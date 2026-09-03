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

export default function QuarrySection({ content, index }) {
  const items = content.quarry || [];
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.quarry-slide');
    const amount = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
    setTimeout(updateEdges, 320);
  };

  return (
    <section className="section quarry-section" id="quarry" aria-labelledby="quarry-title">
      <div className="container">
        <div className="section-heading section-heading--split section-heading--light">
          <div>
            <p className="section-kicker">{content.sectionLabels.quarry}</p>
            <h2 id="quarry-title">{content.sectionTitles.quarry}</h2>
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
          className="quarry-track"
          ref={trackRef}
          onScroll={updateEdges}
          tabIndex={0}
          role="region"
          aria-label="Quarry image slides"
        >
          {items.map((item, i) => (
            <figure className="quarry-slide" key={item.id}>
              <img src={item.image} alt={item.alt} loading="eager" />
              <figcaption>
                <span className="quarry-slide__index">{String(i + 1).padStart(2, '0')}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="quarry-hint">{content.quarryHint}</p>
      </div>
    </section>
  );
}
