import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Helper function to safely store large data
const safeStorage = {
  getItem: (name) => {
    try {
      const item = localStorage.getItem(name);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      // Compress the data before storing
      const compressed = JSON.stringify(value);
      // Check if the data is too large (leaving some room for other data)
      if (new Blob([compressed]).size > 2 * 1024 * 1024) {
        // 2MB limit
        console.warn('Data too large for localStorage, storing only critical fields');
        // Store only essential data
        const essentialData = {
          ...value.state,
          mdaData: {
            // Only keep minimal required fields
            name: value.state.mdaData?.name,
            mda: value.state.mdaData?.mda,
            // Add other critical fields as needed
          },
        };
        localStorage.setItem(name, JSON.stringify(essentialData));
      } else {
        localStorage.setItem(name, compressed);
      }
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
      // Continue without storing if there's an error
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
    }
  },
};

const useThemeStore = create(
  persist(
    (set) => ({
      isMobile: false,
      setIsMobile: (value) => set(() => ({ isMobile: value })),
      mda: '',
      setMda: (value) =>
        set((state) => {
          // Only update if the value has changed
          if (state.mda !== value) {
            return { mda: value };
          }
          return state;
        }),
      mdaData: {},
      setMdaData: (value) =>
        set((state) => {
          // Only update if the value has changed
          if (JSON.stringify(state.mdaData) !== JSON.stringify(value)) {
            return { mdaData: value };
          }
          return state;
        }),
    }),
    {
      name: 'mda-theme-storage',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        mdaData: state.mdaData,
        mda: state.mda,
      }),
      onRehydrateStorage: () => (state) => {
        ('hydration starts');
        return (state, error) => {
          if (error) {
            console.error('Error during hydration:', error);
            // Clear corrupted data
            localStorage.removeItem('mda-theme-storage');
          } else {
            ('hydration finished');
          }
        };
      },
    }
  )
);

// Function to clear theme storage if needed
export const clearThemeStorage = () => {
  try {
    localStorage.removeItem('mda-theme-storage');
  } catch (error) {
    console.error('Error clearing theme storage:', error);
  }
};

export { useThemeStore };
