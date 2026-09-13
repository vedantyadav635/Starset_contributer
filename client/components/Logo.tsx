import React, { useEffect } from 'react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

/* ── Preload all logo variants on first mount so theme toggles are instant ── */
const LOGO_SOURCES = [
  '/logo.png', '/logo-dark.png',
  '/logo-lockup.png', '/logo-lockup-dark.png',
];
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
 * The Starset brand mark (triangle/star icon only).
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
 * Full logo lockup — icon + divider + "STARSET INTELLIGENCE" as a single
 * combined image. Both theme variants are pre-rendered and cross-faded
 * via opacity for an instant, lag-free theme toggle.
 */
export const LogoLockup: React.FC<{
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  label?: string;
}> = ({ className }) => {
  const { isDark } = useTheme();

  useEffect(preloadLogos, []);

  return (
    <span className={cn('relative inline-block h-10 md:h-12 shrink-0', className)} style={{ minWidth: 150 }}>
      <img
        src="/logo-lockup.png"
        alt="Starset Intelligence"
        draggable={false}
        style={{ ...FADE_STYLE, objectFit: 'contain', objectPosition: 'left center', opacity: isDark ? 0 : 1 }}
      />
      <img
        src="/logo-lockup-dark.png"
        alt=""
        draggable={false}
        style={{ ...FADE_STYLE, objectFit: 'contain', objectPosition: 'left center', opacity: isDark ? 1 : 0 }}
      />
    </span>
  );
};
