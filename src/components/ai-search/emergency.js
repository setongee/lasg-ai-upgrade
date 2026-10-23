// Fast, local check for messages that describe an emergency. It only decides
// whether to show the call card immediately and to put the model in emergency
// mode — a false positive costs a harmless card, a miss costs time, so the
// patterns lean towards matching. Numbers are the Lagos State emergency lines
// shown in the site's own header (LASEMA): 112 and 767.
export const EMERGENCY_LINES = [
  { number: '112', label: 'Call 112' },
  { number: '767', label: 'Call 767' },
];

const PATTERNS = [
  /\b(in|into|going into|started|start(s|ed)?)\s+labou?r\b/,
  /\blabou?r\s+(pain|pains|has started|started|is starting)\b/,
  /\b(wife|sister|girlfriend|mother|mum|mom|she|woman|lady)\b.*\b(labou?r|giving birth|delivering|contractions)\b/,
  /\bgiving birth\b/,
  /\bbleed/,
  /\bnot breathing\b|\bstopped breathing\b|\bcan'?t breathe\b|\bunconscious\b|\bpassed out\b|\bcollapsed\b/,
  /\bchoking\b|\bseizure\b|\bconvuls/,
  /\bheart attack\b|\bstroke\b|\bpoison(ed|ing)?\b|\boverdos/,
  /\bdrown(ed|ing)\b/,
  /\b(road\s+)?accident\b|\bcrash(ed)?\b/,
  /\b(on fire|fire outbreak|house is burning|building is burning|there'?s a fire|fire in)\b/,
  /\bbuilding collaps|\bcollapsed building\b|\btrapped\b/,
  /\b(robbery|robbers|armed|kidnap|abduct|stabbed|shot|gunshot|being attacked|rape[d]?)\b/,
  /\bflood(ing|ed)?\b.*\b(trapped|rising|help|rescue)\b/,
  /\b(emergency|ambulance|dying|life[- ]threatening)\b/,
  /\bhelp me\b|\bplease help\b|\bneed help (now|urgently|asap|quickly)\b/,
  /\b(hospital|maternity|clinic|ambulance)\b.*\b(asap|urgent(ly)?|quickly|immediately)\b|\b(asap|urgent(ly)?)\b.*\b(hospital|maternity|clinic|ambulance)\b/,
];

export const isEmergency = (text) => {
  const t = String(text || '').toLowerCase();
  return t.length > 0 && PATTERNS.some((re) => re.test(t));
};
