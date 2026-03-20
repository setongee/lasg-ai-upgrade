import { create } from 'zustand';
import { createDraft, getSingleDraft, updateDraft } from '../api/admin/drafts';
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

// Load all drafts from database for specific MDA
const loadDrafts = async () => {
  try {
    // Get MDA from theme store or browser URL parameter
    const themeStore = useThemeStore.getState();
    let mda = themeStore.slug;

    // If not in theme store, try to get from browser URL
    if (!mda) {
      const pathParts = window.location.pathname.split('/');
      const mdaIndex = pathParts.findIndex((part) => part === 'MDAs');
      if (mdaIndex !== -1 && pathParts[mdaIndex + 1]) {
        mda = pathParts[mdaIndex + 1];
      }
    }

    if (!mda) {
      console.warn('No MDA found for loading drafts');
      return {};
    }

    const draftsData = await getDraftsByMda(mda);
    if (draftsData) {
      // Convert array of drafts to object format for compatibility
      const draftsObject = {};
      draftsData.forEach((draft) => {
        draftsObject[draft._id] = draft;
      });
      return draftsObject;
    }
    return {};
  } catch (error) {
    console.error('Error loading drafts:', error);
    return {};
  }
};

// Save draft to database (create or update)
const saveDraftToDatabase = async (draftId, draftData) => {
  try {
    // Check if draft exists to determine create vs update
    const existingDraft = await getSingleDraft(draftId);

    if (existingDraft) {
      // Update existing draft
      const result = await updateDraft(draftId, draftData);
      return result;
    } else {
      // Create new draft
      const result = await createDraft(draftData);
      return result;
    }
  } catch (error) {
    console.error('Error saving draft to database:', error);
    return null;
  }
};

export const useEditDataStore = create((set, get) => ({
  mdaEditData: {},
  drafts: {},
  currentDraftId: null,

  // Set data for the current draft
  setMdaEditData: async (data) => {
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

    const draftData = {
      ...existingDraft,
      ...data,
      updatedAt: now,
    };

    // Save to database
    await saveDraftToDatabase(draftId, draftData);

    const newDrafts = {
      ...state.drafts,
      [draftId]: draftData,
    };

    return set({
      mdaEditData: draftData,
      drafts: newDrafts,
      currentDraftId: draftId,
    });
  },

  // Load a specific draft by ID
  loadDraft: async (draftId) => {
    try {
      const draftData = await getSingleDraft(draftId);

      if (!draftData) return;

      return set({
        mdaEditData: draftData,
        currentDraftId: draftId,
      });
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  },

  // Get list of all saved drafts
  getDraftList: () => {
    const drafts = get().drafts;
    return Object.values(drafts)
      .map((draft) => ({
        id: draft._id,
        date: draft.updatedAt || draft.createdAt,
        title: draft.title || 'Untitled Draft',
        data: draft,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Delete a specific draft
  deleteDraft: async (draftId) => {
    try {
      const { drafts, currentDraftId } = get();

      // Delete from database
      await deleteDraftApi(draftId);

      const newDrafts = { ...drafts };
      delete newDrafts[draftId];

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
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  },

  // Clear the current draft
  clearCurrentDraft: async () => {
    const { currentDraftId, deleteDraft } = get();
    if (currentDraftId) {
      await deleteDraft(currentDraftId);
    }

    return set({
      mdaEditData: {},
      currentDraftId: null,
    });
  },

  // Create a new draft with fresh data from mdaData
  createNewDraft: async () => {
    try {
      const themeStore = useThemeStore.getState();
      const baseData = themeStore.mdaData?.landingPage || {};

      const draftData = {
        ...baseData,
      };

      // Create in database and get the response with MongoDB-generated ID
      const response = await createDraft('Untitled Draft', draftData);

      if (!response || !response.data) {
        console.error('Failed to create draft: No response data');
        return;
      }

      const createdDraft = response.data;
      const draftId = createdDraft._id;

      const newDrafts = {
        ...get().drafts,
        [draftId]: createdDraft,
      };

      return set({
        mdaEditData: createdDraft,
        drafts: newDrafts,
        currentDraftId: draftId,
      });
    } catch (error) {
      console.error('Error creating new draft:', error);
    }
  },

  // Load or create today's draft
  loadOrCreateTodaysDraft: async () => {
    const state = get();

    // Create a new draft since we don't need to check for today's draft
    return get().createNewDraft();
  },

  // Initialize with any existing drafts from database
  loadInitialState: async () => {
    const drafts = await loadDrafts();

    return { drafts, currentDraftId: null };
  },

  // Rename a draft
  renameDraft: async (draftId, newTitle) => {
    try {
      const state = get();
      const draft = state.drafts[draftId];

      if (!draft) {
        console.error('Draft not found');
        return;
      }

      const updatedDraft = {
        ...draft,
        title: newTitle,
        updatedAt: getCurrentTimestamp(),
      };

      // Update in database
      await updateDraft(draftId, updatedDraft);

      const newDrafts = {
        ...state.drafts,
        [draftId]: updatedDraft,
      };

      return set({
        drafts: newDrafts,
        mdaEditData: state.currentDraftId === draftId ? updatedDraft : state.mdaEditData,
      });
    } catch (error) {
      console.error('Error renaming draft:', error);
    }
  },

  // Initialize with empty state
  // Drafts will be created through setMdaEditData
}));

// Initialize the store with saved state
const initializeStore = async () => {
  const store = useEditDataStore.getState();
  const initialState = await store.loadInitialState();
  useEditDataStore.setState({
    ...initialState,
    mdaEditData: initialState.currentDraftId
      ? initialState.drafts[initialState.currentDraftId] || {}
      : {},
  });
};

// Initialize the store
initializeStore();
