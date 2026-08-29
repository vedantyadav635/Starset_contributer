import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import { Container } from './ui/Layout';
import { Reveal } from './Reveal';
import { usePinProgress, usePinStep, useParallax, prefersReducedMotion } from '../hooks/useScroll';

/* ═══════════════════════════════════════════════════════════════════════════
   Scroll storytelling primitives.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────── Line reveal ─────────────────────────── */

/**
 * A headline whose lines rise from behind their own mask, one after another.
 * Each line is a real text node, so the heading still reads as one string to
 * a screen reader and to search engines.
 */
export const LineReveal: React.FC<{
  lines: string[];
  className?: string;
  as?: React.ElementType;
  delay?: number;
}> = ({ lines, className, as: Tag = 'h2', delay = 0 }) => (
  <Reveal delay={delay}>
    <Tag className={cn('reveal-lines', className)}>
      {lines.map((line, i) => (
        <span key={line + i}>
          <span style={{ ['--line-index' as string]: i }}>{line}</span>
        </span>
      ))}
    </Tag>
  </Reveal>
);

/* ─────────────────────────── Parallax ─────────────────────────── */

export const Parallax: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { distance?: number }
> = ({ distance = 40, className, children, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref, distance);
  return <div ref={ref} className={className} {...rest}>{children}</div>;
};

/* ─────────────────────────── Sticky story ─────────────────────────── */

export interface StoryStep {
  label: string;
  caption: string;
}

interface StickyStoryProps {
  eyebrow?: string;
  title: string[];
  steps: StoryStep[];
  /** Receives the 0→1 pin progress. Rendered once and driven by ref. */
  renderVisual: (progress: React.MutableRefObject<number>, step: number) => React.ReactNode;
  /** Extra note printed under the step list. */
  note?: React.ReactNode;
  className?: string;
  tone?: 'paper' | 'sunk';
}

/**
 * A tall section whose inner panel pins while the reader scrolls through it.
 * The left column holds a fixed headline and a stepping caption; the right
 * column holds a visual driven continuously by scroll position.
 */
