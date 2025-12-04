import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: '',
  addMessage: (value) => set((state) => ({ messages: value })),
  checkIsChatOpen: false,
  setCheckIsChatOpen: (value) => set(() => ({ checkIsChatOpen: value })),
  languagePreference: 'english',
  setLanguagePreference: (value) => set(() => ({ languagePreference: value })),
}));
