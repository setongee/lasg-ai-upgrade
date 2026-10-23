import { ArrowUp, Microphone } from 'iconoir-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useChatStore } from '../../stores/chat.store';
import { startChat } from './chatEngine';
import { LANGUAGES } from './languages';
import { loadLiveData } from './liveData';
import { useSessions } from './sessions.store';
import { useVoiceInput } from './useVoiceInput';

const MAX_HEIGHT = 132;
// With no hero on the page, show the bar once the visitor has scrolled this far.
const FALLBACK_SCROLL = 420;

/**
 * Compact "ask anything" bar fixed at the bottom-centre of the main site. It
 * only appears once the visitor has scrolled past the hero (where the big
 * composer lives), grows in height with its content, and opens the chat
 * workspace on send.
 */
export default function FloatingAsk() {
  const { pathname } = useLocation();
  const language = useChatStore((s) => s.languagePreference);
  const workspaceOpen = useSessions((s) => s.open);

  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [notice, setNotice] = useState('');
  const areaRef = useRef(null);
  const base = useRef('');
  const noticeTimer = useRef(null);

  // Scrolled past the hero? Re-evaluated on scroll/resize and on route change.
  useEffect(() => {
    let raf = 0;
    const evaluate = () => {
      raf = 0;
      const hero = document.querySelector('.slider.home');
      setVisible(hero ? hero.getBoundingClientRect().bottom < 72 : window.scrollY > FALLBACK_SCROLL);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(evaluate);
    };
    const first = setTimeout(evaluate, 120); // let the new route render first
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      clearTimeout(first);
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [text, visible]);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  const flash = useCallback((msg) => {
    setNotice(msg);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(''), 4500);
  }, []);

  const voice = useVoiceInput({
    lang: LANGUAGES[language]?.speech || 'en-NG',
    onTranscript: (t) => setText(`${base.current}${base.current && t ? ' ' : ''}${t}`),
    onNotice: flash,
  });

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    voice.stop();
    setText('');
    startChat({ text: value, language });
  };

  const toggleVoice = () => {
    if (voice.listening) return voice.stop();
    base.current = text.trim();
    setNotice('');
    voice.start();
  };

  const shown = visible && !workspaceOpen;

  return (
    <div className={`eko-floating ${shown ? 'show' : ''}`} aria-hidden={!shown}>
      <div className={`eko-float-bar ${voice.listening ? 'listening' : ''}`}>
        <textarea
          ref={areaRef}
          rows={1}
          value={text}
          tabIndex={shown ? 0 : -1}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => loadLiveData()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={voice.listening ? 'Listening… speak now' : 'Ask Eko Smart anything…'}
          aria-label="Ask Eko Smart"
          enterKeyHint="send"
        />
        {voice.supported && (
          <button type="button" tabIndex={shown ? 0 : -1} className={`eko-float-btn ${voice.listening ? 'on' : ''}`} onClick={() => toggleVoice()} aria-pressed={voice.listening} aria-label={voice.listening ? 'Stop voice input' : 'Speak your question'}>
            {voice.listening ? (
              <span className="eko-bars" aria-hidden="true">
                <i /><i /><i /><i />
              </span>
            ) : (
              <Microphone />
            )}
          </button>
        )}
        <button type="button" tabIndex={shown ? 0 : -1} className="eko-send small" disabled={!text.trim()} onClick={submit} aria-label="Send">
          <ArrowUp strokeWidth={2.4} />
        </button>
      </div>
      {notice && <div className="eko-notice float">{notice}</div>}
    </div>
  );
}
