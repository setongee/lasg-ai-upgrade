import { create } from 'zustand';

export const useApp = create((set) => ({
  isMobile: 0,
  setIsMobile: (value) => set(() => ({ isMobile: value })),
  initialSuggestions: [],
  setSuggestions: (data) => set(() => ({ initialSuggestions: data })),
  darkmode: false,
  setDarkmode: (value) => set(() => ({ darkmode: value })),
}));
