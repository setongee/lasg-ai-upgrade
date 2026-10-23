import { SunLight } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { useApp } from '../../stores/app.store';
import './night-prompt.css';

// Remembers the visitor's answer for this browser session only.
const CHOICE_KEY = 'lasg-day-choice';

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

// The mirror of NightPrompt: once it is daytime in Lagos, offers the light theme to anyone
// still on dark mode, until they answer it in this session.
export default function DayPrompt() {
  const darkmode = useApp((s) => s.darkmode);
  const setDarkmode = useApp((s) => s.setDarkmode);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const { hour, time: now } = lagosParts();
    const isDay = hour >= 5 && hour < 19;
    if (!isDay || !darkmode || readChoice() !== null) return;

    setTime(now);
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
    // Decided once on mount; toggling the theme later shouldn't re-open it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const dismiss = () => {
    saveChoice('dark');
    setOpen(false);
  };

  const accept = () => {
    saveChoice('light');
    setDarkmode(false);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="nightPrompt">
      <div
        className="nightPrompt__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dayPromptTitle"
      >
        <div className="nightPrompt__icon nightPrompt__icon--day">
          <SunLight width={26} strokeWidth={1.8} />
        </div>
        <p className="nightPrompt__time">{time} in Lagos</p>
        <h2 id="dayPromptTitle">It&apos;s daytime in Lagos</h2>
        <p className="nightPrompt__text">
          Switch to the light theme: a brighter look that is easier to read in daylight.
        </p>
        <div className="nightPrompt__actions">
          <button type="button" className="primary" onClick={accept} autoFocus>
            Switch to light mode
          </button>
          <button type="button" className="ghost" onClick={dismiss}>
            Keep dark mode
          </button>
        </div>
      </div>
    </div>
  );
}
