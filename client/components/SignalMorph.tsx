import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { useInView, prefersReducedMotion } from '../hooks/useScroll';

/* ═══════════════════════════════════════════════════════════════════════════
   The Starset signal.

   One canvas that carries the whole story. Driven by a scroll progress ref
   (0 → 1), it morphs continuously through four readings of the same data:

     0.00  VOICE    a rough, noisy human waveform
     0.33  AUDIO    the noise floor drops away and the signal cleans up
     0.66  DATA     the wave breaks into discrete, bounded segments
     1.00  DATASET  those segments migrate into the cells of a table

   Nothing is a scene change — every bar is the same bar throughout, just
   interpolated. That continuity is the point: it is one recording being
   understood four different ways.
   ═══════════════════════════════════════════════════════════════════════════ */

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Hermite ease between two edges — the standard shader smoothstep. */
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hash(i: number, seed = 1) {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Speech-shaped envelope: syllable swells inside a phrase contour. */
function envelope(p: number) {
  const syllable = Math.abs(Math.sin(p * Math.PI * 7.2));
  const phrase = 0.5 + 0.5 * Math.sin(p * Math.PI * 2.1 + 0.7);
  return Math.max(0.08, syllable * (0.45 + 0.55 * phrase));
}

function token(el: HTMLElement, name: string, fallback: string) {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

interface SignalMorphProps {
  /** 0 → 1 scroll progress. Read every frame; never triggers a render. */
  progress: React.MutableRefObject<number>;
  className?: string;
  /** Column labels revealed as the dataset assembles. */
  columns?: string[];
}

export const SignalMorph: React.FC<SignalMorphProps> = ({
  progress,
  className,
  columns = ['LANG', 'DUR', 'ENV', 'SPKR', 'FMT', 'QC'],
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrapRef, '200px');
  const inViewRef = useRef(inView);
  inViewRef.current = inView;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = prefersReducedMotion();

    let W = 0;
    let H = 0;
    let raf = 0;
    let clock = 0;

    const colors = {
      wave: token(wrap, '--wave-1', '#2b4acb'),
      accent: token(wrap, '--wave-3', '#0e9594'),
      line: token(wrap, '--line', '#e6e3dd'),
      strong: token(wrap, '--line-strong', '#d5d1c9'),
      muted: token(wrap, '--ink-muted', '#8b9198'),
      ink: token(wrap, '--ink', '#121417'),
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const t = clamp01(progress.current);

      // Stage weights. They overlap deliberately so the morph never snaps.
      const clean = smoothstep(0.04, 0.36, t);
      const split = smoothstep(0.30, 0.60, t);
      const table = smoothstep(0.56, 0.90, t);
      const meta = smoothstep(0.70, 1.0, t);

      const padX = Math.min(56, W * 0.06);
      const innerW = W - padX * 2;

      // Grid the bars eventually occupy.
      const rows = 5;
      const cols = Math.max(12, Math.min(24, Math.round(innerW / 46)));
      const count = rows * cols;

      const headerH = 26;
      const gridTop = H * 0.5 - (H * 0.52) / 2 + headerH * meta;
      const gridH = H * 0.52 - headerH * meta;
      const cellW = innerW / cols;
      const cellH = gridH / rows;

      const mid = H * 0.5;
      const maxAmp = H * 0.42;

      ctx.clearRect(0, 0, W, H);

      /* ── Baseline axis: present early, dissolving as the table forms ── */
      if (table < 0.96) {
        ctx.globalAlpha = (1 - table) * 0.9;
        ctx.strokeStyle = colors.line;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padX, Math.round(mid) + 0.5);
        ctx.lineTo(W - padX, Math.round(mid) + 0.5);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      /* ── Table chrome: column rules and headers ── */
      if (meta > 0.01) {
        ctx.globalAlpha = meta * 0.55;
        ctx.strokeStyle = colors.line;
        ctx.lineWidth = 1;
        for (let r = 0; r <= rows; r++) {
          const y = Math.round(gridTop + r * cellH) + 0.5;
          ctx.beginPath();
          ctx.moveTo(padX, y);
          ctx.lineTo(W - padX, y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        ctx.globalAlpha = meta;
        ctx.fillStyle = colors.muted;
        ctx.font = '500 9px ui-monospace, "JetBrains Mono", monospace';
        ctx.textBaseline = 'alphabetic';
        const step = innerW / columns.length;
        columns.forEach((label, i) => {
          ctx.fillText(label, padX + i * step + 2, gridTop - 10);
        });
        ctx.globalAlpha = 1;
      }

      /* ── The bars ── */
      const gapPerSegment = 10 * split;
      const segments = 6;

      for (let i = 0; i < count; i++) {
        const p = i / (count - 1);

        // Amplitude: noisy at first, resolving to a clean envelope.
        const base = envelope(p);
        const grit = (hash(i, 3) - 0.5) * 0.85 * (1 - clean);
        const amp = clamp01(base + grit);

        // ── Waveform position ──
        const seg = Math.floor(p * segments);
        const segShift = (seg - (segments - 1) / 2) * gapPerSegment;
        const waveX = padX + p * innerW + segShift;
        const barW = Math.max(1.2, innerW / count - 1.4);
        const h = Math.max(2, amp * maxAmp * (0.55 + 0.45 * clean));
        const waveY = mid - h / 2;
        const waveH = h;

        // Bars inside an inter-segment gap fade while the split opens.
        const localP = (p * segments) % 1;
        const inGap = localP > 0.86 ? (localP - 0.86) / 0.14 : 0;
        const gapFade = 1 - inGap * split * 0.85;

        // ── Table cell position ──
        const row = Math.floor(i / cols);
        const col = i % cols;
        const cellX = padX + col * cellW + 1;
        const cellY = gridTop + row * cellH + cellH * 0.22;
        const cellWi = Math.max(2, cellW - 3);
        const cellHi = Math.max(2, cellH * 0.56);

        // ── Interpolate wave → cell ──
        // Each row lands slightly after the one above it, so the table is
        // written line by line rather than every bar scattering at once.
        const rowDelay = (row / rows) * 0.26;
        const settle = smoothstep(0.56 + rowDelay, 0.90 + rowDelay * 0.4, t);

        const x = waveX + (cellX - waveX) * settle;
        const y = waveY + (cellY - waveY) * settle;
        const w = barW + (cellWi - barW) * settle;
        const bh = waveH + (cellHi - waveH) * settle;

        // The accent flags high-energy content while the signal is being read,
        // then retires: the finished table is monochrome, with amplitude
        // carried by opacity alone. A multicoloured grid reads as decoration;
        // a single-hue one reads as data.
        const hot = amp > 0.72 && clean > 0.5 && settle < 0.35;
        ctx.fillStyle = hot ? colors.accent : colors.wave;
        ctx.globalAlpha = (0.28 + amp * 0.6) * gapFade;

        const radius = Math.min(1.5, w / 2);
        if (radius > 0.6 && typeof ctx.roundRect === 'function') {
          ctx.beginPath();
          ctx.roundRect(x, y, w, bh, radius);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, w, bh);
        }
      }
      ctx.globalAlpha = 1;

      /* ── Segment boundary ticks, strongest at the "DATA" reading ── */
      const tickAlpha = split * (1 - table) * 0.7;
      if (tickAlpha > 0.02) {
        ctx.globalAlpha = tickAlpha;
        ctx.strokeStyle = colors.strong;
        ctx.lineWidth = 1;
        for (let s = 1; s < segments; s++) {
          const p = s / segments;
          const segShift = (s - 1 - (segments - 1) / 2) * gapPerSegment + gapPerSegment / 2;
          const x = Math.round(padX + p * innerW + segShift) + 0.5;
          ctx.beginPath();
          ctx.moveTo(x, mid - maxAmp * 0.7);
          ctx.lineTo(x, mid + maxAmp * 0.7);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      /* ── Metadata pins that rise off the segments ── */
      if (split > 0.15 && table < 0.9) {
        const pinAlpha = split * (1 - table);
        ctx.globalAlpha = pinAlpha * 0.9;
        ctx.fillStyle = colors.muted;
        ctx.font = '500 9px ui-monospace, "JetBrains Mono", monospace';
        const pins = ['0.9s', '1.4s', '0.7s', '2.1s', '1.1s', '0.8s'];
        for (let s = 0; s < segments; s++) {
          const p = (s + 0.5) / segments;
          const segShift = (s - (segments - 1) / 2) * gapPerSegment;
          const x = padX + p * innerW + segShift;
          const y = mid - maxAmp * 0.82;
          ctx.globalAlpha = pinAlpha * 0.35;
          ctx.strokeStyle = colors.strong;
          ctx.beginPath();
          ctx.moveTo(Math.round(x) + 0.5, y + 4);
          ctx.lineTo(Math.round(x) + 0.5, y + 14);
          ctx.stroke();
          ctx.globalAlpha = pinAlpha * 0.9;
          ctx.fillText(pins[s], x - 9, y);
        }
        ctx.globalAlpha = 1;
      }

      /* ── A slow scan pass while the signal is still being read ── */
      if (!reduced && t < 0.55) {
        const scanP = (clock * 0.12) % 1;
        const x = padX + scanP * innerW;
        const grad = ctx.createLinearGradient(x - 26, 0, x + 26, 0);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, colors.wave);
        grad.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.07 * (1 - t / 0.55);
        ctx.fillStyle = grad;
        ctx.fillRect(x - 26, mid - maxAmp, 52, maxAmp * 2);
        ctx.globalAlpha = 1;
      }
    };

    const loop = () => {
      if (inViewRef.current) {
        clock += 1 / 60;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw();

    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(wrap);

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [progress, columns]);

  return (
    <div ref={wrapRef} className={cn('relative h-full w-full', className)} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};
