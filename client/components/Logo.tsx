import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  animated?: boolean;
}

/** The Starset brand mark. */
export const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-8', animated = false }) => (
  <img
    src="/logo.png"
    alt=""
    className={cn(className, animated && 'animate-spin-slow', 'object-contain')}
    draggable={false}
    aria-hidden="true"
  />
);

/**
 * Mark plus wordmark. Used in the navigation, footer, auth screens and the
 * product sidebar so the lockup is identical everywhere.
 */
export const LogoLockup: React.FC<{
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  label?: string;
}> = ({ className, markClassName = 'h-8 w-8', wordClassName, label = 'Starset' }) => (
  <span className={cn('inline-flex items-center gap-2.5', className)}>
    <Logo className={markClassName} />
    <span
      className={cn(
        'font-display text-[0.9375rem] font-semibold uppercase tracking-[0.16em] text-ink',
        wordClassName,
      )}
    >
      {label}
    </span>
  </span>
);
