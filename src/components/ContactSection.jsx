import { useState } from 'react';
import InquiryForm from './InquiryForm';

export default function ContactSection({ content, onSubmitted }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitted = () => {
    setSubmitted(true);
    onSubmitted?.();
  };

  return (
    <section className="section contact-section" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-kicker">{content.sectionLabels.contact}</p>
            <h2 id="contact-title">{content.sectionTitles.contact}</h2>
          </div>
        </div>

        <div className="contact-grid">
          <div className="contact-intro">
            <p className="contact-intro__lead">{content.contact.description}</p>
            <div className="contact-details">
              {Object.values(content.contact.details).map((detail) => (
                <div className="contact-detail" key={detail.label}>
                  <span>{detail.label}</span>
                  {detail.href ? (
                    <a
                      className="contact-detail__link"
                      href={detail.href}
                      {...(detail.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <strong>{detail.value}</strong>
                  )}
                </div>
              ))}
            </div>
            <div className="contact-detail contact-detail--address">
              <span>{content.contact.addressLabel}</span>
              <address>{content.contact.address}</address>
            </div>
            <div className="contact-detail">
              <span>{content.contact.websiteLabel}</span>
              <a
                className="contact-detail__link"
                href={content.contact.website.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.contact.website.value}
              </a>
            </div>
          </div>
          <div className="contact-form-wrap">
            {submitted && <p className="form-success" role="status">{content.form.success}</p>}
            <InquiryForm content={content} onSubmitted={handleSubmitted} />
          </div>
        </div>
      </div>
    </section>
  );
}
