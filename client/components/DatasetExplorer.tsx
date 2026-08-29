import React, { useMemo, useState } from 'react';
import { cn } from '../lib/utils';
import { speechEnvelope } from './Waveform';

/* ═══════════════════════════════════════════════════════════════════════════
   Dataset explorer.

   A dataset shown as an instrument panel instead of described in a paragraph.
   The waveform is divided into clips; hover or focus one and its record is
   printed beside it. Everything here is illustrative and says so.
   ═══════════════════════════════════════════════════════════════════════════ */

interface Clip {
  start: string;
  duration: string;
  speaker: string;
  quality: 'Verified' | 'In review';
}

interface DatasetDef {
  id: string;
  name: string;
  language: string;
  specs: { label: string; value: string }[];
  clips: Clip[];
}

const SPEAKERS = ['Adult · female', 'Adult · male', 'Adult · female', 'Senior · male'];

function makeClips(seed: string, n: number): Clip[] {
  let t = 0;
  return Array.from({ length: n }, (_, i) => {
    const d = 0.7 + ((i * 7 + seed.length * 3) % 23) / 10;
    const start = t;
    t += d + 0.2;
    return {
      start: `${start.toFixed(1)}s`,
      duration: `${d.toFixed(1)}s`,
      speaker: SPEAKERS[i % SPEAKERS.length],
      quality: i % 7 === 3 ? 'In review' : 'Verified',
    };
  });
}

const DATASETS: DatasetDef[] = [
  {
    id: 'hi-conv',
    name: 'Hindi conversational',
    language: 'Hindi · hi-IN',
    specs: [
      { label: 'Sample rate', value: '16 kHz' },
      { label: 'Format', value: 'WAV' },
      { label: 'Prompt', value: 'Spontaneous' },
      { label: 'Environment', value: 'Indoor, mixed' },
      { label: 'Speakers', value: 'Multi' },
      { label: 'Annotation', value: 'On request' },
    ],
    clips: makeClips('hi-conv', 14),
  },
  {
    id: 'ta-read',
    name: 'Tamil read speech',
    language: 'Tamil · ta-IN',
    specs: [
      { label: 'Sample rate', value: '16 kHz' },
      { label: 'Format', value: 'WAV' },
      { label: 'Prompt', value: 'Scripted' },
      { label: 'Environment', value: 'Quiet indoor' },
      { label: 'Speakers', value: 'Dialect-tagged' },
      { label: 'Annotation', value: 'Transcript' },
    ],
    clips: makeClips('ta-read', 14),
  },
  {
    id: 'en-cmd',
    name: 'Indian English commands',
    language: 'English · en-IN',
    specs: [
      { label: 'Sample rate', value: '16 kHz' },
      { label: 'Format', value: 'WAV' },
      { label: 'Prompt', value: 'Short utterance' },
      { label: 'Environment', value: 'Indoor + street' },
      { label: 'Speakers', value: 'Accent-spread' },
      { label: 'Annotation', value: 'Intent label' },
    ],
    clips: makeClips('en-cmd', 14),
  },
];

const BARS_PER_CLIP = 7;

