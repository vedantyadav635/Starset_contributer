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
    title: 'Starset — Human audio data for AI',
    description:
      'Starset collects high-quality human audio and prepares it as structured, validated datasets for speech, voice and conversational AI.',
    keywords:
      'human audio data, speech datasets, voice AI training data, audio data collection, conversational AI data, Starset',
    canonicalPath: '/',
  },
  marketplace: {
    title: 'Speech dataset marketplace — Starset',
    description:
      'Browse human audio collections by language, dialect, prompt style and recording environment. Request access, or commission a collection that does not exist yet.',
    keywords:
      'speech dataset marketplace, buy audio dataset, ASR training data, TTS dataset, multilingual speech corpus, Indian language audio data, custom speech collection',
    canonicalPath: '/marketplace',
  },
  about: {
    title: 'About Starset',
    description:
      'Why Starset exists, what is wrong with how audio data is usually collected, and what we are building instead.',
    keywords: 'about Starset, audio data company, speech data infrastructure, AI data company India',
    canonicalPath: '/about',
  },
  'ai-training-guide': {
    title: 'How AI models learn from human audio — Starset',
    description:
      'A plain explanation of how speech and voice models are trained, and where human recordings fit in the process.',
    keywords: 'how speech AI is trained, ASR training explained, TTS training data, human in the loop audio',
    canonicalPath: '/ai-training-guide',
  },
  careers: {
    title: 'Careers at Starset',
    description: 'Open-ended roles across engineering, data operations and language quality at Starset.',
    keywords: 'Starset careers, audio data jobs, data operations jobs, AI data company hiring',
    canonicalPath: '/careers',
  },
  blog: {
    title: 'Notes — Starset',
    description: 'Working notes on audio data quality, collection methodology and platform changes.',
    keywords: 'audio data blog, speech data quality notes, Starset updates',
    canonicalPath: '/blog',
  },
  contact: {
    title: 'Contact Starset',
    description:
      'Two ways in: contributor support for help with tasks and payouts, and the data team for dataset requests.',
    keywords: 'contact Starset, dataset request, contributor support, audio data enquiry',
    canonicalPath: '/contact',
  },
  terms: {
    title: 'Terms of Service — Starset',
    description: 'The agreement covering use of the Starset platform, contributions and compensation.',
    keywords: 'Starset terms of service, contributor agreement',
    canonicalPath: '/terms',
  },
  privacy: {
    title: 'Privacy Policy — Starset',
    description: 'What personal data Starset collects, how it is used, and how recordings are handled.',
    keywords: 'Starset privacy policy, audio data privacy, contributor data protection',
    canonicalPath: '/privacy',
  },
  cookies: {
    title: 'Cookie Policy — Starset',
    description: 'The cookies Starset sets, what each is for, and how to refuse the optional ones.',
    keywords: 'Starset cookie policy, cookies',
    canonicalPath: '/cookies',
  },
  'data-processing': {
    title: 'Data Processing Agreement — Starset',
    description: 'How submitted data is processed, de-identified, stored and shared with sub-processors.',
    keywords: 'Starset DPA, data processing agreement, audio data processing',
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
