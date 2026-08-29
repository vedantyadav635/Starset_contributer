import React, { useMemo, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { Waveform } from './Waveform';

/* ═══════════════════════════════════════════════════════════════════════════
   Collection configurator.

   "You can specify the data you need" is a claim. Letting someone actually
   specify it, and watching the brief rewrite itself, is a demonstration.
   Nothing is submitted here — it hands the assembled brief to the contact
   flow, which is where a real conversation starts.
   ═══════════════════════════════════════════════════════════════════════════ */

interface Axis {
  id: string;
  label: string;
  options: string[];
}

const AXES: Axis[] = [
  { id: 'language', label: 'Language', options: ['Hindi', 'Tamil', 'Bengali', 'English (IN)'] },
  { id: 'accent', label: 'Accent', options: ['Regional', 'Standard', 'Mixed'] },
  { id: 'environment', label: 'Environment', options: ['Quiet indoor', 'Household', 'Street'] },
  { id: 'prompt', label: 'Prompt', options: ['Read speech', 'Spontaneous', 'Short command'] },
  { id: 'duration', label: 'Clip length', options: ['2–10 s', '10–45 s', '45–90 s'] },
  { id: 'annotation', label: 'Annotation', options: ['None', 'Transcript', 'Intent label'] },
];

const DEFAULTS: Record<string, string> = {
  language: 'Hindi',
  accent: 'Regional',
  environment: 'Household',
  prompt: 'Spontaneous',
  duration: '10–45 s',
  annotation: 'Transcript',
};

export const Configurator: React.FC<{
  className?: string;
  onRequest?: (brief: string) => void;
}> = ({ className, onRequest }) => {
  const [choice, setChoice] = useState<Record<string, string>>(DEFAULTS);

  const seed = useMemo(() => Object.values(choice).join('-'), [choice]);

  const brief = useMemo(
    () => AXES.map((a) => `${a.label}: ${choice[a.id]}`).join('\n'),
    [choice],
  );

  return (
    <div className={cn('card overflow-hidden', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <span className="t-meta">Collection brief</span>
        <span className="t-meta">Draft</span>
      </div>

      {/* ── Axes ── */}
      <div className="grid gap-px bg-line sm:grid-cols-2">
        {AXES.map((axis) => (
          <fieldset key={axis.id} className="bg-surface px-4 py-3.5 sm:px-5">
            <legend className="t-meta mb-2.5">{axis.label}</legend>
            <div className="flex flex-wrap gap-1.5">
              {axis.options.map((option) => {
                const selected = choice[axis.id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setChoice((c) => ({ ...c, [axis.id]: option }))}
                    className={cn(
                      'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                      selected
                        ? 'border-signal bg-signal-soft text-signal'
                        : 'border-line text-body hover:border-line-strong hover:text-ink',
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {/* ── Resulting shape ── */}
      <div className="border-t border-line bg-paper-sunk px-4 py-5 sm:px-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-base font-semibold text-ink">
            {choice.language} · {choice.prompt.toLowerCase()}
          </p>
          <span className="t-meta">{choice.environment} · {choice.duration}</span>
        </div>

        {/* The signal re-shapes itself as the brief changes. */}
        <div className="mt-4">
          <Waveform key={seed} seed={seed} bars={72} height={34} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1.5 text-xs text-body">
            <Check className="h-3.5 w-3.5 text-[color:var(--ok)]" strokeWidth={2.5} aria-hidden="true" />
            {choice.accent} accent targeted
          </span>
          <span className="flex items-center gap-1.5 text-xs text-body">
            <Check className="h-3.5 w-3.5 text-[color:var(--ok)]" strokeWidth={2.5} aria-hidden="true" />
            {choice.annotation === 'None' ? 'Audio + metadata' : `${choice.annotation} included`}
          </span>
        </div>

        {onRequest && (
          <button
            type="button"
            onClick={() => onRequest(brief)}
            className="btn btn-md btn-primary mt-5 w-full sm:w-auto"
          >
            Send this brief
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>

      <p className="border-t border-line px-4 py-2.5 text-xs text-muted sm:px-5">
        Feasibility depends on recruiting speakers who match. We answer that before anything is agreed.
      </p>
    </div>
  );
};
