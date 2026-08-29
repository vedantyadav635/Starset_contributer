import React from 'react';
import { cn } from '../lib/utils';
import { Container, Eyebrow } from './ui/Layout';
import { Reveal } from './Reveal';
import { LineReveal, Parallax } from './Story';
import { Waveform } from './Waveform';

/* ═══════════════════════════════════════════════════════════════════════════
   Page hero.

   Every secondary page opens the same way: an eyebrow, a headline that rises
   line by line, one short line of support — and a metadata rail on the right
   that drifts a little against the scroll, so a wide monitor never shows half
   a screen of nothing.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface HeroFact {
  label: string;
  value: React.ReactNode;
  hint?: string;
}

interface PageHeroProps {
  eyebrow: string;
  /** Headline, split into the lines you want revealed in sequence. */
  title: string | string[];
  lede?: React.ReactNode;
  actions?: React.ReactNode;
  facts?: HeroFact[];
  factsLabel?: string;
  /** Replaces the facts rail entirely. */
  aside?: React.ReactNode;
  /** Depth behind the hero. */
  atmosphere?: 'mesh' | 'rules' | 'points' | 'none';
  children?: React.ReactNode;
  className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  lede,
  actions,
  facts,
  factsLabel = 'At a glance',
  aside,
  atmosphere = 'mesh',
  children,
  className,
}) => {
  const lines = Array.isArray(title) ? title : [title];

  const rail = aside ?? (facts && facts.length > 0 ? (
    <div className="card overflow-hidden">
      <div className="border-b border-line px-5 py-3">
        <span className="t-meta">{factsLabel}</span>
      </div>

      <dl className="divide-y divide-line-faint">
        {facts.map((fact) => (
          <div key={fact.label} className="px-5 py-3.5">
            <dt className="t-meta">{fact.label}</dt>
            <dd className="mt-1 text-sm font-medium text-ink">{fact.value}</dd>
            {fact.hint && <dd className="mt-0.5 text-xs text-muted">{fact.hint}</dd>}
          </div>
        ))}
      </dl>

      <div className="border-t border-line bg-paper-sunk px-5 py-3.5">
        <Waveform seed={eyebrow} bars={52} height={20} color="var(--line-strong)" />
      </div>
    </div>
  ) : null);

  return (
    <section className={cn('relative overflow-hidden border-b border-line', className)}>
      {atmosphere !== 'none' && (
        <>
          <div
            className={cn(
              'atmos',
              atmosphere === 'mesh' && 'atmos-mesh mask-radial',
              atmosphere === 'rules' && 'atmos-rules mask-radial',
              atmosphere === 'points' && 'atmos-points mask-b opacity-70',
            )}
            aria-hidden="true"
          />
          <div className="atmos atmos-grain" aria-hidden="true" />
        </>
      )}

      <Container className="relative pb-14 pt-14 lg:pb-20 lg:pt-20">
        <div
          className={cn(
            'grid items-start gap-10',
            rail && 'lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16',
          )}
        >
          <div className={cn(!rail && 'max-w-3xl')}>
            <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>

            <LineReveal as="h1" lines={lines} className="t-h1 mt-5" delay={70} />

            {lede && (
              <Reveal delay={220}>
                <p className="t-lead mt-5 max-w-xl">{lede}</p>
              </Reveal>
            )}

            {actions && (
              <Reveal delay={300}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>
              </Reveal>
            )}
          </div>

          {rail && (
            <Parallax distance={18} className="lg:pt-2">
              <Reveal delay={160}>{rail}</Reveal>
            </Parallax>
          )}
        </div>

        {children && <div className="mt-12">{children}</div>}
      </Container>
    </section>
  );
};
