import { create } from 'zustand';

export const useEditModeStore = create((set) => ({
  device: 'desktop',
  setDevice: (value) => set(() => ({ device: value })),
  selectedComponent: '',
  setSelectedComponent: (value) => set(() => ({ selectedComponent: value })),
  viewMode: 'preview',
  setEditViewMode: (value) => set(() => ({ viewMode: value })),
}));
