import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, CheckCircle2, Circle } from 'lucide-react';

import { Button } from '../components/Button';
import { AuthLayout, AuthError } from '../components/AuthLayout';
import { supabase } from '../supabaseClient';
import { cn } from '../lib/utils';

interface ResetPasswordProps {
  onBackToLogin: () => void;
  onBackHome: () => void;
}

const STRENGTH = [
  { label: 'Weak', tone: 'var(--danger)' },
  { label: 'Weak', tone: 'var(--danger)' },
  { label: 'Fair', tone: 'var(--warn)' },
  { label: 'Good', tone: 'var(--warn)' },
  { label: 'Strong', tone: 'var(--ok)' },
  { label: 'Very strong', tone: 'var(--ok)' },
];

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onBackToLogin, onBackHome }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const checks = [
    { met: password.length >= 8, label: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), label: 'An uppercase letter' },
    { met: /[a-z]/.test(password), label: 'A lowercase letter' },
    { met: /[0-9]/.test(password), label: 'A number' },
    { met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password), label: 'A symbol' },
  ];

  const score = checks.filter((c) => c.met).length;
  const strength = STRENGTH[score];
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('The two passwords do not match.');
        setIsLoading(false);
        return;
      }
      if (score < 3) {
        setError('Choose a stronger password — meet at least three of the requirements below.');
        setIsLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        console.error('Password update error:', updateError);
        setError(updateError.message);
        setIsLoading(false);
        return;
      }

      setSuccess(true);

      // Sign out so the new password is used on the next sign in.
      setTimeout(() => { supabase.auth.signOut(); }, 1000);
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      seed="reset"
      seo={{
        title: 'Choose a new password — Starset',
        description: 'Set a new password for your Starset account.',
        canonicalPath: '/reset-password',
      }}
      kicker="Password reset"
      title={success ? 'Password updated' : 'Choose a new password'}
      subtitle={success ? undefined : 'This replaces the password on your account immediately.'}
      onBackHome={onBackHome}
      aside={{
        heading: 'One last step',
        body: 'Pick something you have not used elsewhere. You will be signed out and asked to sign in again with the new password.',
      }}
    >
      {success ? (
        <div className="card p-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ok-soft text-[var(--ok)]">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
          </span>
          <h2 className="t-h4 mt-5">All set</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-body">
            Your password has been changed. Sign in with the new one to continue.
          </p>
          <Button className="mt-6" size="lg" block onClick={onBackToLogin}>
            Continue to sign in
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <>
          {error && <AuthError>{error}</AuthError>}

          <form onSubmit={handleResetPassword} className="space-y-5" noValidate>
            {/* New password */}
            <div>
              <label className="field-label" htmlFor="new-password">New password</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
                  <Lock className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Enter a new password"
                  className="field field-with-icon pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-muted transition-colors hover:text-ink"
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    : <Eye className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
                </button>
              </div>

              {/* Strength */}
              {password.length > 0 && (
                <div className="mt-3.5">
                  <div className="flex items-center justify-between">
                    <span className="t-meta">Strength</span>
                    <span className="t-meta" style={{ color: strength.tone }}>{strength.label}</span>
                  </div>
                  <div className="mt-2 flex gap-1" role="presentation">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <span
                        key={level}
                        className="h-[3px] flex-1 rounded-full transition-colors duration-200"
                        style={{ background: level <= score ? strength.tone : 'var(--line)' }}
                      />
                    ))}
                  </div>

                  <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {checks.map((check) => (
                      <li
                        key={check.label}
                        className={cn('flex items-center gap-1.5 text-xs', check.met ? 'text-[color:var(--ok)]' : 'text-muted')}
                      >
                        {check.met
                          ? <CheckCircle2 className="h-3.5 w-3.5 flex-none" strokeWidth={2} aria-hidden="true" />
                          : <Circle className="h-3.5 w-3.5 flex-none" strokeWidth={1.5} aria-hidden="true" />}
                        {check.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="field-label" htmlFor="confirm-password">Confirm password</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
                  <Lock className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter the password"
                  aria-invalid={mismatch}
                  aria-describedby={mismatch ? 'confirm-error' : undefined}
                  className="field field-with-icon pr-11"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-muted transition-colors hover:text-ink"
                >
                  {showConfirm
                    ? <EyeOff className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    : <Eye className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
                </button>
              </div>
              {mismatch && <p id="confirm-error" className="field-error">The two passwords do not match.</p>}
            </div>

            <Button type="submit" size="lg" block isLoading={isLoading}>
              {isLoading ? 'Updating…' : 'Update password'}
              {!isLoading && <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
            </Button>
          </form>
        </>
      )}
    </AuthLayout>
  );
};
