import { create } from 'zustand';

const useEditDataStore = create((set) => ({
  mdaEditData: {},
  setMdaEditData: (value) => set({ mdaEditData: value }),
}));

export { useEditDataStore };
