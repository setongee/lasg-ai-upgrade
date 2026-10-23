// Voice → text via the browser's built-in speech recognition (Chrome, Edge,
// Safari). No audio leaves our code — the browser handles recognition. Where
// it isn't supported (e.g. Firefox) `supported` is false and the UI hides the
// mic. Yorùbá/Igbo/Hausa recognition isn't available everywhere, so if the
// browser rejects the language we transparently retry in Nigerian English.
import { useCallback, useEffect, useRef, useState } from 'react';

const getRecognition = () =>
  typeof window === 'undefined' ? null : window.SpeechRecognition || window.webkitSpeechRecognition || null;

const ERRORS = {
  'not-allowed': 'Microphone access is blocked. Allow it in your browser settings to use voice.',
  'service-not-allowed': 'Microphone access is blocked. Allow it in your browser settings to use voice.',
  'audio-capture': "We couldn't find a microphone on this device.",
  'no-speech': "We didn't catch that — try again.",
  network: 'Voice input needs an internet connection.',
};

/**
 * @param {{lang: string, onTranscript: (text: string) => void, onNotice?: (msg: string) => void}} opts
 * `onTranscript` receives the full transcript of the current dictation
 * (final + interim) every time it changes.
 */
export const useVoiceInput = ({ lang, onTranscript, onNotice }) => {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const handlers = useRef({ onTranscript, onNotice });
  handlers.current = { onTranscript, onNotice };

  const supported = !!getRecognition();

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      // already stopped
    }
  }, []);

  const start = useCallback(
    (language = lang, isRetry = false) => {
      const SR = getRecognition();
      if (!SR) return;
      stop();

      const rec = new SR();
      rec.lang = language;
      rec.interimResults = true;
      rec.continuous = false;
      rec.maxAlternatives = 1;

      let retried = false;

      rec.onstart = () => setListening(true);
      rec.onresult = (event) => {
        let text = '';
        for (let i = 0; i < event.results.length; i++) text += event.results[i][0].transcript;
        handlers.current.onTranscript(text.trim());
      };
      rec.onerror = (event) => {
        if (event.error === 'language-not-supported' && !isRetry && language !== 'en-NG') {
          retried = true;
          handlers.current.onNotice?.('That language isn\'t supported for voice here — listening in English instead.');
          start('en-NG', true);
          return;
        }
        if (event.error !== 'aborted') handlers.current.onNotice?.(ERRORS[event.error] || 'Voice input stopped unexpectedly.');
      };
      rec.onend = () => {
        if (retried) return;
        setListening(false);
        if (recRef.current === rec) recRef.current = null;
      };

      recRef.current = rec;
      try {
        rec.start();
      } catch {
        setListening(false);
      }
    },
    [lang, stop]
  );

  const toggle = useCallback(() => (listening ? stop() : start()), [listening, start, stop]);

  // Never leave the mic open after unmount.
  useEffect(() => () => recRef.current?.abort?.(), []);

  return { supported, listening, start, stop, toggle };
};
