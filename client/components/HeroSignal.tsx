import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { useInView, prefersReducedMotion } from '../hooks/useScroll';

/* ═══════════════════════════════════════════════════════════════════════════
   Hero signal.

   A wide instrument rather than a player: a live waveform under a moving
   read-head. Wherever the cursor rests, that slice of the recording is
   inspected and its metadata printed beside it — audio becoming a record,
   demonstrated instead of described.

   Without a pointer (touch, or before first move) the read-head sweeps on its
   own, so the idea still lands on a phone.
   ═══════════════════════════════════════════════════════════════════════════ */

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

function hash(i: number, seed = 1) {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function token(el: HTMLElement, name: string, fallback: string) {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

/** Illustrative slices. Labelled as demo wherever this component is used. */
const SLICES = [
  { lang: 'Hindi · hi-IN',    env: 'Indoor, quiet',  spk: 'Adult · female' },
  { lang: 'Tamil · ta-IN',    env: 'Household',      spk: 'Adult · male' },
  { lang: 'English · en-IN',  env: 'Street',         spk: 'Adult · female' },
  { lang: 'Marathi · mr-IN',  env: 'Indoor, quiet',  spk: 'Adult · male' },
  { lang: 'Bengali · bn-IN',  env: 'Household',      spk: 'Adult · female' },
  { lang: 'Hinglish · mixed', env: 'Indoor, mixed',  spk: 'Adult · male' },
];

export const HeroSignal: React.FC<{ className?: string }> = ({ className }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrapRef, '160px');
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

    // Read-head: `target` is where the pointer wants it, `x` eases toward it.
    const head = { x: 0.34, target: 0.34, manual: false };

    const colors = {
      wave: token(wrap, '--wave-1', '#2b4acb'),
      accent: token(wrap, '--wave-3', '#0e9594'),
      line: token(wrap, '--line', '#e6e3dd'),
      strong: token(wrap, '--line-strong', '#d5d1c9'),
      muted: token(wrap, '--ink-muted', '#8b9198'),
      ink: token(wrap, '--ink', '#121417'),
      surface: token(wrap, '--surface', '#ffffff'),
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

    /** Amplitude of the recording at normalised position p, drifting in time. */
    const amplitude = (p: number, phase: number) => {
      const syllable = Math.abs(Math.sin(p * Math.PI * 8.4 + phase * 0.6));
      const phrase = 0.45 + 0.55 * Math.sin(p * Math.PI * 2.3 + phase * 0.22);
      const detail = 0.55 + 0.45 * Math.abs(Math.sin(p * Math.PI * 23 + phase));
      return clamp01(syllable * phrase * detail);
    };

    const draw = () => {
      const compact = W < 560;
      const padX = compact ? 12 : 28;
      const innerW = W - padX * 2;
      const mid = H * 0.46;
      const maxAmp = H * (compact ? 0.26 : 0.3);

      head.x += (head.target - head.x) * 0.07;
      const headX = padX + head.x * innerW;

      ctx.clearRect(0, 0, W, H);

      /* ── Frequency lanes ── */
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      for (let i = -2; i <= 2; i++) {
        const y = Math.round(mid + i * (maxAmp / 2.2)) + 0.5;
        ctx.beginPath();
        ctx.moveTo(padX, y);
        ctx.lineTo(W - padX, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* ── Ruler ── */
      const ticks = compact ? 8 : 16;
      ctx.strokeStyle = colors.strong;
      ctx.fillStyle = colors.muted;
      ctx.font = '500 9px ui-monospace, "JetBrains Mono", monospace';
      for (let i = 0; i <= ticks; i++) {
        const x = Math.round(padX + (i / ticks) * innerW) + 0.5;
        const major = i % 4 === 0;
        ctx.globalAlpha = major ? 0.7 : 0.32;
        ctx.beginPath();
        ctx.moveTo(x, H - 22);
        ctx.lineTo(x, H - 22 + (major ? 7 : 4));
        ctx.stroke();
        if (major && !compact) {
          ctx.globalAlpha = 0.75;
          ctx.fillText(`${((i / ticks) * 12).toFixed(1)}s`, x - 10, H - 6);
        }
      }
      ctx.globalAlpha = 1;

      /* ── Waveform ── */
      const bars = Math.max(48, Math.floor(innerW / (compact ? 5 : 6)));
      const barW = Math.max(1.4, innerW / bars - 2);

      for (let i = 0; i < bars; i++) {
        const p = i / (bars - 1);
        const a = amplitude(p, clock);

        // Everything inside the read-head window is inspected: taller, brighter.
        const dist = Math.abs(p - head.x);
        const focus = Math.max(0, 1 - dist / 0.085);
        const lift = 1 + focus * 0.5;

        const h = Math.max(2, a * maxAmp * lift);
        const x = padX + p * innerW;

        ctx.fillStyle = focus > 0.25 ? colors.accent : colors.wave;
        ctx.globalAlpha = 0.2 + a * 0.5 + focus * 0.4;
        ctx.fillRect(x, mid - h, barW, h * 2);
      }
      ctx.globalAlpha = 1;

      /* ── Drifting data points above the signal ── */
      const points = compact ? 10 : 20;
      for (let i = 0; i < points; i++) {
        const base = (i + 0.5) / points;
        const bob = Math.sin(clock * 0.7 + i * 1.7) * (compact ? 3 : 6);
        const x = padX + base * innerW;
        const y = mid - maxAmp - 16 + bob;
        const near = Math.max(0, 1 - Math.abs(base - head.x) / 0.14);

        ctx.beginPath();
        ctx.arc(x, y, 1.6 + near * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = near > 0.4 ? colors.accent : colors.strong;
        ctx.globalAlpha = 0.32 + near * 0.6;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* ── Read-head ── */
      ctx.strokeStyle = colors.wave;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.round(headX) + 0.5, mid - maxAmp - 30);
      ctx.lineTo(Math.round(headX) + 0.5, H - 24);
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.fillStyle = colors.wave;
      ctx.fillRect(Math.round(headX) - 3, mid - maxAmp - 33, 6, 3);

      /* ── Readout for the slice under the head ── */
      const slice = SLICES[Math.min(SLICES.length - 1, Math.floor(head.x * SLICES.length))];
      const seconds = (head.x * 12).toFixed(1);
      const quality = amplitude(head.x, clock) > 0.34 ? 'Verified' : 'Low energy';

      const rows: [string, string][] = compact
        ? [['LANG', slice.lang], ['AT', `${seconds}s`]]
        : [['LANG', slice.lang], ['AT', `${seconds}s`], ['ENV', slice.env], ['QC', quality]];

      const boxW = compact ? 132 : 168;
      const rowH = 15;
      const boxH = rows.length * rowH + 14;
      const flip = headX + boxW + 16 > W - padX;
      const boxX = flip ? headX - boxW - 12 : headX + 12;
      const boxY = Math.max(6, mid - maxAmp - 34);

      ctx.fillStyle = colors.surface;
      ctx.globalAlpha = 0.95;
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 6);
        ctx.fill();
      } else {
        ctx.fillRect(boxX, boxY, boxW, boxH);
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(boxX + 0.5, boxY + 0.5, boxW - 1, boxH - 1, 6);
        ctx.stroke();
      } else {
        ctx.strokeRect(boxX + 0.5, boxY + 0.5, boxW - 1, boxH - 1);
      }

      ctx.font = '500 9px ui-monospace, "JetBrains Mono", monospace';
      rows.forEach(([label, value], i) => {
        const y = boxY + 17 + i * rowH;
        ctx.fillStyle = colors.muted;
        ctx.fillText(label, boxX + 10, y);
        ctx.fillStyle = label === 'QC' && value === 'Verified' ? colors.accent : colors.ink;
        ctx.textAlign = 'right';
        ctx.fillText(value, boxX + boxW - 10, y);
        ctx.textAlign = 'left';
      });
    };

    const loop = () => {
      if (inViewRef.current) {
        clock += 1 / 60;
        // Nobody has taken hold of the read-head yet — let it sweep.
        if (!head.manual) {
          head.target = 0.5 + 0.36 * Math.sin(clock * 0.24);
        }
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      head.manual = true;
      head.target = clamp01((e.clientX - rect.left) / rect.width);
    };
    const onPointerLeave = () => { head.manual = false; };

    resize();
    draw();

    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(wrap);

    if (!reduced) {
      wrap.addEventListener('pointermove', onPointerMove);
      wrap.addEventListener('pointerleave', onPointerLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onPointerMove);
      wrap.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn('relative w-full touch-none', className)}
      role="img"
      aria-label="An interactive waveform. A read-head moves across a recording and prints the language, timestamp, environment and quality of the slice beneath it."
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};
