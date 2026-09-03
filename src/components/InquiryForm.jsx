import { useState } from 'react';

const FORM_ENDPOINT = 'https://formspree.io/f/mzebgknv';

const initialValues = {
  name: '',
  company: '',
  email: '',
  phone: '',
  material: '',
  message: '',
};

export default function InquiryForm({ content, onSubmitted }) {
  const [values, setValues] = useState(initialValues);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) return;
    setSending(true);
    setError(false);
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
      onSubmitted();
      setValues(initialValues);
    } catch (err) {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="inquiry-form" onSubmit={handleSubmit} noValidate={false}>
      <div className="form-grid">
        <label>
          <span>{content.form.name} <em>*</em></span>
          <input name="name" value={values.name} onChange={handleChange} required autoComplete="name" />
        </label>
        <label>
          <span>{content.form.company}</span>
          <input name="company" value={values.company} onChange={handleChange} autoComplete="organization" />
        </label>
        <label>
          <span>{content.form.email} <em>*</em></span>
          <input name="email" type="email" value={values.email} onChange={handleChange} required autoComplete="email" />
        </label>
        <label>
          <span>{content.form.phone}</span>
          <input name="phone" value={values.phone} onChange={handleChange} autoComplete="tel" />
        </label>
      </div>
      <label>
        <span>{content.form.material}</span>
        <select name="material" value={values.material} onChange={handleChange}>
          <option value="">{content.form.materialPlaceholder}</option>
          {content.form.options.map((option) => <option value={option} key={option}>{option}</option>)}
        </select>
      </label>
      <label>
        <span>{content.form.message}</span>
        <textarea name="message" value={values.message} onChange={handleChange} placeholder={content.form.messagePlaceholder} rows="5" />
      </label>
      <button className="button button--solid form-submit" type="submit" disabled={sending}>
        {sending ? content.form.sending : content.form.submit}
      </button>
      {error && <p className="form-error" role="alert">{content.form.error}</p>}
    </form>
  );
}

