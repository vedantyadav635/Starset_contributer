import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();
  const Icon = isDark ? Sun : Moon;
  const next = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={cn(
        'inline-flex h-9 items-center justify-center gap-2 rounded-md border border-line text-muted',
        'transition-colors hover:border-line-strong hover:text-ink',
        showLabel ? 'px-3 text-sm font-medium' : 'w-9',
        className,
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      {showLabel && <span className="capitalize">{next}</span>}
    </button>
  );
};
