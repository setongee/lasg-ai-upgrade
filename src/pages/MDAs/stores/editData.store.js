import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useEditDataStore = create(
  persist(
    (set) => ({
      mdaEditData: {},
      originalData: {},
      activeDraftId: '',
      currentMda: '',
      isDirty: false,

      setMdaEditData: (value) =>
        set((state) => ({
          mdaEditData: value,
          isDirty: JSON.stringify(value) !== JSON.stringify(state.originalData),
        })),

      setOriginalData: (value) => set({ originalData: value }),

      setActiveDraftId: (id) => set({ activeDraftId: id }),

      setCurrentMda: (mda) => set({ currentMda: mda }),

      resetDirty: () => set({ isDirty: false }),

      clearEditData: () =>
        set({
          mdaEditData: {},
          originalData: {},
          activeDraftId: '',
          isDirty: false,
        }),
    }),
    {
      name: 'edit-data-storage',
      partialize: (state) => ({
        activeDraftId: state.activeDraftId,
        mdaEditData: state.mdaEditData,
        currentMda: state.currentMda,
      }),
    }
  )
);

export { useEditDataStore };
