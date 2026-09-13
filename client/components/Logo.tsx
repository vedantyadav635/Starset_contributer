import React from 'react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  className?: string;
  animated?: boolean;
}

/**
 * The Starset brand mark (triangle/star icon).
 * Switches between light- and dark-theme variants automatically.
 * Fallback: light-theme asset if dark variant isn't available yet.
 */
export const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-8', animated = false }) => {
  const { isDark } = useTheme();
  // Dark variant will be added later – fall back to light logo for now
  const src = isDark ? '/logo-dark.png' : '/logo.png';

  return (
    <img
      src={src}
      alt=""
      className={cn(className, animated && 'animate-spin-slow', 'object-contain')}
      draggable={false}
      aria-hidden="true"
      onError={(e) => {
        // Fallback: if dark variant doesn't exist yet, use light logo
        const img = e.currentTarget;
        if (img.src.includes('logo-dark')) {
          img.src = '/logo.png';
        }
      }}
    />
  );
};

/**
 * Full wordmark lockup ("STARSET INTELLIGENCE" image).
 * Used in navigation, footer, auth screens, and sidebar.
 * Switches between light- and dark-theme variants automatically.
 */
export const LogoLockup: React.FC<{
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  label?: string;
}> = ({ className, markClassName = 'h-7 w-7', wordClassName }) => {
  const { isDark } = useTheme();
  // Dark variant will be added later – fall back to light wordmark for now
  const src = isDark ? '/logo-wordmark-dark.png' : '/logo-wordmark.png';

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Logo className={markClassName} />
      <img
        src={src}
        alt="Starset Intelligence"
        className={cn('h-8 object-contain', wordClassName)}
        draggable={false}
        onError={(e) => {
          // Fallback: if dark variant doesn't exist yet, use light wordmark
          const img = e.currentTarget;
          if (img.src.includes('logo-wordmark-dark')) {
            img.src = '/logo-wordmark.png';
          }
        }}
      />
    </span>
  );
};
