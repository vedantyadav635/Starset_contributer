import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { LogoLockup } from './Logo';
import { Button } from './Button';
import { CookieConsent } from './CookieConsent';
import { ThemeToggle } from './ThemeToggle';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { Container } from './ui/Layout';
import { cn } from '../lib/utils';
import { useSmoothScroll } from '../hooks/useScroll';

export type PublicPageType =
  | 'home'
  | 'marketplace'
  | 'about'
  | 'ai-training-guide'
  | 'careers'
  | 'blog'
  | 'contact'
  | 'terms'
  | 'privacy'
  | 'cookies'
  | 'data-processing';

/* ═══════════════════════════════════════════════════════════════════════════
   Per-page SEO.

   Every page gets its own title, description and canonical. Copy describes
   what Starset actually does — no invented user counts, ratings or earnings.
   ═══════════════════════════════════════════════════════════════════════════ */

interface SeoEntry {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
}

const SEO_CONFIG: Record<PublicPageType, SeoEntry> = {
  home: {
    title: 'Starset Intelligence — India\'s Multilingual Voice Data Engine for AI',
    description:
      'Starset Intelligence collects high-quality multilingual voice datasets across 11 Indian languages for speech, voice and conversational AI. Contributors record and earn; AI teams license validated, structured audio data.',
    keywords:
      'Starset Intelligence, Indian voice datasets, Hindi audio dataset, Hinglish speech data, multilingual voice data, emotion-labeled voice AI, Indian accent speech data, data contribution India, audio datasets for AI, speech corpus India, voice data collection, ASR training data, TTS dataset India',
    canonicalPath: '/',
  },
  marketplace: {
    title: 'Voice & Speech Datasets for AI — Starset Intelligence',
    description:
      'Browse and license human voice datasets by language, dialect and recording style. Hindi, Hinglish, Tamil, Telugu, Bengali and 8 more Indian languages. Request access or commission a custom collection.',
    keywords:
      'speech dataset marketplace, buy voice dataset India, ASR training data, TTS dataset, multilingual speech corpus, Indian language audio data, custom speech collection, Hindi speech dataset, Hinglish dataset, voice data licensing',
    canonicalPath: '/marketplace',
  },
  about: {
    title: 'About Starset Intelligence — Multilingual Audio Data Company',
    description:
      'Starset Intelligence is an Indian data infrastructure company building the most comprehensive multilingual voice data engine. Real speakers, structured datasets, dialect-level granularity.',
    keywords:
      'about Starset Intelligence, audio data company India, speech data infrastructure, AI data company India, multilingual voice data company, Indian startup AI',
    canonicalPath: '/about',
  },
  'ai-training-guide': {
    title: 'How AI Models Learn from Human Audio — Starset Intelligence',
    description:
      'A plain explanation of how speech recognition, voice synthesis and conversational AI models are trained, and where human audio recordings fit in the process.',
    keywords:
      'how speech AI is trained, ASR training explained, TTS training data, human in the loop audio, speech model training, voice AI training process',
    canonicalPath: '/ai-training-guide',
  },
  careers: {
    title: 'Careers at Starset Intelligence — Join the Team',
    description:
      'Open roles across engineering, data operations and language quality at Starset Intelligence. Help build India\'s multilingual voice data infrastructure.',
    keywords:
      'Starset Intelligence careers, audio data jobs India, data operations jobs, AI data company hiring, speech data jobs',
    canonicalPath: '/careers',
  },
  blog: {
    title: 'Notes & Insights — Starset Intelligence',
    description:
      'Working notes on audio data quality, collection methodology, multilingual dataset challenges and platform updates from the Starset Intelligence team.',
    keywords:
      'audio data blog, speech data quality, Starset Intelligence updates, multilingual dataset insights, voice data methodology',
    canonicalPath: '/blog',
  },
  contact: {
    title: 'Contact Starset Intelligence — Dataset Licensing & Support',
    description:
      'Reach Starset Intelligence: contributor support for tasks and payouts, or the data team for voice dataset licensing, custom collections and partnerships.',
    keywords:
      'contact Starset Intelligence, dataset request, contributor support, audio data enquiry, voice dataset licensing, custom dataset India',
    canonicalPath: '/contact',
  },
  terms: {
    title: 'Terms of Service — Starset Intelligence',
    description: 'The agreement covering use of the Starset Intelligence platform, audio contributions and compensation.',
    keywords: 'Starset Intelligence terms of service, contributor agreement, audio data terms',
    canonicalPath: '/terms',
  },
  privacy: {
    title: 'Privacy Policy — Starset Intelligence',
    description: 'What personal data Starset Intelligence collects, how it is used, and how audio recordings are handled and protected.',
    keywords: 'Starset Intelligence privacy policy, audio data privacy, contributor data protection, voice data security',
    canonicalPath: '/privacy',
  },
  cookies: {
    title: 'Cookie Policy — Starset Intelligence',
    description: 'The cookies Starset Intelligence sets, what each is for, and how to manage or refuse optional ones.',
    keywords: 'Starset Intelligence cookie policy, cookies',
    canonicalPath: '/cookies',
  },
  'data-processing': {
    title: 'Data Processing Agreement — Starset Intelligence',
    description: 'How submitted audio data is processed, de-identified, stored and shared with sub-processors at Starset Intelligence.',
    keywords: 'Starset Intelligence DPA, data processing agreement, audio data processing, voice data handling',
    canonicalPath: '/data-processing',
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   Navigation
   ═══════════════════════════════════════════════════════════════════════════ */

interface NavItem {
  label: string;
  page: PublicPageType;
  href: string;
  description?: string;
}

const PRIMARY_NAV: NavItem[] = [
  { label: 'Marketplace', page: 'marketplace', href: '/marketplace' },
  { label: 'About', page: 'about', href: '/about' },
];

const RESOURCE_NAV: NavItem[] = [
  { label: 'How AI learns', page: 'ai-training-guide', href: '/ai-training-guide', description: 'Where human audio fits in training' },
  { label: 'Notes', page: 'blog', href: '/blog', description: 'Methodology and platform updates' },
];

const RESOURCE_PAGES = new Set<PublicPageType>(RESOURCE_NAV.map((i) => i.page));

interface PublicLayoutProps {
  children: React.ReactNode;
  currentPage: PublicPageType;
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
  /** Signup handler; falls back to the sign-in handler when not supplied. */
  onStartSignup?: () => void;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
  onEnterApp,
  onStartSignup,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);

  const startSignup = onStartSignup ?? onEnterApp;
  const seo = SEO_CONFIG[currentPage] ?? SEO_CONFIG.home;

  // Eased wheel scrolling across the public site. Suspended while the mobile
  // sheet is open, since the page behind it is locked anyway.
  useSmoothScroll(!mobileOpen);

  // Solidify the bar once the page moves. The nav never hides — a nav that
  // disappears on scroll is a nav you cannot rely on.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll behind the mobile sheet.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [mobileOpen]);

  // Close overlays on Escape and on outside click.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMobileOpen(false);
      setResourcesOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  const go = (e: React.MouseEvent, page: PublicPageType) => {
    e.preventDefault();
    setMobileOpen(false);
    setResourcesOpen(false);
    onNavigate(page);
  };

  const navLinkClass = (active: boolean) =>
    cn(
      'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
      active ? 'text-ink' : 'text-body hover:text-ink',
    );

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonicalPath={seo.canonicalPath}
        structuredData={currentPage === 'marketplace' ? {
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          'name': 'Starset Intelligence Multilingual Voice Dataset Collection',
          'description': 'A growing collection of high-quality human voice datasets across 11 Indian languages including Hindi, Hinglish, Tamil, Telugu, Bengali, Marathi, Gujarati, Punjabi, Kannada, Malayalam and Indian-accented English. Recordings include read speech, spontaneous speech, voice commands and conversational audio.',
          'keywords': ['Indian voice dataset', 'Hindi speech data', 'Hinglish dataset', 'multilingual audio corpus', 'ASR training data India', 'TTS dataset', 'Indian accent speech', 'dialect-tagged audio'],
          'inLanguage': ['en-IN', 'hi-IN', 'bn-IN', 'pa-IN', 'gu-IN', 'mr-IN', 'ta-IN', 'te-IN', 'kn-IN', 'ml-IN'],
          'spatialCoverage': { '@type': 'Place', 'name': 'India' },
          'creator': {
            '@type': 'Organization',
            'name': 'Starset Intelligence',
            'url': 'https://www.starset.online/',
          },
          'license': 'https://www.starset.online/terms',
          'url': 'https://www.starset.online/marketplace',
          'variableMeasured': [
            { '@type': 'PropertyValue', 'name': 'Audio format', 'value': 'WAV / WebM' },
            { '@type': 'PropertyValue', 'name': 'Sample rate', 'value': '16 kHz – 48 kHz' },
            { '@type': 'PropertyValue', 'name': 'Languages', 'value': '11 Indian languages' },
          ],
        } : undefined}
      />

      <a href="#main" className="skip-link">Skip to content</a>

      {/* ───────────────────────── Navigation ───────────────────────── */}
      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-colors duration-200',
          scrolled
            ? 'border-line bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-md'
            : 'border-transparent bg-transparent',
        )}
      >
        <Container className="flex items-center justify-between gap-4" style={{ height: 'var(--nav-h)' }}>
          <a href="/" onClick={(e) => go(e, 'home')} className="flex-none" aria-label="Starset home">
            <LogoLockup markClassName="h-8 w-8" />
          </a>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {PRIMARY_NAV.map((item) => {
              const active = currentPage === item.page;
              return (
                <a
                  key={item.page}
                  href={item.href}
                  onClick={(e) => go(e, item.page)}
                  aria-current={active ? 'page' : undefined}
                  className={navLinkClass(active)}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-signal" aria-hidden="true" />
                  )}
                </a>
              );
            })}

            <div className="relative" ref={resourcesRef}>
              <button
                type="button"
                aria-expanded={resourcesOpen}
                aria-haspopup="true"
                onClick={() => setResourcesOpen((v) => !v)}
                className={cn(navLinkClass(RESOURCE_PAGES.has(currentPage)), 'inline-flex items-center gap-1')}
              >
                Resources
                <ChevronDown
                  className={cn('h-3.5 w-3.5 transition-transform', resourcesOpen && 'rotate-180')}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>

              {resourcesOpen && (
                <div className="animate-slide-down absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-lg border border-line bg-surface shadow-lg">
                  <ul className="p-1.5">
                    {RESOURCE_NAV.map((item) => (
                      <li key={item.page}>
                        <a
                          href={item.href}
                          onClick={(e) => go(e, item.page)}
                          className="block rounded-md px-3 py-2.5 transition-colors hover:bg-paper-sunk"
                        >
                          <span className="block text-sm font-medium text-ink">{item.label}</span>
                          {item.description && (
                            <span className="mt-0.5 block text-xs text-muted">{item.description}</span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={onEnterApp}>Sign in</Button>
            <Button size="sm" onClick={startSignup}>Get started</Button>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-line-strong"
            >
              {mobileOpen
                ? <X className="h-4.5 w-4.5" strokeWidth={1.75} aria-hidden="true" />
                : <Menu className="h-4.5 w-4.5" strokeWidth={1.75} aria-hidden="true" />}
            </button>
          </div>
        </Container>

        {/* Mobile sheet */}
        {mobileOpen && (
          <div
            id="mobile-nav"
            className="animate-slide-down fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-line bg-paper lg:hidden"
            style={{ top: 'var(--nav-h)' }}
          >
            <Container className="flex min-h-full flex-col py-6">
              <nav aria-label="Mobile" className="flex flex-col">
                {PRIMARY_NAV.map((item) => (
                  <a
                    key={item.page}
                    href={item.href}
                    onClick={(e) => go(e, item.page)}
                    aria-current={currentPage === item.page ? 'page' : undefined}
                    className={cn(
                      'border-b border-line-faint py-4 text-lg font-medium transition-colors',
                      currentPage === item.page ? 'text-signal' : 'text-ink',
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <p className="t-meta mt-8">Resources</p>
              <nav aria-label="Resources" className="mt-3 flex flex-col">
                {RESOURCE_NAV.map((item) => (
                  <a
                    key={item.page}
                    href={item.href}
                    onClick={(e) => go(e, item.page)}
                    className={cn(
                      'border-b border-line-faint py-3 text-[0.9375rem] transition-colors',
                      currentPage === item.page ? 'text-signal' : 'text-body',
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3 pb-8 pt-10">
                <Button size="lg" block onClick={() => { setMobileOpen(false); startSignup(); }}>
                  Get started
                </Button>
                <Button size="lg" variant="secondary" block onClick={() => { setMobileOpen(false); onEnterApp(); }}>
                  Sign in
                </Button>
              </div>
            </Container>
          </div>
        )}
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <Footer onNavigate={onNavigate} />
      <CookieConsent />
    </div>
  );
};
