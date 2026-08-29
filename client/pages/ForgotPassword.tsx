import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail, CheckCircle2, ShieldCheck, User } from 'lucide-react';

import { Button } from '../components/Button';
import { AuthLayout, AuthError, AuthField } from '../components/AuthLayout';
import { supabase } from '../supabaseClient';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onBackHome: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin, onBackHome }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState<'contributor' | 'admin'>('contributor');

  const isContributor = mode === 'contributor';

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!email.trim()) {
        setError('Enter the email address on your account.');
        setIsLoading(false);
        return;
      }

      // Admin resets are gated on the account actually holding the admin role,
      // but we never reveal whether an address exists.
      if (mode === 'admin') {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role_text')
          .eq('email', email.trim().toLowerCase())
          .single();

        if (profileError || !profile) {
          setSuccess(true);
          setIsLoading(false);
          return;
        }

        if (profile.role_text !== 'admin') {
          setError('This email is not registered as an administrator.');
          setIsLoading(false);
          return;
        }
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/#reset-password`,
      });

      if (resetError) {
        console.error('Reset password error:', resetError);
        setError(resetError.message);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'contributor' ? 'admin' : 'contributor'));
    setError(null);
    setSuccess(false);
    setEmail('');
  };

  return (
    <AuthLayout
      seed="forgot"
      seo={{
        title: 'Reset your password — Starset',
        description: 'Request a password reset link for your Starset account.',
        canonicalPath: '/forgot-password',
      }}
      kicker="Password reset"
      title={isContributor ? 'Reset your password' : 'Administrator password reset'}
      subtitle={
        success
          ? undefined
          : 'Enter the email address on your account and we will send a reset link.'
      }
      onBackHome={onBackHome}
      headerAction={
        <Button variant="ghost" size="sm" onClick={onBackToLogin} className="hidden sm:inline-flex">
          Back to sign in
        </Button>
      }
      aside={{
        heading: 'Account recovery',
        body: 'Reset links are sent to the address on the account and expire after use. We never disclose whether an address is registered.',
      }}
      footer={
        <div className="space-y-4 text-center">
          <button type="button" onClick={onBackToLogin} className="link-arrow mx-auto text-body hover:text-ink">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            Back to sign in
          </button>

          <button
            type="button"
            onClick={toggleMode}
            className="mx-auto flex items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            {isContributor
              ? <><ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Administrator reset</>
              : <><User className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Contributor reset</>}
          </button>
        </div>
      }
    >
      {success ? (
        <div className="card p-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ok-soft text-[var(--ok)]">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
          </span>
          <h2 className="t-h4 mt-5">Check your inbox</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-body">
            If an account exists for <span className="font-medium text-ink">{email}</span>, a reset
            link is on its way. Check your spam folder if it has not arrived in a few minutes.
          </p>

          <Button className="mt-6" size="lg" block onClick={onBackToLogin}>
            <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Back to sign in
          </Button>
          <button
            type="button"
            onClick={() => { setSuccess(false); setEmail(''); }}
            className="mt-4 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            Didn&rsquo;t receive it? Try again
          </button>
        </div>
      ) : (
        <>
          {error && <AuthError>{error}</AuthError>}

          <form onSubmit={handleResetPassword} className="space-y-5" noValidate>
            <AuthField
              id="forgot-email"
              label={isContributor ? 'Email address' : 'Administrator email'}
              type="email"
              required
              autoComplete="email"
              placeholder={isContributor ? 'you@example.com' : 'admin@starset.ai'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" strokeWidth={1.75} />}
            />

            <Button type="submit" size="lg" block isLoading={isLoading}>
              {isLoading ? 'Sending…' : 'Send reset link'}
              {!isLoading && <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
            </Button>
          </form>
        </>
      )}
    </AuthLayout>
  );
};
