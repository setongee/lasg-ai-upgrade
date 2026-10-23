import { HalfMoon } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { useApp } from '../../stores/app.store';
import './night-prompt.css';

// Remembers the visitor's answer for this browser session only.
const CHOICE_KEY = 'lasg-night-choice';

const lagosParts = () => {
  const now = new Date();
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Africa/Lagos' }).format(now)
  );
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Lagos',
  }).format(now);
  return { hour, time };
};

const readChoice = () => {
  try {
    return window.sessionStorage.getItem(CHOICE_KEY);
  } catch {
    return null;
  }
};

const saveChoice = (value) => {
  try {
    window.sessionStorage.setItem(CHOICE_KEY, value);
  } catch {
    // ignore storage errors (private browsing, etc.)
  }
};

// Once it is evening in Lagos, offers the night-time hero to anyone still on the day theme,
// until they answer it (Esc and clicking outside don't count) in this session.
export default function NightPrompt() {
  const darkmode = useApp((s) => s.darkmode);
  const setDarkmode = useApp((s) => s.setDarkmode);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const { hour, time: now } = lagosParts();
    const isNight = hour >= 19 || hour < 5;
    if (!isNight || darkmode || readChoice() !== null) return;

    setTime(now);
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
    // Decided once on mount; toggling the theme later shouldn't re-open it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const dismiss = () => {
    saveChoice('day');
    setOpen(false);
  };

  const accept = () => {
    saveChoice('night');
    setDarkmode(true);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="nightPrompt">
      <div
        className="nightPrompt__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nightPromptTitle"
      >
        <div className="nightPrompt__icon">
          <HalfMoon width={26} strokeWidth={1.8} />
        </div>
        <p className="nightPrompt__time">{time} in Lagos</p>
        <h2 id="nightPromptTitle">It&apos;s already night in Lagos</h2>
        <p className="nightPrompt__text">
          Switch to Lagos night life mode: a darker look with the city lit up after dark.
        </p>
        <div className="nightPrompt__actions">
          <button type="button" className="primary" onClick={accept} autoFocus>
            Switch to night mode
          </button>
          <button type="button" className="ghost" onClick={dismiss}>
            Keep daylight
          </button>
        </div>
      </div>
    </div>
  );
}
