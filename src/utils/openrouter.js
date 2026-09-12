// Client for the backend's AI proxy (backendv2 `/api/v2/ai/*`), which is the
// only place the OpenRouter API key lives. All AI features — chat, embeddings,
// image generation — are powered by OpenRouter behind that proxy; nothing here
// talks to any AI provider directly from the browser.
import { env } from '../api/read/environment';

const AI_BASE_URL = `${env}/ai`;

/**
 * Non-streaming chat completion.
 *
 * Pass `reasoningEffort: 'minimal'` for simple generation tasks (suggestions,
 * follow-ups, keyword lists) — GPT-5-family models reason before answering by
 * default, which for a trivial task means paying for and waiting on hidden
 * "thinking" tokens that add nothing. The default 'low' still reasons enough
 * to follow instructions reliably; only drop to 'minimal' for genuinely
 * simple, short-form output.
 * @param {Array<{role: string, content: string}>} messages
 * @param {{models?: string[], maxTokens?: number, temperature?: number, webSearch?: boolean, responseFormat?: {type: 'json_object'}, reasoningEffort?: 'minimal'|'low'|'medium'|'high'}} [options]
 * @returns {Promise<string>}
 */
export const openRouterComplete = async (messages, options = {}) => {
  const {
    models,
    maxTokens = 1536,
    temperature = 0.7,
    webSearch = false,
    responseFormat,
    reasoningEffort,
  } = options;

  const res = await fetch(`${AI_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      models,
      max_tokens: maxTokens,
      temperature,
      webSearch,
      responseFormat,
      reasoningEffort,
    }),
  });

  if (!res.ok) {
    throw new Error(`AI chat error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return data.content || '';
};

/**
 * Tool-calling agent chat (non-streaming): the model decides for itself
 * whether to search services, search the knowledge base, or use web search,
 * and the backend executes those tools in a loop until it has a final
 * answer. Returns the complete answer in one shot.
 *
 * Kept as a manual-testing/fallback path — the UI uses `agentChatStream`
 * below for real token streaming.
 * @param {Array<{role: string, content: string}>} messages
 * @param {{webSearch?: boolean, maxTokens?: number, temperature?: number}} [options]
 * @returns {Promise<{content: string, services: Array, downloadSources: Array<{name: string, url: string}>, webSources: Array<{title: string, url: string}>}>}
 */
export const agentChat = async (messages, options = {}) => {
  const { webSearch = true, maxTokens = 1024, temperature = 0.7, reasoningEffort } = options;

  const res = await fetch(`${AI_BASE_URL}/agent-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, webSearch, maxTokens, temperature, reasoningEffort }),
  });

  if (!res.ok) {
    throw new Error(`AI agent chat error ${res.status}: ${await res.text()}`);
  }

  return res.json();
};

/**
 * Tool-calling agent chat, streamed. Tool-resolution rounds (the model
 * searching services/knowledge-base/web) carry no visible content — only the
 * final round streams real text, so `onToken` only starts firing once the
 * model is actually answering, not while it's "thinking".
 * @param {Array<{role: string, content: string}>} messages
 * @param {{webSearch?: boolean, maxTokens?: number, temperature?: number, onToken?: (delta: string, fullTextSoFar: string) => (void|Promise<void>)}} [options]
 * @returns {Promise<{content: string, services: Array, downloadSources: Array<{name: string, url: string}>, webSources: Array<{title: string, url: string}>, truncated: boolean}>}
 */
export const agentChatStream = async (messages, options = {}) => {
  const { webSearch = true, maxTokens = 4096, temperature = 0.7, reasoningEffort, onToken } = options;

  const res = await fetch(`${AI_BASE_URL}/agent-chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, webSearch, maxTokens, temperature, reasoningEffort }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`AI agent chat error ${res.status}: ${await res.text()}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';
  let final = { services: [], downloadSources: [], sources: [], webSources: [], truncated: false };

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
      if (!payload) continue;

      const parsed = JSON.parse(payload);

      if (parsed.type === 'token') {
        fullText += parsed.content;
        if (onToken) await onToken(parsed.content, fullText);
      } else if (parsed.type === 'done') {
        final = {
          services: parsed.services || [],
          downloadSources: parsed.downloadSources || [],
          sources: parsed.sources || [],
          webSources: parsed.webSources || [],
          truncated: parsed.truncated || false,
        };
      } else if (parsed.type === 'error') {
        throw new Error(parsed.message);
      }
    }
  }

  return { content: fullText, ...final };
};

/**
 * Generate an image from a prompt.
 * @param {string} prompt
 * @param {{model?: string, aspectRatio?: string}} [options]
 * @returns {Promise<{base64: string, mimeType: string}>}
 */
export const generateAiImage = async (prompt, options = {}) => {
  const { model, aspectRatio } = options;

  const res = await fetch(`${AI_BASE_URL}/image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model, aspectRatio }),
  });

  if (!res.ok) {
    throw new Error(`AI image error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return { base64: data.base64, mimeType: data.mimeType };
};
