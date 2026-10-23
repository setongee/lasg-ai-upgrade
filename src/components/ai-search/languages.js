// Languages the assistant can answer in. `speech` is the BCP-47 tag handed to
// the browser's speech recognition for voice input (Pidgin has no recognizer
// of its own, so it uses Nigerian English).
export const LANGUAGES = {
  en: { name: 'English', native: 'English', speech: 'en-NG' },
  yo: { name: 'Yorùbá', native: 'Yorùbá', speech: 'yo-NG' },
  pcm: { name: 'Nigerian Pidgin', native: 'Naija Pidgin', speech: 'en-NG' },
  ig: { name: 'Igbo', native: 'Igbo', speech: 'ig-NG' },
  ha: { name: 'Hausa', native: 'Hausa', speech: 'ha-NG' },
};

export const MAX_SCOPE_MDAS = 5;
export const MAX_SCOPE_CATEGORIES = 3;
