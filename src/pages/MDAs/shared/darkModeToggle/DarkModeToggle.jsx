import { HalfMoon, SunLight } from 'iconoir-react';
import { useThemeStore } from '../../stores/theme.store';
import './DarkModeToggle.css';

export default function DarkModeToggle() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

  return (
    <button
      type="button"
      className="darkModeToggle"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <SunLight width={20} strokeWidth={1.6} /> : <HalfMoon width={20} strokeWidth={1.6} />}
    </button>
  );
}
