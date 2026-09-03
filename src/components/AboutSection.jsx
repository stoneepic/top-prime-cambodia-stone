export default function AboutSection({ content }) {
  return (
    <section className="section about-section" id="about" aria-labelledby="about-title">
      <div className="container about-layout">
        <div className="about-image-wrap">
          <img src={content.about.image} alt={content.about.imageAlt} loading="eager" />
          <span className="about-image-caption">TOP PRIME STONE / CAMBODIA</span>
        </div>
        <div className="about-copy">
          <div className="section-heading">
            <p className="section-kicker">{content.sectionLabels.about}</p>
            <h2 id="about-title">{content.sectionTitles.about}</h2>
          </div>
          <p className="about-copy__lead">{content.about.description}</p>
          {content.about.secondary && <p>{content.about.secondary}</p>}
          <div className="about-address">
            <span>{content.about.addressLabel}</span>
            <address>{content.about.address}</address>
          </div>
        </div>
      </div>
    </section>
  );
}
