import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? 'Light' : 'Dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm shadow-slate-200/60 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-white dark:shadow-none dark:hover:border-white/20 dark:hover:bg-white/20 dark:hover:text-white ${showLabel ? 'w-auto' : 'w-10 px-0'} ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <Icon className="h-4 w-4" />
      {showLabel && <span>{label}</span>}
    </button>
  );
};
