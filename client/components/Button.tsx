import React from 'react';
import { cn } from '../lib/utils';

/**
 * Starset button.
 *
 * Charcoal is the primary action; the signal blue is reserved for moments
 * that genuinely need it. The legacy variant names (`black`, `glow`,
 * `outline`) are kept as aliases so existing call sites keep working.
 */
export type ButtonVariant =
  | 'primary'
  | 'signal'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'quiet-danger'
  // legacy aliases
  | 'outline'
  | 'black'
  | 'glow';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  /** Renders full-width — convenient inside forms and mobile stacks. */
  block?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  signal: 'btn-signal',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  'quiet-danger': 'btn-quiet-danger',
  outline: 'btn-secondary',
  black: 'btn-primary',
  glow: 'btn-signal',
};

const Spinner = () => (
  <svg
    className="h-4 w-4 shrink-0 animate-spin-slow"
    style={{ animationDuration: '0.7s' }}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading = false,
  block = false,
  disabled,
  type = 'button',
  ...props
}, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn('btn', `btn-${size}`, variantClass[variant], block && 'w-full', className)}
    disabled={disabled || isLoading}
    aria-busy={isLoading || undefined}
    {...props}
  >
    {isLoading && <Spinner />}
    {children}
  </button>
));

Button.displayName = 'Button';
