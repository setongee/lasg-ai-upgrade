import { useState } from 'react';
import './ai-search.css';
import { greeting } from './greeting';
import { PALETTE_CLASS } from './palette';

// The home hero's headline: orb, a warm time-of-day greeting, and the site's
// "smarter, simpler" promise as the subtitle.
export default function HeroGreeting() {
  const [hello] = useState(() => greeting());

  return (
    <div className={`eko-hero-head ${PALETTE_CLASS}`}>
      <span className="eko-orb hero" aria-hidden="true" />
      <h1>{hello}. How can I help?</h1>
      <p>
        Your guide to Lagos State services, agencies and leaders.
        <span> Ask in English, Yorùbá, Pidgin, Igbo or Hausa — type it or say it.</span>
      </p>
    </div>
  );
}
