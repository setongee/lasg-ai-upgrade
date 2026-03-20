import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper function to get MDA-specific storage name
const getStorageName = () => {
  try {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('MDA__TOKEN');
      if (token) {
        const parsed = JSON.parse(token);
        const mdaIdentifier = parsed.mda || parsed.slug || 'default';
        return `edit-data-storage-${mdaIdentifier}`;
      }
    }
  } catch (error) {
    console.warn('Could not determine MDA for storage key:', error);
  }
  return 'edit-data-storage-default';
};

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
      name: getStorageName(),
      partialize: (state) => ({
        activeDraftId: state.activeDraftId,
        mdaEditData: state.mdaEditData,
        currentMda: state.currentMda,
      }),
    }
  )
);

export { useEditDataStore };
