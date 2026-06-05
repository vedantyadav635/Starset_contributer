import React, { useRef, useEffect } from 'react';

interface PixelTransitionProps {
  color?: string; // fallback color
  pixelSize?: number; // size of each block in px
  maxRows?: number; // number of rows of blocks
  reverse?: boolean; // direction of fade
  chaos?: number; // randomness factor
  className?: string;
  mode?: 'wipe' | 'glow';
  height?: number; // container height in px
}

export const PixelTransition: React.FC<PixelTransitionProps> = ({
  color = '#3b82f6', // Neon Blue default
  pixelSize = 20, // smaller blocks for richer high-res look
  maxRows = 12, // more rows for a smoother wipe curve
  reverse = false,
  chaos = 0.4,
  className = '',
  mode = 'wipe',
  height = 240,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols = 0;
    let rows = maxRows;
    let time = 0;
    let animationFrameId: number;
    let active = false;

    // Mouse tracking
    const mouse = { x: -1000, y: -1000, active: false };

    // Scroll velocity tracking
    let lastScrollTop = window.scrollY;
    let scrollVelocity = 0;
    let targetScrollVelocity = 0;

    interface Cell {
      r: number;
      c: number;
      phase: number;
      speed: number;
      colorPalette: string;
      threshold: number; // for wipe activation
    }

    let cells: Cell[] = [];

    const blueColors = [
      'rgba(59, 130, 246, ',  // Neon Blue
      'rgba(6, 182, 212, ',   // Cyber Cyan
      'rgba(29, 78, 216, ',   // Royal Blue
      'rgba(30, 58, 138, ',   // Deep Blue
      'rgba(147, 197, 253, ', // Light Blue Glow
    ];

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = container.offsetWidth;
      const h = height;

      container.style.height = `${h}px`;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / pixelSize);
      rows = Math.ceil(h / pixelSize);
      
      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Diagonal coordinate mapping for sweep effect
          const coord = (r / rows) * 0.65 + (c / cols) * 0.35;
          // Randomize threshold within a narrow band for pixelated look
          const threshold = coord * 0.8 + Math.random() * 0.2;

          cells.push({
            r,
            c,
            phase: Math.random() * Math.PI * 2,
            speed: 0.03 + Math.random() * 0.03,
            colorPalette: blueColors[Math.floor(Math.random() * blueColors.length)],
            threshold,
          });
        }
      }
    };

    handleResize();

    const computeProgress = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      
      // Compute progress such that 0 is when container bottom enters viewport,
      // and 1 is when container top leaves viewport
      const travel = vh + rect.height;
      const gone = vh - rect.top;
      let progress = Math.max(0, Math.min(1, gone / travel));
      
      return reverse ? 1 - progress : progress;
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const progress = computeProgress();

      // Damping scroll velocity
      scrollVelocity += (targetScrollVelocity - scrollVelocity) * 0.1;
      targetScrollVelocity *= 0.9;

      time += 0.05 + scrollVelocity * 0.15;

      cells.forEach((cell) => {
        const cellX = cell.c * pixelSize + pixelSize / 2;
        const cellY = cell.r * pixelSize + pixelSize / 2;

        let isActivated = false;

        if (mode === 'wipe') {
          // Double-ended wipe: 
          // From progress 0.0 to 0.5, screen fills up (closes)
          // From progress 0.5 to 1.0, screen clears out (opens)
          if (progress < 0.5) {
            const fillFraction = progress * 2.0; // scales 0.0 to 1.0
            isActivated = cell.threshold < fillFraction;
          } else {
            const clearFraction = (progress - 0.5) * 2.0; // scales 0.0 to 1.0
            isActivated = cell.threshold >= clearFraction;
          }
        } else {
          // Standard density transition
          const noise = (Math.sin(cell.c * 0.2 + time * 0.5) * 0.1) * chaos;
          isActivated = progress > (cell.r / rows + noise);
        }

        if (!isActivated) return;

        // Breathing animation
        const breath = Math.sin(time * cell.speed + cell.phase) * 0.15 + 0.85;

        // Mouse magnetic attraction
        let mouseInfluence = 0;
        let scale = 1.0;
        let mouseColorGlow = false;

        if (mouse.active) {
          const dx = mouse.x - cellX;
          const dy = mouse.y - cellY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;

          if (dist < maxDist) {
            const factor = 1 - dist / maxDist;
            mouseInfluence = factor * 0.6;
            scale = 1.0 + factor * 0.3;
            mouseColorGlow = true;
          }
        }

        // Scroll velocity wave
        const waveX = Math.sin(cell.c * 0.25 - time * 0.8) * 0.15;
        const waveY = Math.cos(cell.r * 0.3 + time * 0.6) * 0.1;
        const ripple = (waveX + waveY) * (0.2 + scrollVelocity * 2.5);

        // Compute opacity
        let opacity = 0.7 * breath + ripple + mouseInfluence;
        
        // If it's a solid wipe, make the center transition part extra opaque
        if (mode === 'wipe') {
          // Opacity peaks at progress = 0.5
          const proximityToMid = 1 - Math.abs(progress - 0.5) * 2; // 0 to 1
          opacity *= (0.5 + proximityToMid * 0.5);
        }
        
        opacity = Math.max(0.1, Math.min(1.0, opacity));

        ctx.save();

        if (mouseColorGlow) {
          ctx.fillStyle = `rgba(34, 211, 238, ${opacity})`; // Cyber Cyan
          ctx.shadowColor = 'rgba(6, 182, 212, 0.7)';
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = `${cell.colorPalette}${opacity})`;
          if (cell.colorPalette.includes('59, 130, 246') || cell.colorPalette.includes('6, 182, 212')) {
            ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
            ctx.shadowBlur = 8;
          }
        }

        const size = (pixelSize - 3) * scale; // 3px border separation
        const x = cell.c * pixelSize + (pixelSize - size) / 2;
        const y = cell.r * pixelSize + (pixelSize - size) / 2;

        // Rounded rect drawing
        const radius = Math.min(4, size / 4);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + size - radius, y);
        ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
        ctx.lineTo(x + size, y + size - radius);
        ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
        ctx.lineTo(x + radius, y + size);
        ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });
    };

    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      const diff = Math.abs(currentScrollTop - lastScrollTop);
      targetScrollVelocity = Math.min(2.5, diff * 0.06);
      lastScrollTop = currentScrollTop;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const tick = () => {
      if (!active) return;
      draw();
      animationFrameId = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          active = true;
          tick();
        } else {
          active = false;
          window.cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0 }
    );
    observer.observe(container);

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [pixelSize, maxRows, reverse, chaos, mode, height]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden cursor-crosshair ${className}`}
      style={{ height: `${height}px` }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
