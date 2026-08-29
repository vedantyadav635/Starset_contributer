import React from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';
import type { PublicPageType } from './PublicLayout';
import { LogoLockup } from './Logo';
import { Container } from './ui/Layout';
import { WaveLine } from './Waveform';

interface FooterProps {
  onNavigate: (page: PublicPageType) => void;
}

type Link = { label: string; page: PublicPageType; href: string };

const COLUMNS: { heading: string; links: Link[] }[] = [
  {
    heading: 'Platform',
    links: [
      { label: 'Marketplace', page: 'marketplace', href: '/marketplace' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', page: 'about', href: '/about' },
      { label: 'Careers', page: 'careers', href: '/careers' },
      { label: 'Notes', page: 'blog', href: '/blog' },
      { label: 'Contact', page: 'contact', href: '/contact' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'How AI models learn', page: 'ai-training-guide', href: '/ai-training-guide' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms of Service', page: 'terms', href: '/terms' },
      { label: 'Privacy Policy', page: 'privacy', href: '/privacy' },
      { label: 'Cookie Policy', page: 'cookies', href: '/cookies' },
      { label: 'Data Processing', page: 'data-processing', href: '/data-processing' },
    ],
  },
];

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const go = (e: React.MouseEvent, page: PublicPageType) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <footer className="relative border-t border-line bg-paper-sunk">
      {/* A quiet signal line marks the seam between page and footer. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -translate-y-1/2 opacity-40" aria-hidden="true">
        <WaveLine seed="footer-seam" points={200} height={22} strokeWidth={1} color="var(--line-strong)" />
      </div>

      <Container className="relative">
        <div className="grid gap-10 py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16 lg:py-16">
          {/* Brand */}
          <div>
            <a href="/" onClick={(e) => go(e, 'home')} className="inline-flex">
              <LogoLockup markClassName="h-9 w-9" />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-body">
              Starset collects human audio from real speakers and prepares it as structured,
              validated data for speech and voice AI.
            </p>

            <div className="mt-6 flex gap-2">
              <a
                href="mailto:hello@starset.ai"
                aria-label="Email Starset"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com/company/starsetai"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Starset on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <Linkedin className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </a>
              <a
                href="https://github.com/vedantyadav635/Starset_contributer"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Starset on GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <Github className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="t-meta">{column.heading}</h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.page}>
                      <a
                        href={link.href}
                        onClick={(e) => go(e, link.page)}
                        className="text-sm text-body transition-colors hover:text-ink"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Starset. All rights reserved.
          </p>
          <p className="t-meta">Human audio · Structured data · Built for AI</p>
        </div>
      </Container>
    </footer>
  );
};
