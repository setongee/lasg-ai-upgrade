import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { useThemeStore } from './theme.store';

// Helper functions
const getCurrentTimestamp = () => new Date().toISOString();

// Get today's date string in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Format date for display (e.g., 'Jan 29, 2024')
const formatDisplayDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

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

    // If no current draft, create a new one for today
    if (!state.currentDraftId) {
      return get().loadOrCreateTodaysDraft();
    }

    const draftId = state.currentDraftId;
    const now = getCurrentTimestamp();
    const today = getTodayDateString();

    // Get existing draft or create a new one
    const existingDraft = state.drafts[draftId] || {};
    const draftMeta = existingDraft._draftMeta || {
      id: draftId,
      title: `Draft - ${formatDisplayDate(now)}`,
      createdAt: now,
      date: today,
    };

    const draftData = {
      ...existingDraft,
      ...data,
      _draftMeta: {
        ...draftMeta,
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

  // Create a new draft with fresh data from mdaData
  createNewDraft: () => {
    const themeStore = useThemeStore.getState();
    const baseData = themeStore.mdaData?.landingPage || {};
    const now = getCurrentTimestamp();
    const draftId = uuidv4();
    const today = getTodayDateString();

    const draftData = {
      ...baseData,
      _draftMeta: {
        id: draftId,
        title: `Draft - ${formatDisplayDate(now)}`,
        createdAt: now,
        updatedAt: now,
        date: today,
      },
    };

    const newDrafts = {
      ...get().drafts,
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
  },

  // Load or create today's draft
  loadOrCreateTodaysDraft: () => {
    const state = get();
    const today = getTodayDateString();

    // Try to find today's draft
    const todaysDraft = Object.values(state.drafts).find(
      (draft) => draft._draftMeta?.date === today
    );

    if (todaysDraft) {
      // Load existing draft for today
      return set({
        mdaEditData: todaysDraft,
        currentDraftId: todaysDraft._draftMeta.id,
      });
    } else {
      // Create a new draft for today
      return get().createNewDraft();
    }
  },

  // Initialize with any existing drafts from localStorage
  loadInitialState: () => {
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
      console.error('Error loading initial state:', error);
      currentDraftId = null;
    }

    return { drafts, currentDraftId };
  },

  // Rename a draft
  renameDraft: (draftId, newTitle) => {
    const state = get();
    const draft = state.drafts[draftId];
    
    if (!draft) {
      console.error('Draft not found');
      return;
    }

    const updatedDraft = {
      ...draft,
      title: newTitle,
      _draftMeta: {
        ...draft._draftMeta,
        updatedAt: getCurrentTimestamp(),
      },
    };

    const newDrafts = {
      ...state.drafts,
      [draftId]: updatedDraft,
    };

    saveDrafts(newDrafts);

    return set({
      drafts: newDrafts,
      mdaEditData: state.currentDraftId === draftId ? updatedDraft : state.mdaEditData,
    });
  },

  // Initialize with empty state
  // Drafts will be created through setMdaEditData
}));

// Initialize the store with saved state
const store = useEditDataStore.getState();
const initialState = store.loadInitialState();
useEditDataStore.setState({
  ...initialState,
  mdaEditData: initialState.currentDraftId
    ? initialState.drafts[initialState.currentDraftId] || {}
    : {},
});
