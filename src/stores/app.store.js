import { create } from 'zustand';

const THEME_KEY = 'lasg-theme';

// Saved choice wins; otherwise follow the OS preference.
const getInitialDark = () => {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
};

export const useApp = create((set) => ({
  isMobile: 0,
  setIsMobile: (value) => set(() => ({ isMobile: value })),
  initialSuggestions: [],
  setSuggestions: (data) => set(() => ({ initialSuggestions: data })),
  // `darkmode` is the site-wide theme; App.jsx mirrors it onto <html data-theme>.
  darkmode: getInitialDark(),
  setDarkmode: (value) => {
    try {
      window.localStorage.setItem(THEME_KEY, value ? 'dark' : 'light');
    } catch {
      // ignore storage errors (private browsing, etc.)
    }
    set(() => ({ darkmode: value }));
  },
}));
