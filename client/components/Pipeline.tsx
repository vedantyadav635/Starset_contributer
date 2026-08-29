import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Reveal } from './Reveal';
import { Waveform } from './Waveform';

/* ═══════════════════════════════════════════════════════════════════════════
   Pipeline components.

   Starset's whole story is a chain: a person speaks, the speech is captured,
   the capture is checked, the check produces metadata, the metadata makes a
   dataset. These components draw that chain in three densities.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ───────────────────────────── Signal chain ───────────────────────────── */

export interface ChainStage {
  label: string;
  detail: string;
  icon: LucideIcon;
}

/**
 * Human → Voice → Audio → Data → AI.
 * A compact horizontal chain used on the homepage to state the thesis once.
 */
export const SignalChain: React.FC<{ stages: ChainStage[]; className?: string }> = ({
  stages,
  className,
}) => (
  <ol className={cn('grid gap-px overflow-hidden rounded-lg border border-line bg-line', className)}
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 11rem), 1fr))` }}>
    {stages.map((stage, i) => (
      <Reveal
        as="li"
        key={stage.label}
        delay={i * 80}
        className="relative flex flex-col gap-3 bg-surface p-5"
      >
        <div className="flex items-center justify-between">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-signal-soft text-signal">
            <stage.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="t-meta">{String(i + 1).padStart(2, '0')}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{stage.label}</p>
          <p className="mt-1 text-sm leading-relaxed text-body">{stage.detail}</p>
        </div>
      </Reveal>
    ))}
  </ol>
);

/* ──────────────────────────── Process timeline ─────────────────────────── */

export interface ProcessStep {
  title: string;
  body: string;
  meta?: string;
  icon?: LucideIcon;
}

/**
 * A vertical, numbered pipeline with a spine. Used for the quality pipeline
 * and the "how it works" narrative, where each step needs real explanation.
 */
export const ProcessTimeline: React.FC<{
  steps: ProcessStep[];
  className?: string;
  /** Renders the connecting spine on the left. */
  spine?: boolean;
}> = ({ steps, className, spine = true }) => (
  <ol className={cn('relative', className)}>
    {spine && (
      <span
        aria-hidden="true"
        className="absolute left-[15px] top-3 bottom-3 w-px bg-line md:left-[19px]"
      />
    )}

    {steps.map((step, i) => (
      <Reveal as="li" key={step.title} delay={i * 70} className="relative flex gap-5 pb-9 last:pb-0 md:gap-6">
        <span className="relative z-10 mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border border-line bg-surface font-mono text-[11px] font-medium text-ink md:h-10 md:w-10 md:text-xs">
          {String(i + 1).padStart(2, '0')}
        </span>

        <div className="min-w-0 flex-1 pt-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="t-h4">{step.title}</h3>
            {step.meta && <span className="t-meta">{step.meta}</span>}
          </div>
          <p className="mt-2 max-w-prose text-body">{step.body}</p>
        </div>
      </Reveal>
    ))}
  </ol>
);

/* ──────────────────────────── Contributor flow ─────────────────────────── */

export interface FlowStep {
  title: string;
  body: string;
  icon: LucideIcon;
  meta?: string;
}

/**
 * The contributor journey, rendered as connected cards with a waveform
 * running underneath — discover, record, submit, check, outcome.
 */
export const ContributorFlow: React.FC<{ steps: FlowStep[]; className?: string }> = ({
  steps,
  className,
}) => (
  <div className={cn('relative', className)}>
    <div className="pointer-events-none absolute inset-x-0 top-[3.25rem] hidden lg:block" aria-hidden="true">
      <Waveform seed="contributor-flow" bars={120} height={28} color="var(--line-strong)" />
    </div>

    <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
      {steps.map((step, i) => (
        <Reveal
          as="li"
          key={step.title}
          delay={i * 80}
          className="card card-interactive flex h-full flex-col gap-3 p-5"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-paper-sunk text-ink">
              <step.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="t-meta">{String(i + 1).padStart(2, '0')}</span>
          </div>

          <div className="flex-1">
            <h3 className="text-[0.9375rem] font-semibold text-ink">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-body">{step.body}</p>
          </div>

          {step.meta && <p className="t-meta border-t border-line-faint pt-3">{step.meta}</p>}
        </Reveal>
      ))}
    </ol>
  </div>
);
