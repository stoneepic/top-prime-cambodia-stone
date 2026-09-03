import { describe, expect, it } from 'vitest';
import { siteContent } from '../data/siteContent';

describe('site content contract', () => {
  it('contains both supported languages', () => {
    expect(Object.keys(siteContent)).toEqual(expect.arrayContaining(['en', 'zh']));
  });

  it('keeps the bilingual material catalog aligned', () => {
    expect(siteContent.en.materials).toHaveLength(4);
    expect(siteContent.zh.materials).toHaveLength(4);
    expect(siteContent.en.materials.map(({ id }) => id)).toEqual(
      siteContent.zh.materials.map(({ id }) => id),
    );
  });

  it('publishes the verified contact details', () => {
    expect(siteContent.en.contact.details.phone.value).toBe('+86 13806008760');
    expect(siteContent.en.contact.details.phone.href).toBe('tel:+8613806008760');
    expect(siteContent.en.contact.details.email.value).toBe('sales@topprimestone.com');
    expect(siteContent.en.contact.details.email.href).toBe('mailto:sales@topprimestone.com');
    expect(siteContent.en.contact.details.whatsapp.value).toBe('+86 13806008760');
    expect(siteContent.en.contact.details.whatsapp.href).toBe('https://wa.me/8613806008760');
    expect(siteContent.zh.contact.details.email.value).toBe('sales@topprimestone.com');
  });
});
