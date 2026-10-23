// Shared "load initial chat suggestions" logic — used by App.jsx (which
// blocks first paint on this, so it MUST resolve quickly and MUST NOT throw:
// a slow/unavailable AI provider should never make the whole site
// inaccessible) and by Chatbot.jsx (non-blocking, on later page navigations).
import { fetchSuggestions } from './openrouter';
import { getCachedSuggestions, setCachedSuggestions } from './suggestionsCache';

const FETCH_TIMEOUT_MS = 8000;

// Shown if generation fails or times out — keeps the app usable even during
// an AI provider outage, just without personalized suggestions.
const FALLBACK_SUGGESTIONS = [
  'Renew my vehicle licence',
  'Pay my taxes online',
  'Apply for a building permit',
  'Who are the commissioners?',
  'Apply for a student loan',
  'Things to do in Lagos',
  'Pay government bills online',
];

/**
 * Resolves to a list of starter-question chips for the given page — from cache
 * if fresh (< 60 min old), otherwise generated fresh. Never rejects: falls
 * back to a fixed list on any error or timeout.
 * @param {string} pageKey
 * @returns {Promise<string[]>}
 */
export const loadInitialSuggestions = async (pageKey) => {
  const cached = getCachedSuggestions(pageKey);
  if (cached) return cached;

  try {
    const list = await Promise.race([
      fetchSuggestions(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Initial suggestions timed out')), FETCH_TIMEOUT_MS)
      ),
    ]);

    const suggestions = list.map((q) => String(q).trim()).filter(Boolean).slice(0, 10);

    if (suggestions.length === 0) throw new Error('Empty suggestions response');

    setCachedSuggestions(pageKey, suggestions);
    return suggestions;
  } catch (err) {
    console.error('Error generating initial suggestions, using fallback:', err);
    return FALLBACK_SUGGESTIONS;
  }
};
