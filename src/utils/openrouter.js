// Shared client for OpenRouter's OpenAI-compatible chat completions API.
// Used in place of direct Gemini chat-completion calls across the chatbot
// and admin content-generation tools (embeddings/image generation stay on Gemini,
// since OpenRouter doesn't serve those).

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Ordered fallback chain — OpenRouter tries each in turn if one errors/rate-limits.
// Verified directly against the API to give real answers within a normal token budget
// (excludes reasoning models like nvidia/nemotron-3.5-lightning:free and openai/gpt-oss-20b:free,
// which were observed spending the entire completion budget on chain-of-thought and returning
// empty or raw-reasoning-as-answer output instead of a real response).
const OPENROUTER_MODELS = [
  'liquid/lfm-2.5-2.6b:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'google/gemma-4-26b-a4b-it:free',
];

const openRouterHeaders = () => ({
  Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': window.location.origin,
  'X-Title': 'LASG Eko Smart',
});

/**
 * Non-streaming chat completion.
 * @param {Array<{role: string, content: string}>} messages
 * @param {{models?: string[], maxTokens?: number, temperature?: number}} [options]
 * @returns {Promise<string>}
 */
export const openRouterComplete = async (messages, options = {}) => {
  const { models = OPENROUTER_MODELS, maxTokens = 1536, temperature = 0.7 } = options;

  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: openRouterHeaders(),
    body: JSON.stringify({ models, messages, max_tokens: maxTokens, temperature }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
};

/**
 * Streaming chat completion. Calls onToken(deltaText) as chunks arrive.
 * @param {Array<{role: string, content: string}>} messages
 * @param {{models?: string[], maxTokens?: number, temperature?: number, onToken?: (delta: string) => (void|Promise<void>)}} [options]
 * @returns {Promise<string>} full accumulated text
 */
export const openRouterStream = async (messages, options = {}) => {
  const { models = OPENROUTER_MODELS, maxTokens = 1536, temperature = 0.7, onToken } = options;

  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: openRouterHeaders(),
    body: JSON.stringify({ models, messages, max_tokens: maxTokens, temperature, stream: true }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`OpenRouter error ${res.status}: ${await res.text()}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;

      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') continue;

      try {
        const parsed = JSON.parse(payload);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) {
          fullText += delta;
          if (onToken) await onToken(delta);
        }
      } catch {
        // ignore malformed SSE fragments (e.g. split across chunk boundaries)
      }
    }
  }

  return fullText;
};
