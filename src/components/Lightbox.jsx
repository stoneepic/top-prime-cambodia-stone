import { useEffect } from 'react';

export default function Lightbox({ item, content, onClose, onQuote }) {
  useEffect(() => {
    if (!item) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="lightbox__panel">
        <button className="lightbox__close" type="button" aria-label={content.nav.close} onClick={onClose}>
          <span aria-hidden="true">×</span>
        </button>
        <img src={item.image} alt={item.alt} />
        <div className="lightbox__content">
          <p className="section-kicker">{content.sectionLabels.materials}</p>
          <h2 id="lightbox-title">{item.name}</h2>
          <p>{item.description}</p>
          <span className="lightbox__application">{item.application}</span>
          <button className="button button--solid" type="button" onClick={onQuote}>
            {content.nav.quote}
          </button>
        </div>
      </div>
    </div>
  );
}
