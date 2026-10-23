import { useEffect, useState } from 'react';
import { useApp } from '../../stores/app.store';
import { useChatStore } from '../../stores/chat.store';
import { startChat } from './chatEngine';
import Composer from './Composer';
import { PALETTE_CLASS } from './palette';

const EMPTY = { mdas: [], categories: [] };

// The big composer in the home hero. Sending opens the chat workspace with a
// fresh session carrying whatever MDAs/categories were selected.
export default function HeroAsk() {
  const language = useChatStore((s) => s.languagePreference);
  const setLanguage = useChatStore((s) => s.setLanguagePreference);
  const [scope, setScope] = useState(EMPTY);

  // The placeholder cycles through real example questions so people see what
  // they can ask. Paused for reduced-motion users (they get the first one).
  const examples = useApp((s) => s.initialSuggestions);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!examples?.length || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
      return;
    const t = setInterval(() => setI((n) => n + 1), 3800);
    return () => clearInterval(t);
  }, [examples]);
  const example = examples?.length ? examples[i % examples.length] : '';

  return (
    <div className={`eko-hero-glow ${PALETTE_CLASS}`}>
      <Composer
        variant="hero"
        menuPlacement="down"
        placeholder={example ? `Ask anything, e.g. “${example}”` : undefined}
        scope={scope}
        onScopeChange={setScope}
        language={language}
        onLanguageChange={setLanguage}
        onSubmit={(text) => {
          startChat({ text, scope, language });
          setScope(EMPTY);
        }}
      />
    </div>
  );
}
