import { HalfMoon, SunLight } from 'iconoir-react';
import { useApp } from '../../stores/app.store';
import './theme-toggle.css';

export default function ThemeToggle({ className = '' }) {
  const darkmode = useApp((s) => s.darkmode);
  const setDarkmode = useApp((s) => s.setDarkmode);
  const label = darkmode ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      className={`themeToggle ${className}`}
      onClick={() => setDarkmode(!darkmode)}
      aria-label={label}
      title={label}
    >
      {darkmode ? <SunLight width={18} strokeWidth={1.8} /> : <HalfMoon width={18} strokeWidth={1.8} />}
    </button>
  );
}
