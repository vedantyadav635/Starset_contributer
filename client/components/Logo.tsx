import React, { useEffect } from 'react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

/* ── Preload all logo variants on first mount so theme toggles are instant ── */
const LOGO_SOURCES = ['/logo.png', '/logo-dark.png', '/logo-wordmark.png', '/logo-wordmark-dark.png'];
let preloaded = false;
function preloadLogos() {
  if (preloaded) return;
  preloaded = true;
  LOGO_SOURCES.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

/* ── Shared transition style for cross-fading ── */
const FADE_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  transition: 'opacity 0.15s ease',
};

interface LogoProps {
  className?: string;
  animated?: boolean;
}

/**
 * The Starset brand mark (triangle/star icon).
 * Both light and dark images are always rendered; only opacity toggles,
 * so there is zero network delay when the theme switches.
 */
export const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-8', animated = false }) => {
  const { isDark } = useTheme();

  useEffect(preloadLogos, []);

  return (
    <span
      className={cn('relative inline-block shrink-0', className, animated && 'animate-spin-slow')}
      aria-hidden="true"
    >
      <img
        src="/logo.png"
        alt=""
        draggable={false}
        style={{ ...FADE_STYLE, opacity: isDark ? 0 : 1 }}
      />
      <img
        src="/logo-dark.png"
        alt=""
        draggable={false}
        style={{ ...FADE_STYLE, opacity: isDark ? 1 : 0 }}
      />
    </span>
  );
};

/**
 * Mark plus wordmark lockup. Both theme variants of each image are
 * pre-rendered and cross-faded via opacity for a lag-free toggle.
 */
export const LogoLockup: React.FC<{
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  label?: string;
}> = ({ className, markClassName = 'h-7 w-7', wordClassName }) => {
  const { isDark } = useTheme();

  useEffect(preloadLogos, []);

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Logo className={markClassName} />
      <span className={cn('relative inline-block h-8 shrink-0', wordClassName)} style={{ minWidth: 120 }}>
        <img
          src="/logo-wordmark.png"
          alt="Starset Intelligence"
          draggable={false}
          style={{ ...FADE_STYLE, opacity: isDark ? 0 : 1 }}
        />
        <img
          src="/logo-wordmark-dark.png"
          alt=""
          draggable={false}
          style={{ ...FADE_STYLE, opacity: isDark ? 1 : 0 }}
        />
      </span>
    </span>
  );
};
