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

export default function VideosSection({ content }) {
  const videos = content.videos || [];
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(videos.length <= 1);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.video-slide');
    const amount = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
    setTimeout(updateEdges, 320);
  };

  return (
    <section className="section videos-section" id="videos" aria-labelledby="videos-title">
      <div className="container">
        <div className="section-heading section-heading--split section-heading--light">
          <div>
            <p className="section-kicker">{content.sectionLabels.videos}</p>
            <h2 id="videos-title">{content.sectionTitles.videos}</h2>
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
          className="videos-track"
          ref={trackRef}
          onScroll={updateEdges}
          tabIndex={0}
          role="region"
          aria-label="Video slides"
        >
          {videos.map((video, i) => (
            <figure className="video-slide" key={video.id}>
              <div className="video-slide__frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <figcaption>
                <span className="video-slide__index">{String(i + 1).padStart(2, '0')}</span>
                <span>{video.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="quarry-hint">{content.videosHint}</p>
      </div>
    </section>
  );
}