export const StickyStory: React.FC<StickyStoryProps> = ({
  eyebrow,
  title,
  steps,
  renderVisual,
  note,
  className,
  tone = 'paper',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = usePinProgress(sectionRef);
  const step = usePinStep(sectionRef, steps.length);

  return (
    <section
      ref={sectionRef}
      className={cn('relative', tone === 'sunk' && 'band-sunk', className)}
      style={{ height: `calc(${steps.length} * 88svh + 100svh)` }}
      aria-label={title.join(' ')}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-[var(--nav-h)]">
        <div className="atmos atmos-mesh-soft mask-radial" aria-hidden="true" />
        <div className="atmos atmos-grain" aria-hidden="true" />

        <Container className="relative grid w-full items-center gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-14">
          {/* ── Narration ── */}
          <div className="order-2 lg:order-1">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}

            <LineReveal
              lines={title}
              className="t-h2 mt-4 hidden lg:block"
              as="h2"
            />
            <h2 className="t-h3 mt-3 lg:hidden">{title.join(' ')}</h2>

            {/* Steps: the current one is lit, the rest recede. */}
            <ol className="mt-8 space-y-0 lg:mt-10">
              {steps.map((s, i) => {
                const active = i === step;
                const done = i < step;
                return (
                  <li
                    key={s.label}
                    aria-current={active ? 'step' : undefined}
                    className={cn(
                      'grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-x-3 border-l-2 py-2.5 pl-4 transition-colors duration-500',
                      active ? 'border-signal' : 'border-line',
                    )}
                  >
                    <span
                      className={cn(
                        'font-mono text-[0.6875rem] tracking-widest transition-colors duration-500',
                        active ? 'text-signal' : done ? 'text-muted' : 'text-faint',
                      )}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <span>
                      <span
                        className={cn(
                          'block font-display text-base font-semibold transition-colors duration-500 sm:text-lg',
                          active ? 'text-ink' : 'text-faint',
                        )}
                      >
                        {s.label}
                      </span>
                      <span
                        className={cn(
                          'mt-0.5 block max-w-sm text-sm transition-all duration-500',
                          active ? 'text-body opacity-100' : 'text-faint opacity-0 lg:opacity-60',
                          active ? 'max-h-20' : 'max-h-0 overflow-hidden lg:max-h-20',
                        )}
                      >
                        {s.caption}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>

            {note && <div className="mt-8">{note}</div>}
          </div>

          {/* ── Visual ── */}
          <div className="order-1 h-[38svh] w-full lg:order-2 lg:h-[64svh]">
            {renderVisual(progress, step)}
          </div>
        </Container>
      </div>
    </section>
  );
};

/* ─────────────────────────── Horizontal story ─────────────────────────── */

export interface HorizontalStage {
  label: string;
  caption: string;
  visual: React.ReactNode;
}

/**
 * A pinned section that travels sideways as the reader scrolls down.
 *
 * On touch and narrow screens this degrades to a native scroll-snap strip —
 * hijacking a small screen's scroll to fake a horizontal one is a worse
 * experience than simply letting people swipe.
 */
export const HorizontalStory: React.FC<{
  eyebrow?: string;
  title: string;
  stages: HorizontalStage[];
  className?: string;
}> = ({ eyebrow, title, stages, className }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = usePinProgress(sectionRef);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const decide = () => setPinned(
      window.matchMedia('(min-width: 1024px)').matches && !prefersReducedMotion(),
    );
    decide();
    window.addEventListener('resize', decide);
    return () => window.removeEventListener('resize', decide);
  }, []);

  // Drive the track transform straight from the frame loop, never via state.
  useEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    const tick = () => {
      const distance = track.scrollWidth - track.parentElement!.clientWidth;
      track.style.transform = `translate3d(${-progress.current * Math.max(0, distance)}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pinned, progress]);

  const header = (
    <div className="flex items-end justify-between gap-6">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="t-h2 mt-3">{title}</h2>
      </div>
      {pinned && (
        <span className="t-meta hidden shrink-0 lg:block">Scroll to advance →</span>
      )}
    </div>
  );

  const cards = stages.map((stage, i) => (
    <article
      key={stage.label}
      className={cn(
        'card relative flex flex-col overflow-hidden',
        pinned ? 'h-full w-[min(78vw,30rem)] shrink-0' : 'w-[82vw] shrink-0 snap-center sm:w-[24rem]',
      )}
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="t-meta">{String(i + 1).padStart(2, '0')}</span>
        <span className="t-meta">{i === stages.length - 1 ? 'Output' : 'Stage'}</span>
      </div>

      <div className="flex flex-1 items-center justify-center bg-paper-sunk px-5 py-8">
        {stage.visual}
      </div>

      <div className="px-5 py-5">
        <h3 className="t-h3">{stage.label}</h3>
        <p className="mt-2 text-sm leading-relaxed text-body">{stage.caption}</p>
      </div>
    </article>
  ));

  /* ── Touch / narrow: a swipeable strip ── */
  if (!pinned) {
    return (
      <section ref={sectionRef} className={cn('section relative', className)}>
        <div className="atmos atmos-rules-fine mask-y" aria-hidden="true" />
        <Container className="relative">{header}</Container>

        <div className="scroll-x no-scrollbar mt-10 snap-x snap-mandatory">
          <div className="flex gap-4 px-[var(--gutter)] pb-2">
            {cards}
            <span className="w-[var(--gutter)] shrink-0" aria-hidden="true" />
          </div>
        </div>
      </section>
    );
  }

  /* ── Desktop: pinned, travelling sideways ── */
  return (
    <section
      ref={sectionRef}
      className={cn('relative', className)}
      style={{ height: `calc(${stages.length} * 62svh + 100svh)` }}
      aria-label={title}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-[var(--nav-h)]">
        <div className="atmos atmos-rules-fine mask-y" aria-hidden="true" />

        <Container className="relative">{header}</Container>

        <div className="relative mt-10 overflow-hidden">
          <div
            ref={trackRef}
            className="flex h-[min(30rem,52svh)] gap-5 pl-[var(--gutter)] will-change-transform"
          >
            {cards}
            <span className="w-[30vw] shrink-0" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────── Signal seam ─────────────────────────── */

/**
 * The recurring transition between chapters: the same signal, running on
 * across the join so the page reads as one continuous recording rather than
 * a stack of unrelated white blocks.
 */
type SeamTone = 'paper' | 'sunk';

interface SignalSeamProps {
  from?: SeamTone;
  to?: SeamTone;
  label?: string;
  className?: string;
}

export const SignalSeam = ({
  from = 'paper',
  to = 'sunk',
  label,
  className,
}: SignalSeamProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref, 18);

  const tone = (t: SeamTone) => (t === 'paper' ? 'var(--paper)' : 'var(--paper-sunk)');

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        height: 'clamp(4.5rem, 9vw, 8rem)',
        background: `linear-gradient(to bottom, ${tone(from)}, ${tone(to)})`,
      }}
      aria-hidden="true"
    >
      <div ref={ref} className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <svg
          className="w-[140%] -translate-x-[8%]"
          style={{ height: 64 }}
          viewBox="0 0 1200 64"
          preserveAspectRatio="none"
        >
          <path
            d="M0 32 C 60 12, 120 52, 180 32 S 300 6, 360 32 S 480 58, 540 32 S 660 10, 720 32 S 840 54, 900 32 S 1020 14, 1080 32 S 1160 46, 1200 32"
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {label && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--paper-sunk)] px-3">
          <span className="t-meta">{label}</span>
        </span>
      )}
    </div>
  );
};
