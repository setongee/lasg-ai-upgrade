import { create } from 'zustand';

const DARK_MODE_KEY = 'lasg-mda-dark-mode';

const getStoredDarkMode = () => {
  try {
    return window.localStorage.getItem(DARK_MODE_KEY) === 'true';
  } catch {
    return false;
  }
};

const useThemeStore = create((set) => ({
  isMobile: false,
  setIsMobile: (value) => set({ isMobile: value }),
  mda: '',
  setMda: (value) => set({ mda: value }),
  mdaData: {},
  setMdaData: (value) => set({ mdaData: value }),
  refetchData: null,
  setRefetchData: (fn) => set({ refetchData: fn }),
  isDarkMode: getStoredDarkMode(),
  toggleDarkMode: () =>
    set((state) => {
      const next = !state.isDarkMode;
      try {
        window.localStorage.setItem(DARK_MODE_KEY, String(next));
      } catch {
        // ignore storage errors (private browsing, etc.)
      }
      return { isDarkMode: next };
    }),
}));

export { useThemeStore };
