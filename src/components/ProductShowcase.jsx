import { useRef, useState } from 'react';

function ChevronLeft() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path d="M15 4l-8 8 8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path d="M9 4l8 8-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GroupSlider({ group, index, hint }) {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(group.images.length <= 1);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.product-slide');
    const amount = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
    setTimeout(updateEdges, 320);
  };

  return (
    <div className="product-group">
      <div className="product-group__head">
        <h3>
          <span className="product-group__index">{String(index + 1).padStart(2, '0')}</span>
          {group.title}
        </h3>
        <div className="product-group__nav">
          <button type="button" className="quarry-nav__btn" aria-label="Previous slide" onClick={() => scrollByCard(-1)} disabled={atStart}>
            <ChevronLeft />
          </button>
          <button type="button" className="quarry-nav__btn" aria-label="Next slide" onClick={() => scrollByCard(1)} disabled={atEnd}>
            <ChevronRight />
          </button>
        </div>
      </div>
      <div
        className="product-track"
        ref={trackRef}
        onScroll={updateEdges}
        tabIndex={0}
        role="region"
        aria-label={`${group.title} slides`}
      >
        {group.images.map((img, i) => (
          <figure className="product-slide" key={`${img.image}-${i}`}>
            <img src={img.image} alt={img.alt || group.title} loading="eager" />
            <figcaption>
              <span className="product-slide__index">{String(i + 1).padStart(2, '0')}</span>
              <span>{img.alt || group.title}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="product-group__hint">{hint}</p>
    </div>
  );
}

export default function ProductShowcase({ content }) {
  const groups = content.products.groups || [];

  return (
    <section className="section products-section" id="products" aria-labelledby="products-title">
      <div className="container">
        <div className="section-heading section-heading--split section-heading--light">
          <div>
            <p className="section-kicker">{content.sectionLabels.products}</p>
          </div>
        </div>

        <p className="products-lead">{content.products.description}</p>

        <div className="product-groups">
          {groups.map((group, i) => (
            <GroupSlider key={group.id} group={group} index={i} hint={content.productsHint} />
          ))}
        </div>

        <div className="product-tags" aria-label="Applications">
          {content.products.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
    </section>
  );
}
