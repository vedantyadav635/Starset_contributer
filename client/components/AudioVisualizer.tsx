import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

/* ═══════════════════════════════════════════════════════════════════════════
   Hero signal panel.

   A single <canvas> draws a slowly drifting speech-shaped trace over a
   measured timeline, with a frequency band beneath it. It responds to pointer
   position and scroll the way an instrument responds to being touched — a few
   pixels of shift, never a light show.

   One rAF loop, no libraries, paused when off-screen or when the visitor
   prefers reduced motion.
   ═══════════════════════════════════════════════════════════════════════════ */

function readToken(el: HTMLElement, name: string, fallback: string) {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}

export const AudioVisualizer: React.FC<{ className?: string; height?: number }> = ({
  className,
  height = 260,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, target: { x: 0.5, y: 0.5 } });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    let width = 0;
    let heightPx = 0;
    let raf = 0;
    let visible = true;
    let t = 0;

    const tokens = {
      wave1: readToken(wrap, '--wave-1', '#2b4acb'),
      wave3: readToken(wrap, '--wave-3', '#0e9594'),
      line: readToken(wrap, '--line', '#e6e3dd'),
      muted: readToken(wrap, '--ink-muted', '#8b9198'),
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, rect.width);
      heightPx = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(heightPx * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${heightPx}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** Deterministic speech-ish amplitude for normalised position p (0–1). */
    const amp = (p: number, phase: number) =>
      Math.abs(Math.sin(p * Math.PI * 6.5 + phase)) *
      (0.55 + 0.45 * Math.sin(p * Math.PI * 2.2 + phase * 0.35)) *
      (0.42 + 0.58 * Math.abs(Math.sin(p * Math.PI * 17 + phase * 1.6)));

    const draw = () => {
      const mid = heightPx * 0.44;
      const bandTop = heightPx * 0.72;
      const bandHeight = heightPx * 0.2;

      // Pointer easing — the panel leans, it does not jump.
      pointer.current.x += (pointer.current.target.x - pointer.current.x) * 0.06;
      pointer.current.y += (pointer.current.target.y - pointer.current.y) * 0.06;

      const lean = (pointer.current.x - 0.5) * 2;   // -1..1
      const gain = 0.78 + (1 - pointer.current.y) * 0.42;

      ctx.clearRect(0, 0, width, heightPx);

      // ── Timeline ticks ──
      ctx.strokeStyle = tokens.line;
      ctx.lineWidth = 1;
      const tickCount = Math.max(12, Math.round(width / 46));
      for (let i = 0; i <= tickCount; i++) {
        const x = Math.round((i / tickCount) * width) + 0.5;
        const major = i % 5 === 0;
        ctx.globalAlpha = major ? 0.85 : 0.4;
        ctx.beginPath();
        ctx.moveTo(x, mid - (major ? 12 : 6));
        ctx.lineTo(x, mid + (major ? 12 : 6));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // ── Centre axis ──
      ctx.strokeStyle = tokens.line;
      ctx.beginPath();
      ctx.moveTo(0, Math.round(mid) + 0.5);
      ctx.lineTo(width, Math.round(mid) + 0.5);
      ctx.stroke();

      // ── Waveform bars ──
      const barGap = 4;
      const barWidth = 2;
      const step = barWidth + barGap;
      const bars = Math.floor(width / step);
      const maxAmp = heightPx * 0.3;

      for (let i = 0; i < bars; i++) {
        const p = i / bars;
        const a = amp(p + lean * 0.03, t) * gain;
        const h = Math.max(2, a * maxAmp);
        const x = i * step + barGap / 2;

        const grad = ctx.createLinearGradient(0, mid - h, 0, mid + h);
        grad.addColorStop(0, tokens.wave1);
        grad.addColorStop(0.5, a > 0.72 ? tokens.wave3 : tokens.wave1);
        grad.addColorStop(1, tokens.wave1);

        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.28 + a * 0.62;
        ctx.fillRect(x, mid - h, barWidth, h * 2);
      }
      ctx.globalAlpha = 1;

      // ── Frequency band ──
      const cols = Math.floor(width / 7);
      const rows = 6;
      for (let c = 0; c < cols; c++) {
        const p = c / cols;
        const energy = amp(p + lean * 0.03, t * 0.7) * gain;
        for (let r = 0; r < rows; r++) {
          const falloff = Math.pow(1 - r / rows, 1.5);
          const v = energy * falloff;
          if (v < 0.07) continue;
          ctx.fillStyle = v > 0.55 ? tokens.wave3 : tokens.wave1;
          ctx.globalAlpha = v * 0.5;
          ctx.fillRect(c * 7, bandTop + bandHeight - (r + 1) * (bandHeight / rows), 6, bandHeight / rows - 1);
        }
      }
      ctx.globalAlpha = 1;

      // ── Playhead ──
      const headX = pointer.current.x * width;
      ctx.strokeStyle = tokens.wave1;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(Math.round(headX) + 0.5, heightPx * 0.08);
      ctx.lineTo(Math.round(headX) + 0.5, heightPx * 0.94);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = tokens.wave1;
      ctx.fillRect(Math.round(headX) - 2.5, heightPx * 0.08, 5, 3);
    };

    const loop = () => {
      if (visible) {
        t += 0.006;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.current.target.x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      pointer.current.target.y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    };
    const onPointerLeave = () => {
      pointer.current.target.x = 0.5;
      pointer.current.target.y = 0.5;
    };

    resize();
    draw();

    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(wrap);

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
    io.observe(wrap);

    if (!reduced) {
      wrap.addEventListener('pointermove', onPointerMove);
      wrap.addEventListener('pointerleave', onPointerLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener('pointermove', onPointerMove);
      wrap.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn('relative w-full touch-none', className)}
      style={{ height }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */

export interface SignalField {
  label: string;
  value: string;
}

/**
 * The hero panel: a framed signal with its metadata read out around it,
 * the way a dataset record is described. This is the single strongest
 * statement of what Starset does.
 */
export const SignalPanel: React.FC<{
  fields: SignalField[];
  caption?: string;
  className?: string;
  visualHeight?: number;
}> = ({ fields, caption, className, visualHeight = 240 }) => (
  <figure className={cn('card overflow-hidden shadow-md', className)}>
    <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5 sm:px-5">
      <div className="flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--ok)] pulse-dot" />
        <span className="t-meta">Signal preview</span>
      </div>
      <span className="t-meta hidden sm:inline">16 kHz · mono · wav</span>
    </div>

    <div className="relative px-2 sm:px-4">
      <AudioVisualizer height={visualHeight} />
    </div>

    <dl className="grid grid-cols-2 border-t border-line sm:grid-cols-3">
      {fields.map((field, i) => (
        <div
          key={field.label}
          className={cn(
            'border-line px-4 py-3 sm:px-5',
            i % 2 === 0 && 'border-r sm:border-r',
            'sm:[&:nth-child(3n)]:border-r-0',
            i < fields.length - 2 && 'border-b',
          )}
        >
          <dt className="t-meta">{field.label}</dt>
          <dd className="mt-1 truncate text-sm font-medium text-ink">{field.value}</dd>
        </div>
      ))}
    </dl>

    {caption && (
      <figcaption className="border-t border-line bg-paper-sunk px-4 py-2.5 text-xs text-muted sm:px-5">
        {caption}
      </figcaption>
    )}
  </figure>
);
