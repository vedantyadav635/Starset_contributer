import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

const STORAGE_KEY = 'cookie-consent';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch { /* storage blocked */ }
    if (stored) return;

    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const decide = (value: 'accepted' | 'declined') => {
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* storage blocked */ }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="animate-reveal fixed inset-x-4 bottom-4 z-[90] sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm"
    >
      <div className="card relative bg-surface p-5 shadow-lg">
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss cookie notice"
          className="absolute right-3 top-3 rounded p-1 text-muted transition-colors hover:text-ink"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <p className="t-meta">Cookies</p>
        <p className="mt-2 pr-6 text-sm leading-relaxed text-body">
          We use essential cookies to keep you signed in, plus optional analytics to understand how
          the platform is used. You can decline the optional ones.
        </p>

        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={() => decide('accepted')} className="flex-1">
            Accept
          </Button>
          <Button size="sm" variant="secondary" onClick={() => decide('declined')} className="flex-1">
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
};
