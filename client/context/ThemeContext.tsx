import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'starset-theme';
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Light is Starset's canonical surface. Dark remains fully supported —
 * it is honoured when explicitly chosen, or when the OS asks for it and the
 * visitor has not made a choice of their own.
 */
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Follow the OS only while the visitor has not picked a theme themselves.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (!window.localStorage.getItem(THEME_STORAGE_KEY)) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark';

    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);

    const themeColor = isDark ? '#0b0c0e' : '#fbfaf8';
    document
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((meta) => { meta.content = themeColor; });
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    isDark: theme === 'dark',
    setTheme: setThemeState,
    toggleTheme: () => setThemeState((current) => (current === 'dark' ? 'light' : 'dark')),
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
