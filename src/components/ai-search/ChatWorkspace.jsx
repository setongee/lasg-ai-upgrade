import { ArrowUpRight, ChatBubble, Check, Copy, Download, Menu, Phone, Plus, RefreshDouble, Search, Trash, Xmark } from 'iconoir-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import pdf from '../../pages/MDAs/shared/assets/sectionsIcons/pdf.png';
import { useApp } from '../../stores/app.store';
import { useChatStore } from '../../stores/chat.store';
import { retryLast, sendMessage, stopStreaming } from './chatEngine';
import { EMERGENCY_LINES } from './emergency';
import { greeting } from './greeting';
import Composer from './Composer';
import { PALETTE_CLASS } from './palette';
import { useSessions } from './sessions.store';

const DAY = 24 * 60 * 60 * 1000;

const bucketOf = (ts) => {
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  if (ts >= startOfToday) return 'Today';
  if (ts >= startOfToday - DAY) return 'Yesterday';
  if (ts >= startOfToday - 7 * DAY) return 'Previous 7 days';
  return 'Older';
};
const BUCKET_ORDER = ['Today', 'Yesterday', 'Previous 7 days', 'Older'];

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="eko-msg-action"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          // clipboard blocked — nothing useful to do
        }
      }}
      aria-label="Copy answer"
    >
      {done ? <Check /> : <Copy />}
      <span>{done ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

const mdComponents = {
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer noopener" />,
  table: ({ node, ...props }) => (
    <div className="eko-table-wrap">
      <table {...props} />
    </div>
  ),
};

function Message({ msg, isLast, streaming, language, sessionId }) {
  if (msg.role === 'user') {
    return (
      <div className="eko-msg user">
        <div className="eko-bubble">{msg.content}</div>
      </div>
    );
  }

  const empty = !String(msg.content || '').trim();
  if (empty && !(isLast && streaming) && !msg.emergency) return null;

  return (
    <div className="eko-msg bot">
      <span className={`eko-avatar ${isLast && streaming ? 'busy' : ''}`} aria-hidden="true" />
      <div className="eko-bot-body">
        {msg.emergency && (
          <div className="eko-emergency" role="alert">
            <div className="eko-emergency-text">
              <strong>Emergency? Call now.</strong>
              <span>Lagos State emergency lines (LASEMA) — toll-free</span>
            </div>
            <div className="eko-emergency-actions">
              {EMERGENCY_LINES.map((l) => (
                <a key={l.number} href={`tel:${l.number}`} className="eko-call">
                  <Phone /> {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
        {empty ? (
          <div className="eko-thinking" role="status">
            <span className="eko-dots"><i /><i /><i /></span> Eko Smart is looking into it
          </div>
        ) : (
          <div className={`eko-md ${msg.error ? 'error' : ''} ${isLast && streaming ? 'streaming' : ''}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {msg.content}
            </ReactMarkdown>
          </div>
        )}

        {msg.downloadSources?.length > 0 && (
          <div className="eko-sources">
            <span className="eko-sources-label">Referenced documents</span>
            <div className="eko-source-list">
              {msg.downloadSources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer noopener" className="eko-source">
                  <img src={pdf} alt="" /> <span>{s.name}</span> <Download />
                </a>
              ))}
            </div>
          </div>
        )}

        {msg.webSources?.length > 0 && (
          <div className="eko-sources">
            <span className="eko-sources-label">From the web</span>
            <div className="eko-source-list">
              {msg.webSources.slice(0, 5).map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer noopener" className="eko-source">
                  <span>{s.title || hostOf(s.url)}</span> <small>{hostOf(s.url)}</small> <ArrowUpRight />
                </a>
              ))}
            </div>
          </div>
        )}

        {!empty && !(isLast && streaming) && (
          <div className="eko-msg-actions">
            {msg.error ? (
              <button type="button" className="eko-msg-action" onClick={() => retryLast({ sessionId, language })}>
                <RefreshDouble /> <span>Try again</span>
              </button>
            ) : (
              <CopyButton text={msg.content} />
            )}
            {msg.stopped && <span className="eko-stopped">Stopped</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function Workspace() {
  const sessions = useSessions((s) => s.sessions);
  const activeId = useSessions((s) => s.activeId);
  const streamingId = useSessions((s) => s.streamingId);
  const { setOpen, newSession, selectSession, deleteSession, clearAll, setScope } = useSessions.getState();

  const language = useChatStore((s) => s.languagePreference);
  const setLanguage = useChatStore((s) => s.setLanguagePreference);
  const suggestions = useApp((s) => s.initialSuggestions);
  const darkmode = useApp((s) => s.darkmode);

  const [drawer, setDrawer] = useState(false);
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const listRef = useRef(null);
  const stick = useRef(true);

  const active = sessions.find((s) => s.id === activeId) || null;
  const streaming = !!active && streamingId === active.id;
  const anyStreaming = !!streamingId;

  const close = useCallback(() => setOpen(false), [setOpen]);

  // There must always be an active session while the workspace is open.
  useEffect(() => {
    if (active) return;
    if (sessions[0]) selectSession(sessions[0].id);
    else newSession();
  }, [active, sessions, selectSession, newSession]);

  // Lock page scroll and close on Escape while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (drawer) setDrawer(false);
      else close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [close, drawer]);

  // Keep the newest content in view while streaming, unless the reader scrolled up.
  const messages = active?.messages;
  useLayoutEffect(() => {
    const el = listRef.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useLayoutEffect(() => {
    stick.current = true;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeId]);

  const onScroll = () => {
    const el = listRef.current;
    if (el) stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 140;
  };

  const handleSend = (text) => {
    if (!active) return;
    stick.current = true;
    sendMessage({ sessionId: active.id, text, language });
  };

  const handleNew = () => {
    newSession();
    setDrawer(false);
    setQuery('');
  };

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? sessions.filter((s) => s.title.toLowerCase().includes(q) || s.messages.some((m) => String(m.content || '').toLowerCase().includes(q)))
      : sessions;
    const groups = {};
    for (const s of list) (groups[bucketOf(s.updatedAt)] ||= []).push(s);
    return { list, groups };
  }, [sessions, query]);

  const empty = !active || active.messages.length === 0;

  return (
    <div className={`eko-overlay ${darkmode ? 'eko-dark' : ''} ${PALETTE_CLASS}`} role="dialog" aria-modal="true" aria-label="Eko Smart chat">
      <div className="eko-backdrop" onClick={close} />

      <div className="eko-shell">
        {/* ── Sidebar ───────────────────────────────────────────── */}
        <aside className={`eko-side ${drawer ? 'open' : ''}`}>
          <div className="eko-side-head">
            <div className="eko-brand">
              <span className="eko-avatar lg" aria-hidden="true" />
              <div>
                <strong>Eko Smart</strong>
                <small>Lagos State assistant</small>
              </div>
            </div>
            <button type="button" className="eko-icon-btn only-mobile" onClick={() => setDrawer(false)} aria-label="Close menu">
              <Xmark />
            </button>
          </div>

          <button type="button" className="eko-new" onClick={handleNew}>
            <Plus strokeWidth={2.2} /> New chat
          </button>

          <label className="eko-side-search">
            <Search />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chats" aria-label="Search chats" />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                <Xmark />
              </button>
            )}
          </label>

          <nav className="eko-sessions" aria-label="Chat history">
            {grouped.list.length === 0 && (
              <div className="eko-side-empty">{query ? `No chats match “${query}”.` : 'Your conversations will appear here.'}</div>
            )}
            {BUCKET_ORDER.filter((b) => grouped.groups[b]).map((b) => (
              <div key={b} className="eko-group">
                <div className="eko-group-title">{b}</div>
                {grouped.groups[b].map((s) => (
                  <div key={s.id} className={`eko-session ${s.id === activeId ? 'on' : ''}`}>
                    <button
                      type="button"
                      className="eko-session-main"
                      onClick={() => {
                        selectSession(s.id);
                        setDrawer(false);
                      }}
                    >
                      <ChatBubble />
                      <span className="eko-session-title">{s.title}</span>
                    </button>
                    {confirmId === s.id ? (
                      <span className="eko-confirm">
                        <button type="button" className="danger" onClick={() => { deleteSession(s.id); setConfirmId(null); }}>Delete</button>
                        <button type="button" onClick={() => setConfirmId(null)}>Cancel</button>
                      </span>
                    ) : (
                      <button type="button" className="eko-session-del" onClick={() => setConfirmId(s.id)} aria-label={`Delete chat ${s.title}`}>
                        <Trash />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </nav>

          <div className="eko-side-foot">
            <p>Chats are saved on this device only.</p>
            {sessions.length > 0 &&
              (confirmClear ? (
                <span className="eko-confirm">
                  <button type="button" className="danger" onClick={() => { clearAll(); setConfirmClear(false); }}>Clear all</button>
                  <button type="button" onClick={() => setConfirmClear(false)}>Cancel</button>
                </span>
              ) : (
                <button type="button" className="eko-text-btn" onClick={() => setConfirmClear(true)}>
                  Clear all chats
                </button>
              ))}
          </div>
        </aside>
        {drawer && <div className="eko-drawer-scrim" onClick={() => setDrawer(false)} />}

        {/* ── Chat body ─────────────────────────────────────────── */}
        <section className="eko-main">
          <header className="eko-main-head">
            <button type="button" className="eko-icon-btn only-mobile" onClick={() => setDrawer(true)} aria-label="Open chat history">
              <Menu />
            </button>
            <div className="eko-main-title">{empty ? 'New chat' : active.title}</div>
            <button type="button" className="eko-icon-btn only-mobile" onClick={handleNew} aria-label="New chat">
              <Plus />
            </button>
            <button type="button" className="eko-icon-btn" onClick={close} aria-label="Close chat">
              <Xmark />
            </button>
          </header>

          <div className="eko-scroll" ref={listRef} onScroll={onScroll}>
            {empty ? (
              <div className="eko-welcome">
                <span className="eko-orb big" aria-hidden="true" />
                <h2>{greeting()}. How can I help?</h2>
                <p>Ask about services, agencies or leaders — or narrow the search to the ministries and agencies you care about.</p>
                {suggestions?.length > 0 && (
                  <div className="eko-suggest">
                    {suggestions.slice(0, 8).map((q) => (
                      <button key={q} type="button" onClick={() => handleSend(q)} disabled={anyStreaming}>
                        <span>{q}</span>
                        <ArrowUpRight />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="eko-thread">
                {active.messages.map((m, i) => (
                  <Message key={m.id || i} msg={m} isLast={i === active.messages.length - 1} streaming={streaming} language={language} sessionId={active.id} />
                ))}
              </div>
            )}
          </div>

          <footer className="eko-dock">
            {active && (
              <Composer
                key={active.id}
                variant="workspace"
                menuPlacement="up"
                scope={active.scope}
                onScopeChange={(scope) => setScope(active.id, scope)}
                language={language}
                onLanguageChange={setLanguage}
                onSubmit={handleSend}
                streaming={streaming}
                onStop={stopStreaming}
                placeholder="Ask a follow-up or a new question…"
                autoFocus
                focusKey={active.id}
              />
            )}
            <p className="eko-disclaimer">Eko Smart can make mistakes — please confirm important details with the agency.</p>
          </footer>
        </section>
      </div>
    </div>
  );
}

export default function ChatWorkspace() {
  const open = useSessions((s) => s.open);
  if (!open) return null;
  return createPortal(<Workspace />, document.body);
}
