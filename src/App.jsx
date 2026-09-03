import { useCallback, useEffect, useState } from 'react';
import { siteContent } from './data/siteContent';
import Header from './components/Header';
import Hero from './components/Hero';
import Lightbox from './components/Lightbox';
import MaterialsSection from './components/MaterialsSection';
import ProductShowcase from './components/ProductShowcase';
import TrackSection from './components/TrackSection';
import QuarrySection from './components/QuarrySection';
import FactorySection from './components/FactorySection';
import VideosSection from './components/VideosSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import AdminPanel from './components/AdminPanel';

const LOCAL_OVERRIDE_KEY = 'tps-content-override';
const ADMIN_HASH = '#/admin';

export function mergeContent(base, override) {
  if (!override || typeof override !== 'object') return base;
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = mergeContent(base[key] || {}, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export default function App() {
  const [language, setLanguage] = useState('en');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contentStore, setContentStore] = useState(siteContent);
  const [isAdmin, setIsAdmin] = useState(window.location.hash === ADMIN_HASH);

  // Load /content.json (cloud-edited content) merged over the bundled defaults,
  // then apply any local preview override.
  useEffect(() => {
    let cancelled = false;
    fetch('/content.json')
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null)
      .then((remote) => {
        if (cancelled) return;
        let merged = remote ? mergeContent(siteContent, remote) : siteContent;
        try {
          const local = JSON.parse(localStorage.getItem(LOCAL_OVERRIDE_KEY) || 'null');
          if (local) merged = mergeContent(merged, local);
        } catch {
          /* ignore malformed local override */
        }
        setContentStore(merged);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onHash = () => setIsAdmin(window.location.hash === ADMIN_HASH);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.classList.toggle('lang-zh', language === 'zh');
  }, [language]);

  const content = contentStore[language];

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleQuote = useCallback(() => {
    setSelectedMaterial(null);
    scrollTo('contact');
  }, [scrollTo]);

  if (isAdmin) {
    return <AdminPanel contentStore={contentStore} onApplyLocal={(next) => setContentStore(next)} />;
  }

  return (
    <>
      <Header
        content={content}
        language={language}
        onLanguageChange={setLanguage}
        isMenuOpen={isMenuOpen}
        onMenuToggle={setIsMenuOpen}
        onQuoteClick={handleQuote}
      />
      <main>
        <Hero content={content} onExplore={() => scrollTo('materials')} onQuote={handleQuote} />
        <MaterialsSection content={content} onMaterialSelect={setSelectedMaterial} />
        <ProductShowcase content={content} />
        <QuarrySection content={content} index="03" />
        <FactorySection content={content} />
        <VideosSection content={content} />
        <AboutSection content={content} />
        <ContactSection content={content} />
      </main>
      <Lightbox item={selectedMaterial} content={content} onClose={() => setSelectedMaterial(null)} onQuote={handleQuote} />
    </>
  );
}