export const DatasetExplorer: React.FC<{ className?: string }> = ({ className }) => {
  const [active, setActive] = useState(0);
  const [clipIndex, setClipIndex] = useState<number | null>(null);

  const dataset = DATASETS[active];
  const clipCount = dataset.clips.length;

  const amplitudes = useMemo(
    () => speechEnvelope(dataset.id, clipCount * BARS_PER_CLIP),
    [dataset.id, clipCount],
  );

  const clip = clipIndex === null ? null : dataset.clips[clipIndex];

  return (
    <div className={cn('card overflow-hidden', className)}>
      {/* ── Dataset switcher ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="segmented scroll-x no-scrollbar max-w-full" role="group" aria-label="Choose a dataset">
          {DATASETS.map((d, i) => (
            <button
              key={d.id}
              type="button"
              data-active={i === active}
              aria-pressed={i === active}
              onClick={() => { setActive(i); setClipIndex(null); }}
            >
              {d.name}
            </button>
          ))}
        </div>
        <span className="tag flex-none">Example data</span>
      </div>

      {/* ── Signal ── */}
      <div className="border-b border-line bg-paper-sunk px-4 pb-3 pt-5 sm:px-5">
        <div className="relative">
          <svg
            className="block w-full"
            style={{ height: 92 }}
            viewBox={`0 0 ${clipCount * BARS_PER_CLIP * 4} 92`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {amplitudes.map((v, i) => {
              const inClip = Math.floor(i / BARS_PER_CLIP);
              const focused = clipIndex === inClip;
              const dim = clipIndex !== null && !focused;
              const h = Math.max(3, v * 74 * (focused ? 1 : 0.86));
              return (
                <rect
                  key={i}
                  x={i * 4 + (inClip * 2)}
                  y={46 - h / 2}
                  width={2.4}
                  height={h}
                  rx={1}
                  fill={focused ? 'var(--wave-3)' : 'var(--wave-1)'}
                  opacity={dim ? 0.18 : 0.35 + v * 0.55}
                  style={{ transition: 'opacity 200ms ease, height 200ms ease' }}
                />
              );
            })}
          </svg>

          {/* Hit targets, one per clip — real buttons so this works by keyboard. */}
          <div className="absolute inset-0 flex" onMouseLeave={() => setClipIndex(null)}>
            {dataset.clips.map((c, i) => (
              <button
                key={i}
                type="button"
                className={cn(
                  'group relative flex-1 rounded-sm outline-offset-2 transition-colors',
                  clipIndex === i ? 'bg-[color-mix(in_srgb,var(--signal)_8%,transparent)]' : 'hover:bg-[color-mix(in_srgb,var(--signal)_6%,transparent)]',
                )}
                onMouseEnter={() => setClipIndex(i)}
                onFocus={() => setClipIndex(i)}
                onClick={() => setClipIndex(i)}
                aria-label={`Clip ${i + 1}: ${c.duration}, ${c.speaker}, ${c.quality}`}
              >
                <span
                  className={cn(
                    'absolute inset-y-0 left-0 w-px transition-colors',
                    clipIndex === i ? 'bg-signal' : 'bg-transparent',
                  )}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="t-meta">00:00</span>
          <span className="t-meta">
            {clip ? `Clip ${(clipIndex ?? 0) + 1} of ${clipCount}` : `${clipCount} clips · hover to inspect`}
          </span>
          <span className="t-meta">00:24</span>
        </div>
      </div>

      {/* ── Record ── */}
      <div className="grid gap-px bg-line sm:grid-cols-2">
        <dl className="bg-surface px-4 py-4 sm:px-5">
          <p className="t-meta mb-3">{clip ? 'Selected clip' : 'Dataset'}</p>

          {clip ? (
            <div className="speclist">
              <div className="specrow"><dt>Starts at</dt><dd>{clip.start}</dd></div>
              <div className="specrow"><dt>Duration</dt><dd>{clip.duration}</dd></div>
              <div className="specrow"><dt>Speaker</dt><dd>{clip.speaker}</dd></div>
              <div className="specrow">
                <dt>Quality</dt>
                <dd>
                  <span className={cn('tag', clip.quality === 'Verified' ? 'tag-ok' : 'tag-warn')}>
                    {clip.quality}
                  </span>
                </dd>
              </div>
            </div>
          ) : (
            <div className="speclist">
              <div className="specrow"><dt>Name</dt><dd>{dataset.name}</dd></div>
              <div className="specrow"><dt>Language</dt><dd>{dataset.language}</dd></div>
              <div className="specrow"><dt>Clips</dt><dd>{clipCount}</dd></div>
              <div className="specrow"><dt>Reviewed</dt><dd>Every clip</dd></div>
            </div>
          )}
        </dl>

        <div className="bg-surface px-4 py-4 sm:px-5">
          <p className="t-meta mb-3">Collection spec</p>
          <div className="speclist">
            {dataset.specs.map((s) => (
              <div className="specrow" key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="border-t border-line bg-paper-sunk px-4 py-2.5 text-xs text-muted sm:px-5">
        Illustrative structure, not a published catalogue. Real collections carry the same fields.
      </p>
    </div>
  );
};
