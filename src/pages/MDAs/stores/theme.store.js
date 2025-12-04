import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  isMobile: false,
  setIsMobile: (value) => set(() => ({ isMobile: value })),
  mda: '',
  setMda: (value) => set(() => ({ mda: value })),
  mdaData: {},
  setMdaData: (value) => set(() => ({ mdaData: value })),
}));
