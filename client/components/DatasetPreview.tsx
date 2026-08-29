import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Waveform } from './Waveform';

/* ═══════════════════════════════════════════════════════════════════════════
   Dataset presentation.

   These components describe data the way a data team expects to see it —
   a name, a spec table, and a visible sample. Anything illustrative is
   labelled as an example, never dressed up as a shipped dataset.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface DatasetSpec {
  label: string;
  value: string;
}

export interface DatasetRecord {
  id: string;
  name: string;
  summary?: string;
  specs: DatasetSpec[];
  seed?: string;
}

export const DatasetCard: React.FC<{
  dataset: DatasetRecord;
  className?: string;
  /** Marks the card as illustrative rather than a real catalogue entry. */
  exampleLabel?: string;
}> = ({ dataset, className, exampleLabel = 'Example structure' }) => (
  <article className={cn('card card-interactive flex h-full flex-col overflow-hidden', className)}>
    <header className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 border-b border-line px-5 py-4">
      <div className="min-w-0">
        <p className="t-meta">Dataset</p>
        <h3 className="mt-1 truncate text-[0.9375rem] font-semibold text-ink">{dataset.name}</h3>
      </div>
      <span className="tag flex-none">{exampleLabel}</span>
    </header>

    <div className="border-b border-line bg-paper-sunk px-5 py-4">
      <Waveform seed={dataset.seed ?? dataset.id} bars={64} height={36} />
      <div className="mt-2 flex items-center justify-between">
        <span className="t-meta">00:00</span>
        <span className="t-meta">Sample waveform</span>
        <span className="t-meta">00:12</span>
      </div>
    </div>

    <div className="flex-1 px-5 py-2">
      <dl className="speclist">
        {dataset.specs.map((spec) => (
          <div className="specrow" key={spec.label}>
            <dt>{spec.label}</dt>
            <dd>{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>

    {dataset.summary && (
      <p className="border-t border-line px-5 py-4 text-sm leading-relaxed text-body">
        {dataset.summary}
      </p>
    )}
  </article>
);

/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * A dense record row — the table view of the same information. Used where a
 * grid of cards would be too heavy.
 */
export const DatasetRow: React.FC<{ dataset: DatasetRecord; className?: string }> = ({
  dataset,
  className,
}) => (
  <div className={cn('grid items-center gap-4 border-b border-line-faint py-4 last:border-b-0 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.1fr)]', className)}>
    <div className="min-w-0">
      <h3 className="truncate text-sm font-semibold text-ink">{dataset.name}</h3>
      {dataset.summary && <p className="mt-1 line-clamp-2 text-sm text-body">{dataset.summary}</p>}
    </div>

    <div className="hidden md:block">
      <Waveform seed={dataset.seed ?? dataset.id} bars={40} height={26} />
    </div>

    <div className="flex flex-wrap gap-1.5 md:justify-end">
      {dataset.specs.slice(0, 3).map((spec) => (
        <span className="tag" key={spec.label}>
          <span className="text-muted">{spec.label}</span>
          {spec.value}
        </span>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────── */

export interface DataCardProps {
  icon?: LucideIcon;
  title: string;
  body: string;
  meta?: string;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * The general-purpose content card: an icon, a claim, an explanation, and an
 * optional metadata line. One card shape used consistently everywhere.
 */
export const DataCard: React.FC<DataCardProps> = ({
  icon: Icon,
  title,
  body,
  meta,
  footer,
  className,
}) => (
  <article className={cn('card card-interactive flex h-full flex-col gap-4 p-6', className)}>
    <div className="flex items-start justify-between gap-3">
      {Icon && (
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-line bg-paper-sunk text-ink">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
      {meta && <span className="t-meta pt-1">{meta}</span>}
    </div>

    <div className="flex-1">
      <h3 className="t-h4">{title}</h3>
      <p className="mt-2 text-body">{body}</p>
    </div>

    {footer && <div className="border-t border-line-faint pt-4">{footer}</div>}
  </article>
);
