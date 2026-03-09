import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useEditDataStore = create(
  persist(
    (set) => ({
      mdaEditData: {},
      previousMdaEditData: {},
      activeDraftId: '',
      setMdaEditData: (value) => set({ mdaEditData: value }),
      setPreviousMdaEditData: (value) => set({ previousMdaEditData: value }),
      setActiveDraftId: (activeDraftId) => set({ activeDraftId }),
    }),
    {
      name: 'edit-data-storage',
      partialize: (state) => ({ activeDraftId: state.activeDraftId }),
    }
  )
);

export { useEditDataStore };
