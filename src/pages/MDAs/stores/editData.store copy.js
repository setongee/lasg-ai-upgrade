import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { useThemeStore } from './theme.store';

// Helper function to get current timestamp
const getCurrentTimestamp = () => new Date().toISOString();

// Load all drafts from localStorage
const loadDrafts = () => {
  try {
    const saved = localStorage.getItem('mdaEditDataDrafts');
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Error loading drafts:', error);
    return {};
  }
};

// Save drafts to localStorage
const saveDrafts = (drafts) => {
  try {
    localStorage.setItem('mdaEditDataDrafts', JSON.stringify(drafts));
  } catch (error) {
    console.error('Error saving drafts:', error);
  }
};

export const useEditDataStore = create((set, get) => ({
  mdaEditData: {},
  drafts: {},
  currentDraftId: null,

  // Set data for the current draft
  setMdaEditData: (data) => {
    const state = get();
    const draftId = state.currentDraftId || uuidv4();
    const now = getCurrentTimestamp();
    
    // If this is a new draft, set up the initial metadata
    if (!state.currentDraftId) {
      const themeStore = useThemeStore.getState();
      const baseData = themeStore.mdaData?.landingPage || {};
      
      const draftData = {
        ...baseData,
        ...data,
        _draftMeta: {
          id: draftId,
          title: 'New Draft',
          createdAt: now,
          updatedAt: now,
        },
      };

      const newDrafts = {
        ...state.drafts,
        [draftId]: draftData,
      };

      saveDrafts(newDrafts);
      
      // Save the current draft ID to localStorage
      try {
        localStorage.setItem('currentDraftId', draftId);
      } catch (error) {
        console.error('Error saving currentDraftId to localStorage:', error);
      }

      return set({
        mdaEditData: draftData,
        drafts: newDrafts,
        currentDraftId: draftId,
      });
    }

    // Existing draft, just update it
    const draftData = {
      ...data,
      _draftMeta: {
        ...state.drafts[draftId]?._draftMeta,
        updatedAt: now,
      },
    };

    const newDrafts = {
      ...state.drafts,
      [draftId]: draftData,
    };

    saveDrafts(newDrafts);

    return set({
      mdaEditData: draftData,
      drafts: newDrafts,
    });
  },

  // Load a specific draft by ID
  loadDraft: (draftId) => {
    const drafts = get().drafts;
    const draftData = drafts[draftId];

    if (!draftData) return;

    // Save the currentDraftId to localStorage
    try {
      localStorage.setItem('currentDraftId', draftId);
    } catch (error) {
      console.error('Error saving currentDraftId to localStorage:', error);
    }

    return set({
      mdaEditData: draftData,
      currentDraftId: draftId,
    });
  },

  // Get list of all saved drafts
  getDraftList: () => {
    const drafts = get().drafts;
    return Object.values(drafts)
      .filter((draft) => draft._draftMeta) // Only include drafts with metadata
      .map((draft) => ({
        id: draft._draftMeta.id,
        date: draft._draftMeta.updatedAt || draft._draftMeta.createdAt,
        title: draft.title || 'Untitled Draft',
        data: draft,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Delete a specific draft
  deleteDraft: (draftId) => {
    const { drafts, currentDraftId } = get();
    const newDrafts = { ...drafts };
    delete newDrafts[draftId];

    saveDrafts(newDrafts);

    return set({
      drafts: newDrafts,
      // Clear current draft if we're deleting it
      ...(currentDraftId === draftId
        ? {
            mdaEditData: {},
            currentDraftId: null,
          }
        : {}),
    });
  },

  // Clear the current draft
  clearCurrentDraft: () => {
    const { currentDraftId, deleteDraft } = get();
    if (currentDraftId) {
      deleteDraft(currentDraftId);

      // Clear from localStorage
      try {
        localStorage.removeItem('currentDraftId');
      } catch (error) {
        console.error('Error removing currentDraftId from localStorage:', error);
      }
    }

    return set({
      mdaEditData: {},
      currentDraftId: null,
    });
  },

  // Initialize with empty state
  // Drafts will be created through setMdaEditData
}));

// Initialize with any existing drafts from localStorage
const initialState = (() => {
  const drafts = loadDrafts();
  let currentDraftId = null;
  
  try {
    currentDraftId = localStorage.getItem('currentDraftId');
    // Verify the saved draft exists
    if (currentDraftId && !drafts[currentDraftId]) {
      currentDraftId = null;
      localStorage.removeItem('currentDraftId');
    }
  } catch (error) {
    console.error('Error loading currentDraftId from localStorage:', error);
  }

  return {
    drafts,
    currentDraftId,
    mdaEditData: currentDraftId ? drafts[currentDraftId] : {}
  };
})();

// Set the initial state
useEditDataStore.setState(initialState);
