import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Mail, Lock, ShieldCheck, User } from 'lucide-react';

import { Button } from '../components/Button';
import { AuthLayout, AuthError, AuthField } from '../components/AuthLayout';
import { UserRole } from '../types';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onLogin: (role: UserRole) => void;
  onSwitchToSignup: () => void;
  onBackHome: () => void;
  onForgotPassword?: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onLogin,
  onSwitchToSignup,
  onBackHome,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<UserRole>('contributor');

  const { login } = useAuth();
  const isContributor = loginMode === 'contributor';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      if (!result.user) {
        setError('Login failed — no user data returned');
        setIsLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', result.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        setError('Failed to load your profile');
        setIsLoading(false);
        return;
      }

      const userRole = profile?.role || 'contributor';

      if (loginMode === 'admin') {
        if (userRole !== 'admin') {
          setError('This account is not authorised for admin access');
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }
        onLogin('admin');
        setIsLoading(false);
        return;
      }

      onLogin('contributor');
      setIsLoading(false);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const toggleLoginMode = () => {
    setLoginMode((prev) => (prev === 'contributor' ? 'admin' : 'contributor'));
    setError(null);
    setEmail('');
    setPassword('');
  };

  return (
    <AuthLayout
      seed="login"
      seo={{
        title: 'Sign in — Starset',
        description: 'Sign in to your Starset account to pick up audio tasks and check your submissions.',
        canonicalPath: '/login',
      }}
      kicker={isContributor ? 'Sign in' : 'Admin console'}
      title={isContributor ? 'Welcome back' : 'Administrator access'}
      subtitle={
        isContributor
          ? 'Sign in to pick up tasks and check your submissions.'
          : 'Restricted to accounts with the administrator role.'
      }
      onBackHome={onBackHome}
      headerAction={
        <Button variant="ghost" size="sm" onClick={onSwitchToSignup} className="hidden sm:inline-flex">
          Create an account
        </Button>
      }
      aside={{
        heading: 'Real voices, structured into data',
        body: 'Pick up a task, record it in your browser, and get paid for every submission that passes review.',
        points: [
          'Compensation shown before you start',
          'Automated checks, then a human listen',
          'Rejections always explain why',
        ],
      }}
      footer={
        <div className="space-y-4 text-center">
          {isContributor && (
            <p className="text-sm text-body">
              New here?{' '}
              <button type="button" onClick={onSwitchToSignup} className="link font-medium">
                Create an account
              </button>
            </p>
          )}

          <button
            type="button"
            onClick={toggleLoginMode}
            className="inline-flex items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            {isContributor
              ? <><ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Administrator sign in</>
              : <><User className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Contributor sign in</>}
          </button>
        </div>
      }
    >
      {!isContributor && (
        <div className="mb-6 flex items-start gap-2.5 rounded-md border border-line bg-paper-sunk px-3.5 py-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-muted" strokeWidth={1.75} aria-hidden="true" />
          <p className="text-xs text-body">
            Administrator sessions are logged. Non-admin accounts are signed out automatically.
          </p>
        </div>
      )}

      {error && <AuthError>{error}</AuthError>}

      <form onSubmit={handleLogin} className="space-y-5" noValidate>
        <AuthField
          id="login-email"
          label="Email address"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-4 w-4" strokeWidth={1.75} />}
        />

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label className="field-label" htmlFor="login-password">Password</label>
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="mb-[0.4375rem] text-xs font-medium text-signal transition-colors hover:text-signal-hover"
              >
                Forgot password?
              </button>
            )}
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
              <Lock className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="Your password"
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
        </div>

        <Button type="submit" size="lg" block isLoading={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign in'}
          {!isLoading && <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
        </Button>
      </form>
    </AuthLayout>
  );
};
