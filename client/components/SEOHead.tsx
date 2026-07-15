import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: string;
  ogImage?: string;
  noindex?: boolean;
  structuredData?: object;
}

const BASE_URL = 'https://www.starset.online';
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;
const SITE_NAME = 'Starset Intelligence';

/**
 * SEOHead — sets dynamic document title, meta description, canonical URL,
 * Open Graph tags, Twitter Cards, and optional JSON-LD structured data
 * for each page. Runs as a side-effect so it works with client-side routing.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalPath = '/',
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  noindex = false,
  structuredData,
}) => {
  useEffect(() => {
    // ── Title ──
    document.title = title;

    // ── Helper: upsert a <meta> tag ──
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // ── Standard meta ──
    setMeta('name', 'description', description);
    if (keywords) setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // ── Canonical ──
    const canonicalUrl = `${BASE_URL}${canonicalPath}`;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);

    // ── Open Graph ──
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:locale', 'en_US');

    // ── Twitter Card ──
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);
    setMeta('name', 'twitter:url', canonicalUrl);
    setMeta('name', 'twitter:site', '@starsetai');

    // ── JSON-LD Structured Data ──
    // Remove old dynamic LD block (if any) then inject new one
    const existingLd = document.getElementById('seo-head-ld');
    if (existingLd) existingLd.remove();

    if (structuredData) {
      const script = document.createElement('script');
      script.id = 'seo-head-ld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, canonicalPath, ogType, ogImage, noindex, structuredData]);

  return null; // This component renders nothing — purely side-effects
};
