import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from 'lucide-react';

import { Button } from '../components/Button';
import { AuthLayout, AuthError, AuthField } from '../components/AuthLayout';
import { supabase } from '../supabaseClient';

interface SignupProps {
  onLogin: () => void;
  onSwitchToLogin: () => void;
  onBackHome: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSwitchToLogin, onBackHome }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const passwordLongEnough = formData.password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passwordLongEnough) {
      setError('Choose a password of at least 8 characters.');
      return;
    }

    setIsLoading(true);
    const { email, password, name } = formData;

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('That email is already registered. Sign in instead.');
        } else {
          setError(signUpError.message);
        }
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setError('Could not create the account. Please try again.');
        setIsLoading(false);
        return;
      }

      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          full_name: name,
          email_text: email,
          role: 'contributor',
          profile_completed: false,
          trust_score: 100,
        },
        { onConflict: 'id' },
      );

      if (profileError) {
        console.error('Profile creation error:', profileError);
        setError(`Account created, but profile setup failed: ${profileError.message}`);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setDone(true);
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      seed="signup"
      seo={{
        title: 'Create an account — Starset',
        description: 'Create a free Starset contributor account and start recording audio tasks.',
        canonicalPath: '/signup',
      }}
      kicker="Create an account"
      title={done ? 'Account created' : 'Start contributing'}
      subtitle={
        done
          ? undefined
          : 'Free to join. You add your payout details after your first sign in.'
      }
      onBackHome={onBackHome}
      headerAction={
        <Button variant="ghost" size="sm" onClick={onSwitchToLogin} className="hidden sm:inline-flex">
          Sign in
        </Button>
      }
      aside={{
        heading: 'Your accent belongs in the data',
        body: 'Speech models only recognise the voices they were trained on. Recording a short task puts yours into that set.',
        points: [
          'Record on the device you already own',
          'Each task states its rate up front',
          'Consent is confirmed task by task',
        ],
      }}
      footer={
        done ? undefined : (
          <p className="text-center text-sm text-body">
            Already have an account?{' '}
            <button type="button" onClick={onSwitchToLogin} className="link font-medium">
              Sign in
            </button>
          </p>
        )
      }
    >
      {done ? (
        <div className="card p-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ok-soft text-[var(--ok)]">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
          </span>
          <h2 className="t-h4 mt-5">You&rsquo;re registered</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-body">
            If email confirmation is enabled for your account, check your inbox first. Then sign in
            and complete your profile — that is where your payout details go.
          </p>
          <Button className="mt-6" size="lg" block onClick={onSwitchToLogin}>
            Continue to sign in
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <>
          {error && <AuthError>{error}</AuthError>}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <AuthField
              id="signup-name"
              label="Full name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<User className="h-4 w-4" strokeWidth={1.75} />}
            />

            <AuthField
              id="signup-email"
              label="Email address"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<Mail className="h-4 w-4" strokeWidth={1.75} />}
            />

            <div>
              <label className="field-label" htmlFor="signup-password">Password</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
                  <Lock className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  aria-describedby="signup-password-hint"
                  className="field field-with-icon pr-11"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              <p
                id="signup-password-hint"
                className={formData.password && !passwordLongEnough ? 'field-error' : 'field-hint'}
              >
                Minimum 8 characters.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-md border border-line bg-paper-sunk p-3.5">
              <input
                id="signup-terms"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 flex-none rounded border-line"
              />
              <label htmlFor="signup-terms" className="text-xs leading-relaxed text-body">
                I am 18 or over and agree to the{' '}
                <a className="link" href="/terms" target="_blank" rel="noreferrer noopener">
                  Contributor Agreement
                </a>{' '}
                and{' '}
                <a className="link" href="/privacy" target="_blank" rel="noreferrer noopener">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <Button type="submit" size="lg" block isLoading={isLoading}>
              {isLoading ? 'Creating account…' : 'Create account'}
              {!isLoading && <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
            </Button>
          </form>
        </>
      )}
    </AuthLayout>
  );
};
