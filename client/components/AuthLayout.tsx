import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { LogoLockup } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Waveform, Spectrogram } from './Waveform';
import { SEOHead } from './SEOHead';
import { cn } from '../lib/utils';

/* ═══════════════════════════════════════════════════════════════════════════
   Shared shell for every authentication screen.

   A single quiet column on the left carrying the brand and a restrained
   signal visual, and the form on the right. Same header, same footer, same
   spacing across sign in, sign up, and both password screens.
   ═══════════════════════════════════════════════════════════════════════════ */

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Small label above the title, e.g. "Sign in". */
  kicker: string;
  title: string;
  subtitle?: React.ReactNode;
  onBackHome: () => void;
  /** Right-hand header action, e.g. a link to the opposite auth screen. */
  headerAction?: React.ReactNode;
  /** Content below the card, e.g. "Already have an account?". */
  footer?: React.ReactNode;
  /** Seeds the decorative waveform so each screen differs subtly. */
  seed?: string;
  /** Aside copy shown on large screens. */
  aside?: { heading: string; body: string; points?: string[] };
  /** Page title and canonical path for this auth screen. */
  seo?: { title: string; description: string; canonicalPath: string };
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  kicker,
  title,
  subtitle,
  onBackHome,
  headerAction,
  footer,
  seed = 'auth',
  aside,
  seo,
}) => (
  <div className="min-h-[100dvh] bg-paper">
    {/* Auth screens are useful to a signed-out visitor but hold no indexable content. */}
    {seo && (
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonicalPath={seo.canonicalPath}
        noindex
      />
    )}

    {/* ── Header ── */}
    <header className="border-b border-line">
      <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-4">
        <button type="button" onClick={onBackHome} className="flex-none" aria-label="Starset home">
          <LogoLockup markClassName="h-8 w-8" />
        </button>

        <div className="flex items-center gap-3">
          {headerAction}
          <ThemeToggle />
        </div>
      </div>
    </header>

    <div className="shell grid min-h-[calc(100dvh-var(--nav-h))] items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
      {/* ── Aside (large screens only) ── */}
      {aside ? (
        <aside className="relative hidden flex-col justify-center py-16 lg:flex">
          <div className="pointer-events-none absolute inset-y-0 -left-[100vw] right-0 -z-10" aria-hidden="true">
            <div className="field-dots field-fade absolute inset-0 opacity-40" />
          </div>

          <div className="max-w-md">
            <h2 className="t-h2">{aside.heading}</h2>
            <p className="mt-4 text-body">{aside.body}</p>

            {aside.points && (
              <ul className="mt-8 space-y-3">
                {aside.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-body">
                    <span className="mt-2 h-1 w-1 flex-none rounded-full bg-signal" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-12 card overflow-hidden">
              <div className="border-b border-line px-4 py-2.5">
                <span className="t-meta">Signal</span>
              </div>
              <div className="px-4 py-5">
                <Waveform seed={`${seed}-aside`} bars={72} height={40} />
                <div className="mt-4">
                  <Spectrogram seed={`${seed}-aside-spec`} columns={72} rows={10} height={48} />
                </div>
              </div>
            </div>
          </div>
        </aside>
      ) : (
        <div className="hidden lg:block" aria-hidden="true" />
      )}

      {/* ── Form column ── */}
      <main className={cn('flex flex-col justify-center py-10 sm:py-14', !aside && 'lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-md')}>
        <div className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={onBackHome}
            className="link-arrow mb-8 text-muted hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            Back to site
          </button>

          <p className="t-meta">{kicker}</p>
          <h1 className="t-h2 mt-2">{title}</h1>
          {subtitle && <p className="mt-3 text-body">{subtitle}</p>}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-8 border-t border-line pt-6">{footer}</div>}
        </div>
      </main>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────── */

/** Inline form error, announced to assistive tech. */
export const AuthError: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    role="alert"
    className="mb-5 flex items-start gap-2.5 rounded-md border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] bg-danger-soft px-3.5 py-3 text-sm text-[color:var(--danger)]"
  >
    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[var(--danger)]" aria-hidden="true" />
    <span>{children}</span>
  </div>
);

/** Text field with a leading icon slot and a proper <label>. */
export const AuthField: React.FC<{
  id: string;
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  trailing?: React.ReactNode;
  children?: never;
} & React.InputHTMLAttributes<HTMLInputElement>> = ({
  id,
  label,
  icon,
  hint,
  trailing,
  className,
  ...inputProps
}) => (
  <div>
    <label className="field-label" htmlFor={id}>{label}</label>
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
          {icon}
        </span>
      )}
      <input
        id={id}
        className={cn('field', icon && 'field-with-icon', trailing && 'pr-11', className)}
        {...inputProps}
      />
      {trailing && (
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</span>
      )}
    </div>
    {hint && <p className="field-hint">{hint}</p>}
  </div>
);
