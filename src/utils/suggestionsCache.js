// localStorage-backed cache for AI-generated initial suggestions, keyed per
// page. Persists across hard page reloads (unlike an in-memory Map, which
// resets on every reload) — that's the point: a visitor only pays the
// generation latency once per page per 60 minutes, not on every visit.
const CACHE_PREFIX = 'lasg_suggestions_';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 60 minutes

export const getCachedSuggestions = (pageKey) => {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${pageKey}`);
    if (!raw) return null;

    const { data, timestamp } = JSON.parse(raw);
    if (!Array.isArray(data) || Date.now() - timestamp > CACHE_DURATION_MS) return null;

    return data;
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — treat as a cache miss
    return null;
  }
};

export const setCachedSuggestions = (pageKey, data) => {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${pageKey}`, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // ignore — caching is a nice-to-have, not essential
  }
};
