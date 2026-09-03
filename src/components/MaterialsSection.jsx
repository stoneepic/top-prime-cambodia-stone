import IconArrow from './IconArrow';

export default function MaterialsSection({ content, onMaterialSelect }) {
  return (
    <section className="section materials-section" id="materials" aria-labelledby="materials-title">
      <div className="container">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-kicker">{content.sectionLabels.materials}</p>
            <h2 id="materials-title">{content.sectionTitles.materials}</h2>
          </div>
        </div>

        <div className="materials-grid">
          {content.materials.map((material, index) => (
            <button
              className="material-card"
              key={material.id}
              type="button"
              onClick={() => onMaterialSelect(material)}
              aria-label={`${material.name}. ${material.application}`}
            >
              <span className="material-card__image-wrap">
                <img src={material.image} alt={material.alt} loading={index === 0 ? 'eager' : 'lazy'} />
                <span className="material-card__open"><IconArrow /></span>
              </span>
              <span className="material-card__meta">
                <span className="material-card__number">0{index + 1}</span>
                <span>
                  <strong>{material.name}</strong>
                  <small>{material.application}</small>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
