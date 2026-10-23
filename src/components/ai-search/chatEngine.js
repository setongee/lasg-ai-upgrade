// Sends a message in a session: appends the user turn, streams the assistant
// reply into the store, and handles stop / errors / retry. One reply streams
// at a time (the composer is disabled while one is in flight).
import { agentChatStream } from '../../utils/openrouter';
import { isEmergency } from './emergency';
import { loadLiveData } from './liveData';
import { buildSystemPrompt } from './prompt';
import { useSessions } from './sessions.store';

let controller = null;

// Real conversation turns for the model: the last 8 non-empty messages, with
// long past answers clipped so history stays cheap.
const historyFor = (session) =>
  session.messages
    .filter((m) => m.content && !m.error)
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));

const toRequestScope = (scope) => ({
  mdas: (scope?.mdas || []).map((m) => m.id),
  categories: (scope?.categories || []).map((c) => c.formattedName),
});

export const stopStreaming = () => controller?.abort();

/**
 * @param {{sessionId: string, text: string, language: string}} args
 */
export const sendMessage = async ({ sessionId, text, language }) => {
  const store = useSessions.getState();
  if (store.streamingId) return;

  const session = store.sessions.find((s) => s.id === sessionId);
  const question = String(text || '').trim();
  if (!session || !question) return;

  // History is everything before this turn.
  const history = historyFor(session);

  store.appendMessages(sessionId, [{ role: 'user', content: question }]);
  // Emergencies get the call card on the reply immediately, before the model answers.
  const emergency = isEmergency(question);
  store.appendMessages(sessionId, [{ role: 'assistant', content: '', ...(emergency ? { emergency: true } : {}) }]);
  store.setStreaming(sessionId);

  controller = new AbortController();
  const patch = (p) => useSessions.getState().patchLastMessage(sessionId, p);

  try {
    const live = await loadLiveData();
    const hasScope = session.scope?.mdas?.length || session.scope?.categories?.length;

    const result = await agentChatStream(
      [
        { role: 'system', content: buildSystemPrompt({ live, language, emergency }) },
        ...history,
        { role: 'user', content: question },
      ],
      {
        webSearch: true,
        maxTokens: 1800,
        temperature: 0.7,
        scope: hasScope ? toRequestScope(session.scope) : undefined,
        signal: controller.signal,
        onToken: (_delta, full) => patch({ content: full }),
      }
    );

    patch({
      content:
        (result.content || '') +
        (result.truncated ? '\n\n*(That answer got cut short — ask me to continue if you need the rest.)*' : ''),
      downloadSources: result.downloadSources || [],
      webSources: result.webSources || [],
    });
  } catch (err) {
    if (err?.name === 'AbortError') {
      // Keep whatever streamed so far; drop the placeholder if nothing did.
      const s = useSessions.getState().sessions.find((x) => x.id === sessionId);
      const last = s?.messages[s.messages.length - 1];
      if (last && !String(last.content || '').trim()) useSessions.getState().removeLastMessage(sessionId);
      else patch({ stopped: true });
    } else {
      console.error('[ai-search] chat error:', err);
      const limited = /\b429\b/.test(String(err?.message));
      patch({
        error: true,
        content: limited
          ? "Eko Smart is getting a lot of questions right now. Please try again in a little while."
          : 'Something went wrong. Please try again.',
      });
    }
  } finally {
    controller = null;
    useSessions.getState().setStreaming(null);
  }
};

// Re-asks the last user question after an error (replaces the failed reply).
export const retryLast = ({ sessionId, language }) => {
  const store = useSessions.getState();
  const session = store.sessions.find((s) => s.id === sessionId);
  if (!session || store.streamingId) return;
  const msgs = session.messages;
  const last = msgs[msgs.length - 1];
  if (!last || last.role !== 'assistant') return;
  const lastUser = [...msgs].reverse().find((m) => m.role === 'user');
  if (!lastUser) return;
  store.removeLastMessage(sessionId);
  // `history` must exclude the question being retried — drop it too, then re-add.
  store.removeLastMessage(sessionId);
  return sendMessage({ sessionId, text: lastUser.content, language });
};

// Entry point used by the hero composer, floating bar, and suggestion chips:
// starts a fresh session (optionally pre-scoped), opens the workspace and sends.
export const startChat = ({ text, scope, language }) => {
  const store = useSessions.getState();
  const sessionId = store.newSession(scope);
  store.setOpen(true);
  if (text) return sendMessage({ sessionId, text, language });
  return Promise.resolve();
};
