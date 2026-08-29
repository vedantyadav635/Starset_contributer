import React, { useMemo } from 'react';
import { cn } from '../lib/utils';

/* ═══════════════════════════════════════════════════════════════════════════
   Waveform primitives.

   Every amplitude here is generated from a deterministic seed rather than
   Math.random(), so a waveform looks identical across re-renders instead of
   twitching whenever React repaints. Cheap, stable, and honest: these are
   representative shapes, never claimed to be live audio unless they are.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Small deterministic hash → 0..1 sequence. */
function seeded(seed: string, count: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    h ^= h << 13; h >>>= 0;
    h ^= h >> 17;
    h ^= h << 5; h >>>= 0;
    out.push((h >>> 0) / 4294967295);
  }
  return out;
}

/**
 * Shapes a flat random sequence into something that reads as speech:
 * syllable-like swells with quiet gaps between them.
 */
export function speechEnvelope(seed: string, count: number): number[] {
  const noise = seeded(seed, count);
  return noise.map((n, i) => {
    const syllable = Math.abs(Math.sin((i / count) * Math.PI * 7.5));
    const phrase = 0.55 + 0.45 * Math.sin((i / count) * Math.PI * 2.1 + 0.6);
    const value = (0.35 + n * 0.65) * syllable * phrase;
    return Math.min(1, Math.max(0.06, value));
  });
}

interface WaveformProps {
  seed?: string;
  bars?: number;
  className?: string;
  /** 0–1. Bars before this point render in the active colour. */
  progress?: number;
  /** Animates bar heights — only use where audio is genuinely running. */
  live?: boolean;
  /** Live amplitudes (0–1) from an analyser; overrides the generated shape. */
  amplitudes?: number[];
  height?: number;
  gap?: number;
  color?: string;
  trackColor?: string;
  ariaLabel?: string;
}

/**
 * The bar waveform used throughout the product: task cards, review queues,
 * the recorder, and dataset previews.
 */
export const Waveform: React.FC<WaveformProps> = ({
  seed = 'starset',
  bars = 48,
  className,
  progress,
  live = false,
  amplitudes,
  height = 40,
  gap = 2,
  color = 'var(--signal)',
  trackColor = 'var(--line-strong)',
  ariaLabel,
}) => {
  const values = useMemo(
    () => amplitudes ?? speechEnvelope(seed, bars),
    [amplitudes, seed, bars],
  );

  const count = values.length;
  const barWidth = 100 / count;

  return (
    <svg
      className={cn('w-full', className)}
      style={{ height }}
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      role={ariaLabel ? 'img' : 'presentation'}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      focusable="false"
    >
      {values.map((v, i) => {
        const h = Math.max(Math.min(3, height * 0.12), v * height);
        const y = (height - h) / 2;
        const past = progress !== undefined && i / count <= progress;
        const fill = progress === undefined ? color : past ? color : trackColor;

        return (
          <rect
            key={i}
            x={i * barWidth + gap / 4}
            y={y}
            width={Math.max(0.4, barWidth - gap / 2)}
            height={h}
            rx={0.6}
            fill={fill}
            opacity={progress === undefined ? 0.5 + v * 0.5 : past ? 1 : 0.7}
            style={
              live
                ? {
                    transformOrigin: 'center',
                    animation: `wave-bar 900ms ease-in-out ${(i % 9) * 70}ms infinite alternate`,
                  }
                : undefined
            }
          />
        );
      })}
      <style>{`
        @keyframes wave-bar { from { transform: scaleY(0.35); } to { transform: scaleY(1); } }
        @media (prefers-reduced-motion: reduce) {
          rect { animation: none !important; }
        }
      `}</style>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */

interface WaveLineProps {
  seed?: string;
  points?: number;
  className?: string;
  height?: number;
  strokeWidth?: number;
  /** Draws a mirrored, filled body under the line. */
  filled?: boolean;
  color?: string;
}

/**
 * A continuous signal trace. Quieter than the bar waveform — used for
 * backgrounds, section transitions and the hero's secondary layers.
 */
export const WaveLine: React.FC<WaveLineProps> = ({
  seed = 'trace',
  points = 96,
  className,
  height = 80,
  strokeWidth = 1.25,
  filled = false,
  color = 'var(--signal)',
}) => {
  const gradientId = React.useId();

  const { line, area } = useMemo(() => {
    const values = speechEnvelope(seed, points);
    const step = 100 / (points - 1);

    // The trace sits low in the frame so the fill reads as a floor rather than
    // a slab bisecting the box.
    const baseline = height * 0.94;
    const amplitude = height * 0.78;

    const coords = values.map((v, i) => {
      const x = i * step;
      const y = baseline - v * amplitude;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });

    return {
      line: `M ${coords.join(' L ')}`,
      // Closed down to the bottom edge, so the fill fades out instead of
      // ending on a hard horizontal line halfway up.
      area: `M 0,${height} L ${coords.join(' L ')} L 100,${height} Z`,
    };
  }, [seed, points, height]);

  return (
    <svg
      className={cn('w-full', className)}
      style={{ height }}
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {filled && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.14" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gradientId})`} />
        </>
      )}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */

interface SpectrogramProps {
  seed?: string;
  columns?: number;
  rows?: number;
  className?: string;
  height?: number;
}

/**
 * A frequency-over-time field. Reads instantly as "audio analysis" without
 * pretending to be a real STFT of a real file.
 */
export const Spectrogram: React.FC<SpectrogramProps> = ({
  seed = 'spectro',
  columns = 64,
  rows = 18,
  className,
  height = 120,
}) => {
  const cells = useMemo(() => {
    const noise = seeded(seed, columns * rows);
    const envelope = speechEnvelope(`${seed}-env`, columns);

    return Array.from({ length: columns }, (_, c) =>
      Array.from({ length: rows }, (_, r) => {
        // Speech energy concentrates in the lower bands and decays upward.
        const bandFalloff = Math.pow(1 - r / rows, 1.6);
        const n = noise[c * rows + r];
        return Math.min(1, envelope[c] * bandFalloff * (0.55 + n * 0.75));
      }),
    );
  }, [seed, columns, rows]);

  const cw = 100 / columns;
  const ch = height / rows;

  return (
    <svg
      className={cn('w-full', className)}
      style={{ height }}
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {cells.map((column, c) =>
        column.map((v, r) => {
          if (v < 0.06) return null;
          return (
            <rect
              key={`${c}-${r}`}
              x={c * cw}
              y={height - (r + 1) * ch}
              width={cw + 0.05}
              height={ch + 0.05}
              fill={v > 0.62 ? 'var(--wave-3)' : 'var(--wave-1)'}
              opacity={v * 0.72}
            />
          );
        }),
      )}
    </svg>
  );
};
