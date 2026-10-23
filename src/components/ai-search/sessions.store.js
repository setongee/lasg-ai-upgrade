// Chat sessions for the main-site assistant. Visitors aren't logged in, so
// sessions live in this browser's localStorage only (capped so they can never
// grow without bound). UI state (open/streaming) is deliberately not persisted.
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const MAX_SESSIONS = 40;
const MAX_MESSAGES = 60;

const uid = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

// localStorage can be unavailable (private mode) or full — never let that
// break the chat, it just won't be remembered.
const safeStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // ignore quota / privacy-mode errors
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};

const emptyScope = () => ({ mdas: [], categories: [] });

const titleFrom = (text) => {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length > 48 ? `${clean.slice(0, 47)}…` : clean || 'New chat';
};

const touch = (sessions, id, fn) =>
  sessions.map((s) => (s.id === id ? { ...fn(s), updatedAt: Date.now() } : s));

export const useSessions = create(
  persist(
    (set, get) => ({
      sessions: [], // newest activity first
      activeId: null,
      open: false,
      streamingId: null,

      setOpen: (open) => set({ open }),
      setStreaming: (streamingId) => set({ streamingId }),

      // Reuses the active session if it's still empty, so spamming "New chat"
      // doesn't litter the list with blank sessions.
      newSession: (scope) => {
        const { sessions, activeId } = get();
        const current = sessions.find((s) => s.id === activeId);
        if (current && current.messages.length === 0) {
          set({
            sessions: touch(sessions, current.id, (s) => ({ ...s, scope: scope || emptyScope() })),
          });
          return current.id;
        }
        const session = {
          id: uid(),
          title: 'New chat',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          scope: scope || emptyScope(),
          messages: [],
        };
        set({ sessions: [session, ...sessions].slice(0, MAX_SESSIONS), activeId: session.id });
        return session.id;
      },

      selectSession: (id) => set({ activeId: id }),

      deleteSession: (id) => {
        const { sessions, activeId } = get();
        const next = sessions.filter((s) => s.id !== id);
        set({ sessions: next, activeId: activeId === id ? (next[0]?.id ?? null) : activeId });
      },

      clearAll: () => set({ sessions: [], activeId: null }),

      setScope: (id, scope) => set({ sessions: touch(get().sessions, id, (s) => ({ ...s, scope })) }),

      // Appends messages, titling the session from its first user message and
      // moving it to the top of the list.
      appendMessages: (id, msgs) => {
        const stamped = msgs.map((m) => ({ id: uid(), at: Date.now(), ...m }));
        const sessions = get().sessions;
        const updated = touch(sessions, id, (s) => {
          const firstUser = s.messages.length === 0 ? stamped.find((m) => m.role === 'user') : null;
          return {
            ...s,
            title: firstUser ? titleFrom(firstUser.content) : s.title,
            messages: [...s.messages, ...stamped].slice(-MAX_MESSAGES),
          };
        });
        const moved = updated.find((s) => s.id === id);
        set({ sessions: moved ? [moved, ...updated.filter((s) => s.id !== id)] : updated });
      },

      // Patches the most recent message (used to stream tokens into the
      // assistant reply).
      patchLastMessage: (id, patch) =>
        set({
          sessions: get().sessions.map((s) => {
            if (s.id !== id || s.messages.length === 0) return s;
            const messages = s.messages.slice();
            messages[messages.length - 1] = { ...messages[messages.length - 1], ...patch };
            return { ...s, messages };
          }),
        }),

      removeLastMessage: (id) =>
        set({
          sessions: get().sessions.map((s) => (s.id === id ? { ...s, messages: s.messages.slice(0, -1) } : s)),
        }),
    }),
    {
      name: 'eko-chat-sessions-v1',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ sessions: state.sessions, activeId: state.activeId }),
      // A reload mid-stream can leave an empty assistant placeholder behind.
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.sessions = (state.sessions || []).map((s) => ({
          ...s,
          messages: (s.messages || []).filter((m) => !(m.role === 'assistant' && !String(m.content || '').trim() && !m.error && !m.emergency)),
        }));
      },
    }
  )
);

export const selectActiveSession = (state) => state.sessions.find((s) => s.id === state.activeId) || null;
