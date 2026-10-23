import { ArrowUp, Check, Community, Language, Microphone, NavArrowDown, Plus, Square, ViewGrid, Xmark } from 'iconoir-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './ai-search.css';
import ContextPicker from './ContextPicker';
import { LANGUAGES } from './languages';
import { loadLiveData } from './liveData';
import { useSessions } from './sessions.store';
import { useVoiceInput } from './useVoiceInput';

const MAX_HEIGHT = { hero: 220, workspace: 180 };

/**
 * The chat input card used on the home hero and inside the chat workspace:
 * "narrow to" pills + chips on top, auto-growing textarea, and a toolbar with
 * add-context, language, voice dictation and send/stop.
 */
export default function Composer({
  variant = 'hero', // 'hero' | 'workspace'
  scope,
  onScopeChange,
  language,
  onLanguageChange,
  onSubmit,
  streaming = false,
  onStop,
  placeholder = 'Ask Eko Smart about Lagos State services…',
  autoFocus = false,
  menuPlacement = 'down',
  focusKey,
}) {
  const [text, setText] = useState('');
  const [picker, setPicker] = useState({ open: false, tab: 'mdas' });
  const [langOpen, setLangOpen] = useState(false);
  const [langDir, setLangDir] = useState(menuPlacement);
  const [notice, setNotice] = useState('');
  const [live, setLive] = useState(null);

  const areaRef = useRef(null);
  const topbarRef = useRef(null);
  const noticeTimer = useRef(null);
  const langRef = useRef(null);
  const voiceBase = useRef('');

  const mdas = scope?.mdas || [];
  const categories = scope?.categories || [];
  const hasScope = mdas.length + categories.length > 0;

  const flash = useCallback((msg) => {
    setNotice(msg);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(''), 4500);
  }, []);

  const voice = useVoiceInput({
    lang: LANGUAGES[language]?.speech || 'en-NG',
    onTranscript: (t) => setText(`${voiceBase.current}${voiceBase.current && t ? ' ' : ''}${t}`),
    onNotice: flash,
  });

  // Prefetch MDA/category data as soon as the user shows intent.
  const warm = useCallback(() => {
    if (!live) loadLiveData().then(setLive).catch(() => setLive({ mdas: [], categories: [], executives: [] }));
  }, [live]);

  const openPicker = (tab) => {
    warm();
    setPicker({ open: true, tab });
  };

  // Auto-grow the textarea up to a cap, then scroll.
  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT[variant])}px`;
  }, [text, variant]);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  useEffect(() => {
    if (autoFocus) areaRef.current?.focus({ preventScroll: true });
  }, [autoFocus, focusKey]);

  useEffect(() => {
    if (!langOpen) return;
    const onDown = (e) => {
      if (!langRef.current?.contains(e.target)) setLangOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [langOpen]);

  // Opens the language menu on whichever side has room, so it never runs off
  // the bottom of a short screen (or off the top) — falls back to the
  // requested side when both fit.
  const toggleLang = () => {
    if (!langOpen) {
      const r = langRef.current?.getBoundingClientRect();
      const need = Object.keys(LANGUAGES).length * 40 + 28;
      const below = r ? window.innerHeight - r.bottom : Infinity;
      const above = r ? r.top : Infinity;
      let dir = menuPlacement;
      if (dir === 'down' && below < need && above > below) dir = 'up';
      else if (dir === 'up' && above < need && below > above) dir = 'down';
      setLangDir(dir);
    }
    setLangOpen((v) => !v);
  };

  // Opens the chat window on the visitor's most recent saved conversation.
  const openMyChats = () => {
    const store = useSessions.getState();
    const recent = store.sessions.find((x) => x.messages.length > 0);
    if (recent) store.selectSession(recent.id);
    store.setOpen(true);
  };

  const submit = () => {
    const value = text.trim();
    if (!value || streaming) return;
    voice.stop();
    onSubmit(value);
    setText('');
  };

  const toggleVoice = () => {
    if (voice.listening) return voice.stop();
    voiceBase.current = text.trim();
    setNotice('');
    voice.start();
  };

  const removeMda = (id) => onScopeChange({ ...scope, mdas: mdas.filter((m) => m.id !== id) });
  const removeCategory = (key) => onScopeChange({ ...scope, categories: categories.filter((c) => c.formattedName !== key) });

  const canSend = text.trim().length > 0 && !streaming;
  const hint = voice.listening ? 'Listening… speak now' : hasScope ? 'Ask about your selection…' : placeholder;

  const topbarItems = (
    <>
      <button type="button" className={`eko-pill ${mdas.length ? 'active' : ''}`} onClick={() => openPicker('mdas')}>
        <Community /> <span>Narrow to MDA</span>
        {mdas.length > 0 && <b>{mdas.length}</b>}
      </button>
      <button type="button" className={`eko-pill ${categories.length ? 'active' : ''}`} onClick={() => openPicker('categories')}>
        <ViewGrid /> <span>Category</span>
        {categories.length > 0 && <b>{categories.length}</b>}
      </button>
      {mdas.map((m) => (
        <span className="eko-chip" key={m.id} title={m.name}>
          <Community />
          <span>{m.name}</span>
          <button type="button" onClick={() => removeMda(m.id)} aria-label={`Remove ${m.name}`}>
            <Xmark />
          </button>
        </span>
      ))}
      {categories.map((c) => (
        <span className="eko-chip cat" key={c.formattedName} title={c.name}>
          <ViewGrid />
          <span>{c.name}</span>
          <button type="button" onClick={() => removeCategory(c.formattedName)} aria-label={`Remove ${c.name}`}>
            <Xmark />
          </button>
        </span>
      ))}
    </>
  );

  return (
    <div className={`eko-composer eko-${variant}`}>
      <div className="eko-topbar" ref={topbarRef}>
        {variant === 'hero' ? (
          <>
            <div className="eko-topbar-main">{topbarItems}</div>
            <button type="button" className="eko-mychats" onClick={openMyChats}>
              View my chats
            </button>
          </>
        ) : (
          topbarItems
        )}
      </div>

      <div className={`eko-card ${voice.listening ? 'listening' : ''}`}>
        <div className="eko-inputrow">
          <div className="eko-field">
            <textarea
              ref={areaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={warm}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  submit();
                }
              }}
              aria-label="Message Eko Smart"
              enterKeyHint="send"
            />
            {!text && (
              <span className="eko-ph" aria-hidden="true">
                {hint}
              </span>
            )}
          </div>
        </div>

        <div className="eko-toolbar">
          <button type="button" className="eko-tool" onClick={() => openPicker('mdas')} aria-label="Add context: pick MDAs or categories" title="Add context">
            <Plus />
          </button>

          <div className="eko-lang" ref={langRef}>
            <button type="button" className="eko-tool eko-lang-btn" onClick={toggleLang} aria-haspopup="listbox" aria-expanded={langOpen} title="Response language">
              <Language />
              <span>{LANGUAGES[language]?.name || 'English'}</span>
              <NavArrowDown className={langOpen ? 'flip' : ''} />
            </button>
            {langOpen && (
              <ul className={`eko-menu ${langDir}`} role="listbox" aria-label="Response language">
                {Object.entries(LANGUAGES).map(([code, l]) => (
                  <li key={code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={code === language}
                      className={code === language ? 'on' : ''}
                      onClick={() => {
                        onLanguageChange(code);
                        setLangOpen(false);
                      }}
                    >
                      <span>{l.name}</span>
                      {code === language && <Check />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <span className="eko-spacer" />

          {voice.supported && (
            <button
              type="button"
              className={`eko-tool eko-mic ${voice.listening ? 'on' : ''}`}
              onClick={() => toggleVoice()}
              aria-pressed={voice.listening}
              aria-label={voice.listening ? 'Stop voice input' : 'Speak your question'}
              title={voice.listening ? 'Stop' : 'Speak your question'}
            >
              {voice.listening ? (
                <span className="eko-bars" aria-hidden="true">
                  <i /><i /><i /><i />
                </span>
              ) : (
                <Microphone />
              )}
            </button>
          )}

          {streaming ? (
            <button type="button" className="eko-send stop" onClick={() => onStop?.()} aria-label="Stop generating" title="Stop">
              <Square />
            </button>
          ) : (
            <button type="button" className="eko-send" disabled={!canSend} onClick={submit} aria-label="Send">
              <ArrowUp strokeWidth={2.4} />
            </button>
          )}
        </div>
      </div>

      {notice && (
        <div className="eko-notice" role="status">
          {notice}
        </div>
      )}

      <ContextPicker
        open={picker.open}
        tab={picker.tab}
        onTabChange={(tab) => setPicker((p) => ({ ...p, tab }))}
        onClose={() => setPicker((p) => ({ ...p, open: false }))}
        live={live}
        scope={scope || { mdas: [], categories: [] }}
        onChange={onScopeChange}
        onRetry={() => {
          setLive(null);
          loadLiveData().then(setLive).catch(() => setLive({ mdas: [], categories: [], executives: [] }));
        }}
        anchorRef={topbarRef}
        placement={menuPlacement}
      />
    </div>
  );
}
