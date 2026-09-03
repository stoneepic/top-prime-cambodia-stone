import IconArrow from './IconArrow';

export default function TrackSection({ content, sectionKey, sectionId, index }) {
  const items = content[sectionKey];
  const kicker = content.sectionLabels[sectionKey];
  const title = content.sectionTitles[sectionKey];
  const titleId = `${sectionId}-title`;

  return (
    <section className="section process-section" id={sectionId} aria-labelledby={titleId}>
      <div className="container">
        <div className="section-heading section-heading--split section-heading--light">
          <div>
            <p className="section-kicker">{kicker}</p>
            <h2 id={titleId}>{title}</h2>
          </div>
        </div>

        <div className="process-track">
          {items.map((step, i) => (
            <article className="process-step" key={step.id}>
              <div className="process-step__image-wrap">
                <img src={step.image} alt={step.alt} loading="lazy" />
                {i < items.length - 1 && <span className="process-step__arrow"><IconArrow /></span>}
              </div>
              <div className="process-step__meta">
                <span>{step.label}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
