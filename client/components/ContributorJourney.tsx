import React from 'react';
import { Mic, Upload, BadgeCheck, Headphones } from 'lucide-react';
import { cn } from '../lib/utils';
import { Reveal } from './Reveal';
import { speechEnvelope } from './Waveform';

/* ═══════════════════════════════════════════════════════════════════════════
   Contributor journey.

   Four beats, four small purpose-built visuals, four short lines. Deliberately
   not four identical cards — the steps are separated by rules, so the row
   reads as one continuous process rather than a grid of tiles.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Per-step visuals ── */

const ListenGlyph = () => (
  <svg viewBox="0 0 72 48" className="h-12 w-full" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <circle
        key={i}
        cx="36" cy="24" r={9 + i * 8}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="1"
        opacity={0.5 - i * 0.14}
        className="animate-float"
        style={{ animationDelay: `${i * 0.5}s` }}
      />
    ))}
    <circle cx="36" cy="24" r="4" fill="var(--signal)" />
  </svg>
);

const RecordGlyph = () => {
  const bars = speechEnvelope('journey-record', 26);
  return (
    <svg viewBox="0 0 72 48" className="h-12 w-full" aria-hidden="true">
      {bars.map((v, i) => {
        const h = Math.max(2, v * 34);
        return (
          <rect
            key={i}
            x={i * 2.75 + 1}
            y={24 - h / 2}
            width="1.5"
            height={h}
            rx="0.75"
            fill={i < 14 ? 'var(--danger)' : 'var(--line-strong)'}
            opacity={i < 14 ? 0.9 : 0.6}
          />
        );
      })}
    </svg>
  );
};

const SubmitGlyph = () => (
  <svg viewBox="0 0 72 48" className="h-12 w-full" aria-hidden="true">
    <path
      d="M8 40 H64"
      stroke="var(--line-strong)"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    {[20, 36, 52].map((x, i) => (
      <g key={x} className="animate-float" style={{ animationDelay: `${i * 0.35}s` }}>
        <path
          d={`M${x} 34 V14`}
          stroke="var(--signal)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity={0.35 + i * 0.2}
        />
        <path
          d={`M${x - 4} 18 L${x} 13 L${x + 4} 18`}
          fill="none"
          stroke="var(--signal)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.35 + i * 0.2}
        />
      </g>
    ))}
  </svg>
);

const CheckGlyph = () => (
  <svg viewBox="0 0 72 48" className="h-12 w-full" aria-hidden="true">
    <rect x="14" y="10" width="44" height="28" rx="4" fill="none" stroke="var(--line-strong)" strokeWidth="1" />
    <path
      d="M26 24 L33 31 L47 17"
      fill="none"
      stroke="var(--ok)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="draw-in"
      style={{ ['--dash' as string]: 40 }}
    />
  </svg>
);

const STEPS = [
  { icon: Headphones, label: 'Listen', caption: 'Read the brief. Rate and time are on the card.', glyph: <ListenGlyph /> },
  { icon: Mic, label: 'Record', caption: 'In your browser. Retake until it sounds right.', glyph: <RecordGlyph /> },
  { icon: Upload, label: 'Submit', caption: 'Consent, then upload. One tap.', glyph: <SubmitGlyph /> },
  { icon: BadgeCheck, label: 'Get paid', caption: 'Reviewed, then settled to your UPI.', glyph: <CheckGlyph /> },
];

export const ContributorJourney: React.FC<{ className?: string }> = ({ className }) => (
  <ol className={cn('grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0', className)}>
    {STEPS.map((step, i) => (
      <Reveal
        as="li"
        key={step.label}
        delay={i * 110}
        className={cn(
          'relative pt-6 lg:px-7 lg:pt-0',
          'lg:border-l lg:border-line lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0',
        )}
      >
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] tracking-widest text-signal">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="font-display text-xl font-semibold text-ink">{step.label}</h3>
        </div>

        <div className="mt-5">{step.glyph}</div>

        <p className="mt-5 max-w-[22ch] text-sm leading-relaxed text-body">{step.caption}</p>
      </Reveal>
    ))}
  </ol>
);
