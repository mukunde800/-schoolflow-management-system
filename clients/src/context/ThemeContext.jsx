import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [resolvedTheme, setResolvedTheme] = useState('light');

  // Résout le thème réel (si "system", regarde les préférences OS)
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const resolve = () => {
      if (theme === 'system') {
        setResolvedTheme(media.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    resolve();
    media.addEventListener('change', resolve);
    return () => media.removeEventListener('change', resolve);
  }, [theme]);

  // Applique la classe `dark` sur <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    // Cycle : light → dark → system
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme doit être utilisé dans ThemeProvider');
  return ctx;
};