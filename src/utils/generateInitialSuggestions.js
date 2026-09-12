// Shared "load initial chat suggestions" logic — used by App.jsx (which
// blocks first paint on this, so it MUST resolve quickly and MUST NOT throw:
// a slow/unavailable AI provider should never make the whole site
// inaccessible) and by Chatbot.jsx (non-blocking, on later page navigations).
import { openRouterComplete } from './openrouter';
import { getCachedSuggestions, setCachedSuggestions } from './suggestionsCache';

const FETCH_TIMEOUT_MS = 8000;

// Shown if generation fails or times out — keeps the app usable even during
// an AI provider outage, just without personalized suggestions.
const FALLBACK_SUGGESTIONS = [
  'pay utility bills',
  'health services near me',
  'file my taxes',
  'register a business',
  'emergency safety numbers',
  'education in Lagos',
  'ministry contact info',
];

const buildPrompt = () =>
  `Generate 7 engaging, conversational questions about Lagos State services. Minimum 3 words, maximum 4 words each. Must make sense and be natural. Use this style: "pay utility bills", "health services near me", "file my taxes", "emergency safety numbers", "education in Lagos", "government benefits info", "fun recreational spots", "parks and gardens", "ministry building location", "ministry contact info". Focus on everyday needs like transportation, utilities, healthcare, education, business, emergency, recreation, and government services. Make them natural requests people would actually ask. Output only the 7 questions separated by ||, with no labels, numbering, or extra text — for example: pay utility bills||health services near me||file my taxes`;

/**
 * Resolves to a list of 7 suggestion strings for the given page — from cache
 * if fresh (< 60 min old), otherwise generated fresh. Never rejects: falls
 * back to a fixed list on any error or timeout.
 * @param {string} pageKey
 * @returns {Promise<string[]>}
 */
export const loadInitialSuggestions = async (pageKey) => {
  const cached = getCachedSuggestions(pageKey);
  if (cached) return cached;

  try {
    const text = await Promise.race([
      openRouterComplete([{ role: 'user', content: buildPrompt() }], { reasoningEffort: 'minimal' }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Initial suggestions timed out')), FETCH_TIMEOUT_MS)
      ),
    ]);

    const suggestions = text
      .split('||')
      .map((q) => q.trim())
      .filter(Boolean)
      .slice(0, 7);

    if (suggestions.length === 0) throw new Error('Empty suggestions response');

    setCachedSuggestions(pageKey, suggestions);
    return suggestions;
  } catch (err) {
    console.error('Error generating initial suggestions, using fallback:', err);
    return FALLBACK_SUGGESTIONS;
  }
};
