import React from 'react';
import { cn } from '../lib/utils';
import { Container } from './ui/Layout';
import { WaveLine } from './Waveform';

/**
 * The closing call to action. One dark band per page, used deliberately for
 * contrast against the light body — never as decoration.
 */
export const CTASection: React.FC<{
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  note?: React.ReactNode;
  className?: string;
}> = ({ eyebrow, title, body, primary, secondary, note, className }) => (
  <section className={cn('band-inverse relative overflow-hidden', className)}>
    {/* Decorative trace spans the full viewport; the content stays on grid. */}
    <div className="pointer-events-none absolute inset-x-0 bottom-0 opacity-25" aria-hidden="true">
      <WaveLine seed="cta-trace" points={160} height={140} color="var(--ink-on-inverse)" filled />
    </div>

    <Container className="relative section">
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="eyebrow eyebrow-plain mb-4 block text-[color:var(--ink-on-inverse)] opacity-60">
            {eyebrow}
          </span>
        )}
        <h2 className="t-h2">{title}</h2>
        {body && (
          <p className="mt-4 text-[1.0625rem] leading-relaxed opacity-75 sm:text-lg">{body}</p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {primary}
          {secondary}
        </div>

        {note && <p className="mt-6 text-sm opacity-55">{note}</p>}
      </div>
    </Container>
  </section>
);
