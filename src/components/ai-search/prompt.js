// System prompt for the main-site assistant: the static persona (kept first so
// the provider can cache it), then live leadership data and a compact MDA
// index, today's date and the language instruction. Scope details (selected
// MDAs / categories) are appended server-side from our own database.
import { CONTEXT } from '../chatbot/context';
import { LANGUAGES } from './languages';

const has = (m, ...words) => words.some((w) => m.position?.toLowerCase().includes(w));

const buildLeadership = (executives) => {
  const governor = executives.find((m) => has(m, 'governor') && !has(m, 'deputy', 'lt.'));
  const deputyGovernor = executives.find((m) => has(m, 'deputy governor', 'lt. governor'));
  const chiefOfStaff = executives.find((m) => has(m, 'chief of staff') && !has(m, 'deputy'));
  const deputyChiefOfStaff = executives.find((m) => has(m, 'deputy chief of staff'));
  const ssg = executives.find((m) => has(m, 'secretary to the state', 'ssg'));
  const headOfService = executives.find((m) => has(m, 'head of service'));
  const commissioners = executives.filter((m) => has(m, 'commissioner'));
  const advisers = executives.filter((m) => has(m, 'special advis'));
  const others = executives.filter(
    (m) => !has(m, 'governor', 'chief of staff', 'secretary to the state', 'ssg', 'head of service', 'commissioner', 'special advis')
  );

  const lines = [];
  if (governor) lines.push(`• Governor: ${governor.name}`);
  if (deputyGovernor) lines.push(`• Deputy Governor: ${deputyGovernor.name}`);
  if (chiefOfStaff) lines.push(`• Chief of Staff: ${chiefOfStaff.name}`);
  if (deputyChiefOfStaff) lines.push(`• Deputy Chief of Staff: ${deputyChiefOfStaff.name}`);
  if (ssg) lines.push(`• Secretary to the State Government (SSG): ${ssg.name}`);
  if (headOfService) lines.push(`• Head of Service: ${headOfService.name}`);

  return [
    'EXECUTIVE LEADERSHIP:',
    lines.join('\n') || '- not loaded',
    '',
    `COMMISSIONERS (${commissioners.length}):`,
    commissioners.map((m) => `• ${m.name} — ${m.position}`).join('\n') || '- not loaded',
    advisers.length ? `\nSPECIAL ADVISERS:\n${advisers.map((m) => `• ${m.name} — ${m.position}`).join('\n')}` : '',
    others.length ? `\nOTHER COUNCIL MEMBERS:\n${others.map((m) => `• ${m.name} — ${m.position}`).join('\n')}` : '',
  ]
    .filter((l) => l !== '')
    .join('\n');
};

export const buildSystemPrompt = ({ live, language = 'en', emergency = false }) => {
  const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Africa/Lagos',
  });

  // Names only — descriptions/contacts come from the find_mda tool on demand.
  const mdaIndex = live.mdas.map((m) => `${m.name}${m.subdomain ? ` (${m.subdomain})` : ''}`).join('; ');

  const languageInstruction =
    language !== 'en' && LANGUAGES[language]
      ? `\n\n🌍 CRITICAL LANGUAGE REQUIREMENT:\nYou MUST respond EXCLUSIVELY in ${LANGUAGES[language].name}, regardless of what language the user writes in. This is a strict requirement.`
      : '';

  return `
${CONTEXT}

You are assisting a user on the main Lagos State Government website (lagosstate.gov.ng).

🏛️ LAGOS STATE GOVERNMENT — CURRENT LIVE DATA (always prefer this over any document for people and leadership)

${buildLeadership(live.executives)}

MDA DIRECTORY (${live.mdas.length}) — names only. For description, email, phone or address of any of these, call the find_mda tool; never guess them:
${mdaIndex || '- not loaded'}

SERVICES: use search_lagos_services — do not list services from memory.
Official portal: https://lagosstate.gov.ng

Today's date: ${today} (Africa/Lagos). Treat anything before this as past; don't present expired events as upcoming.
${languageInstruction}${
    emergency
      ? "\n\n🚨 EMERGENCY MODE for this message: follow the Emergencies protocol exactly. The app has already shown the user tap-to-call buttons for 112 and 767, so don't ask them to find a number — open with the action, give options straight away, and ask for their area only at the end."
      : ''
  }
`;
};
