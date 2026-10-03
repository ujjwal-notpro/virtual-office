import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleThemeEvent = () => {
      const saved = localStorage.getItem('theme');
      if (saved && (saved === 'dark' || saved === 'light')) {
        setTheme(saved);
      }
    };
    window.addEventListener('storage', handleThemeEvent);
    window.addEventListener('theme-changed', handleThemeEvent);
    return () => {
      window.removeEventListener('storage', handleThemeEvent);
      window.removeEventListener('theme-changed', handleThemeEvent);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      window.dispatchEvent(new Event('theme-changed'));
      return next;
    });
  };

  return { theme, toggleTheme };
}

