import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: [
    {
      role: 'assistant',
      content: ``,
    },
  ],
  addMessage: (value) => set((state) => ({ messages: [...state.messages, value] })),
  isChatOpen: false,
  setIsChatOpen: (value) => set(() => ({ isChatOpen: value })),
  languagePreference: 'English',
  setLanguagePreference: (value) => set(() => ({ languagePreference: value })),
}));
