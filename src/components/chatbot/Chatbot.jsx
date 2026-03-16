import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { ArrowDown, ArrowUp, Language, NavArrowDown, Xmark } from 'iconoir-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router';
import remarkGfm from 'remark-gfm';
import { getAllMembers } from '../../api/read/executives.req';
import { getAllMdas } from '../../api/read/mda.req';
import { getAllServices, getAllServicesCategory } from '../../api/read/services.req';
import { formattedName } from '../../pages/MDAs/api/admin/logic';
import pdf from '../../pages/MDAs/shared/assets/sectionsIcons/pdf.png';
import { useThemeStore } from '../../pages/MDAs/stores/theme.store';
import { useApp } from '../../stores/app.store';
import { useChatStore } from '../../stores/chat.store';
import {
  extractLgaFromMessage,
  getLgaPrompt,
  needsLocationContext,
} from '../../utils/locationUtils';
import LanguageModal from '../language/LanguageModal';
import './chatbot.css';
import think_img from './comment.png';
import { CONTEXT } from './context';
import './searchBorderAnimation.scss';

// ---- Ministry Context Setup ----
const MINISTRY_CONTEXT_MAP = {
  health: { name: 'Lagos State Ministry of Health', url: 'https://health.lagosstate.gov.ng' },
  mepb: {
    name: 'Lagos State Ministry of Economic Planning and Budget',
    url: 'https://mepb.lagosstate.gov.ng',
  },
  finance: { name: 'Lagos State Ministry of Finance', url: 'https://finance.lagosstate.gov.ng' },
  sto: { name: 'Lagos State Treasury Office', url: 'https://sto.lagosstate.gov.ng' },
  transport: {
    name: 'Lagos State Ministry of Transportation',
    url: 'https://transportation-blush.vercel.app',
  },
  mist: {
    name: 'Lagos State Ministry of Innovation, Science and Technology (MIST)',
    url: 'https://mist.lagosstate.gov.ng',
  },
  '': { name: 'Lagos State Official Website', url: 'https://lagosstate.gov.ng' },
};

// ---- SINGLE Gemini Instance ----
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// ---- Supabase ----
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

// ---- Simple in-memory cache ----
const suggestionCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 min

// ---- Personnel keywords — used to skip stale PDF chunks for people questions ----
const PERSONNEL_KEYWORDS = [
  'commissioner',
  'governor',
  'chief of staff',
  'deputy governor',
  'ssg',
  'secretary to the state',
  'head of service',
  'special adviser',
  'special advisor',
  'leadership',
  'cabinet',
  'executive council',
  'who leads',
  'who is the',
  'who are the',
  'ministers',
  'political',
];

const Chatbot = ({ pageContext }) => {
  // ---- Chat store ----
  const checkIsChatOpen = useChatStore((state) => state.checkIsChatOpen);
  const setCheckIsChatOpen = useChatStore((state) => state.setCheckIsChatOpen);
  const ChatStoreMessage = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);

  // ---- MDA data from theme store ----
  const mdaData = useThemeStore((state) => state.mdaData);
  const currentMda = useThemeStore((state) => state.mda);

  const safePage = typeof pageContext === 'string' ? pageContext.toLowerCase() : '';
  const ministryInfo = MINISTRY_CONTEXT_MAP[safePage] || null;
  const isGeneralPage = !pageContext || pageContext.trim() === 'general' || pageContext === '';

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm here to help you access services quickly and easily.\n\nWhat service would you like to access today?`,
    },
  ]);
  const [mdaServices, setMdaServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [initialSuggestions, setInitialSuggestions] = useState([]);
  const [welcomeSuggestions, setWelcomeSuggestions] = useState([]);
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);
  const isUserScrolling = useRef(false);
  const [isLocationPrompt, setIsLocationPrompt] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const setSuggestions = useApp((state) => state.setSuggestions);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const setLanguagePreference = useChatStore((state) => state.setLanguagePreference);
  const languagePreference = useChatStore((state) => state.languagePreference);

  // ---- General LASG live data ----
  const [executiveCouncil, setExecutiveCouncil] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [allMdas, setAllMdas] = useState([]);

  const LANGUAGES = {
    en: { name: 'English', code: 'en' },
    yo: { name: 'Yorùbá', code: 'yo' },
    pcm: { name: 'Nigerian Pidgin', code: 'pcm' },
    ig: { name: 'Igbo', code: 'ig' },
    ha: { name: 'Hausa', code: 'ha' },
  };

  // ── Fetch live general LASG data ─────────────────────────────────────────────
  const fetchExecutiveCouncil = useCallback(async () => {
    try {
      const members = await getAllMembers();
      if (Array.isArray(members) && members.length > 0) {
        // getAllMembers returns { fullname, position, photo, email, ... }
        setExecutiveCouncil(
          members.map((m) => ({
            name: m.fullname || m.name || 'N/A',
            position: m.position || 'N/A',
            email: m.email || null,
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching executive council:', err);
    }
  }, []);

  const fetchAllServices = useCallback(async () => {
    try {
      const res = await getAllServices();
      const data = res?.data || res;
      if (Array.isArray(data) && data.length > 0) {
        // getAllServices returns { name, short, url, categories, ... }
        setAllServices(data);
      }
    } catch (err) {
      console.error('Error fetching all services:', err);
    }
  }, []);

  const fetchAllMdas = useCallback(async () => {
    try {
      const res = await getAllMdas();
      const data = res?.data || res;
      if (Array.isArray(data) && data.length > 0) {
        // getAllMdas returns { name, type, subdomain, description, email, address, ... }
        setAllMdas(data);
      }
    } catch (err) {
      console.error('Error fetching all MDAs:', err);
    }
  }, []);

  useEffect(() => {
    if (isGeneralPage) {
      fetchExecutiveCouncil();
      fetchAllServices();
      fetchAllMdas();
    }
  }, [isGeneralPage, fetchExecutiveCouncil, fetchAllServices, fetchAllMdas]);

  // ---- Single chat session per lifecycle ----
  const chatSessionRef = useRef(null);
  const location = useLocation();

  // ── Build general LASG context string from live data ─────────────────────────
  const generalLagosContext = useMemo(() => {
    if (!isGeneralPage) return '';

    // Group members by role type for cleaner context
    const governor = executiveCouncil.find(
      (m) =>
        m.position?.toLowerCase().includes('governor') &&
        !m.position?.toLowerCase().includes('deputy') &&
        !m.position?.toLowerCase().includes('lt.')
    );
    const deputyGovernor = executiveCouncil.find(
      (m) =>
        m.position?.toLowerCase().includes('deputy governor') ||
        m.position?.toLowerCase().includes('lt. governor')
    );
    const chiefOfStaff = executiveCouncil.find(
      (m) =>
        m.position?.toLowerCase().includes('chief of staff') &&
        !m.position?.toLowerCase().includes('deputy')
    );
    const deputyChiefOfStaff = executiveCouncil.find((m) =>
      m.position?.toLowerCase().includes('deputy chief of staff')
    );
    const ssg = executiveCouncil.find(
      (m) =>
        m.position?.toLowerCase().includes('secretary to the state') ||
        m.position?.toLowerCase().includes('ssg')
    );
    const headOfService = executiveCouncil.find((m) =>
      m.position?.toLowerCase().includes('head of service')
    );
    const commissioners = executiveCouncil.filter((m) =>
      m.position?.toLowerCase().includes('commissioner')
    );
    const specialAdvisers = executiveCouncil.filter((m) =>
      m.position?.toLowerCase().includes('special advis')
    );
    const others = executiveCouncil.filter((m) => {
      const pos = m.position?.toLowerCase() || '';
      return (
        !pos.includes('governor') &&
        !pos.includes('chief of staff') &&
        !pos.includes('secretary to the state') &&
        !pos.includes('ssg') &&
        !pos.includes('head of service') &&
        !pos.includes('commissioner') &&
        !pos.includes('special advis')
      );
    });

    // Group MDAs by type
    const ministries = allMdas.filter((m) => m.type === 'ministry');
    const agencies = allMdas.filter((m) => m.type === 'agency');
    const parastatals = allMdas.filter((m) => m.type === 'parastatal');
    const otherMdas = allMdas.filter((m) => !['ministry', 'agency', 'parastatal'].includes(m.type));

    return `
🏛️ LAGOS STATE GOVERNMENT — CURRENT LIVE DATA (always prefer this over any document for people and leadership)
══════════════════════════════════════════════════════════

📌 EXECUTIVE LEADERSHIP:
${governor ? `• Governor: ${governor.name}` : ''}
${deputyGovernor ? `• Deputy Governor: ${deputyGovernor.name}` : ''}
${chiefOfStaff ? `• Chief of Staff: ${chiefOfStaff.name}` : ''}
${deputyChiefOfStaff ? `• Deputy Chief of Staff: ${deputyChiefOfStaff.name}` : ''}
${ssg ? `• Secretary to the State Government (SSG): ${ssg.name}` : ''}
${headOfService ? `• Head of Service: ${headOfService.name}` : ''}

📌 COMMISSIONERS (${commissioners.length} total):
${
  commissioners.length > 0
    ? commissioners.map((m) => `• ${m.name} — ${m.position}`).join('\n')
    : '- Loading...'
}

📌 SPECIAL ADVISERS:
${
  specialAdvisers.length > 0
    ? specialAdvisers.map((m) => `• ${m.name} — ${m.position}`).join('\n')
    : '- None listed'
}
${
  others.length > 0
    ? `\n📌 OTHER COUNCIL MEMBERS:\n${others.map((m) => `• ${m.name} — ${m.position}`).join('\n')}`
    : ''
}

══════════════════════════════════════════════════════════
🏢 GOVERNMENT MINISTRIES (${ministries.length}):
${
  ministries.length > 0
    ? ministries
        .map(
          (m) =>
            `• ${m.name}${m.subdomain ? ` [${m.subdomain}]` : ''}${m.description ? ` — ${m.description}` : ''}${m.email ? ` | ${m.email}` : ''}`
        )
        .join('\n')
    : '- Loading...'
}

🏢 AGENCIES (${agencies.length}):
${
  agencies.length > 0
    ? agencies
        .map(
          (m) =>
            `• ${m.name}${m.subdomain ? ` [${m.subdomain}]` : ''}${m.description ? ` — ${m.description}` : ''}${m.email ? ` | ${m.email}` : ''}${m.address ? ` | ${m.address}` : ''}`
        )
        .join('\n')
    : '- Loading...'
}
${
  parastatals.length > 0
    ? `\n🏢 PARASTATALS (${parastatals.length}):\n${parastatals.map((m) => `• ${m.name}${m.subdomain ? ` [${m.subdomain}]` : ''}${m.description ? ` — ${m.description}` : ''}`).join('\n')}`
    : ''
}
${
  otherMdas.length > 0
    ? `\n🏢 OTHER MDAs:\n${otherMdas.map((m) => `• ${m.name}${m.description ? ` — ${m.description}` : ''}`).join('\n')}`
    : ''
}

══════════════════════════════════════════════════════════
⚙️ AVAILABLE SERVICES (${allServices.length} total):
${
  allServices.length > 0
    ? allServices
        .map(
          (s) =>
            `• ${s.name}${s.short ? ` — ${s.short}` : ''}${s.categories?.length > 0 ? ` [${s.categories.join(', ')}]` : ''}${s.url ? ` → ${s.url}` : ''}`
        )
        .join('\n')
    : '- Loading...'
}

Official Portal: https://lagosstate.gov.ng
`;
  }, [isGeneralPage, executiveCouncil, allMdas, allServices]);

  // ── Memoized system prompt ────────────────────────────────────────────────────
  const ministryContext = useMemo(() => {
    const history = messages
      .slice(-6)
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const languageInstruction =
      languagePreference !== 'en'
        ? `\n\n🌍 CRITICAL LANGUAGE REQUIREMENT:\nYou MUST respond EXCLUSIVELY in ${LANGUAGES[languagePreference].name} language, regardless of what language the user writes in. This is a strict requirement.`
        : '';

    let contextBlock = '';

    if (mdaData && Object.keys(mdaData).length > 0) {
      // ── MDA-specific page ──
      contextBlock = `
**CURRENT MDA CONTEXT:**
🏛️ **DETAILED MDA INFORMATION:**
**Full Name:** ${mdaData.fullname || mdaData.name || currentMda}
**Slug:** ${mdaData.slug || currentMda}
**Mission:** ${mdaData.mission || 'No mission available'}
**Vision:** ${mdaData.vision || 'No vision available'}
**Official Website:** lagosstate.gov.ng/${mdaData.slug || currentMda}

**Contact Information:**
**Email:** ${mdaData.contact?.email || 'No email available'}
**Phone:** ${mdaData.contact?.phone || 'No phone available'}
**Address:** ${mdaData.contact?.address || 'No address available'}
**Social Media:** ${
        mdaData.contact?.socials
          ? Object.entries(mdaData.contact.socials)
              .map(([platform, url]) => `${platform}: ${url}`)
              .join(', ')
          : 'No social media available'
      }

**People/Leadership:**
${
  mdaData.people
    ? mdaData.people
        .map((p) => `- ${p.name || 'N/A'} (${p.role || 'Position not specified'})`)
        .join('\n')
    : '- No people information available'
}

**Agencies & Departments:**
${
  mdaData.agencies
    ? mdaData.agencies
        .map((a) => `- ${a.name || 'Agency name'} (${a.category || 'department'})`)
        .join('\n')
    : '- No agencies information available'
}

**Resources:**
${
  mdaData.resources
    ? mdaData.resources.map((r) => `- ${r.name || 'Resource'}: ${r.url || 'No URL'}`).join('\n')
    : '- No resources information available'
}

**Statistics:**
${
  mdaData.statistics
    ? Object.entries(mdaData.statistics)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n')
    : '- No statistics available'
}`;
    } else if (isGeneralPage) {
      // ── General LASG page — inject full live data ──
      contextBlock = generalLagosContext;
    } else {
      contextBlock = `
**MINISTRY CONTEXT:**
**${ministryInfo ? ministryInfo.name : 'Lagos State Ministry or Department'}**
${ministryInfo ? `Official Website: ${ministryInfo.url}` : ''}`;
    }

    return `
${CONTEXT}

You are assisting a user on the "${safePage || 'Lagos State Government'}" section of the Lagos State Government website.

${contextBlock}

🧭 BEHAVIOURAL RULES:
- CRITICAL: For questions about current leadership, commissioners, governor, deputy governor, chief of staff, SSG, head of service, or any government personnel — ALWAYS use the live data provided above in this system context. NEVER source personnel names or roles from uploaded documents, as those are historical and may be outdated.
- Uploaded knowledge base documents are ONLY authoritative for policies, budgets, financial reports, procedures, and non-personnel content.
- When citing a document, note its title and year if available, and remind the user that personnel/leadership information in that document may no longer be current.
- Answer questions with verified Lagos-specific details.
- When answering from knowledge base documents, mention the document name.
- Include official links where applicable.
- Redirect politely if unrelated to Lagos State.
${languageInstruction}

📚 Recent Conversation:
${history}
`;
  }, [
    safePage,
    ministryInfo,
    messages,
    languagePreference,
    mdaData,
    currentMda,
    isGeneralPage,
    generalLagosContext,
  ]);

  useEffect(() => {
    if (chatSessionRef.current) {
      chatSessionRef.current = null;
      initializeChatSession();
    }
  }, [languagePreference]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageMenu && !event.target.closest('.language-preference')) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageMenu]);

  // ---- Initialize chat session ONCE ----
  const initializeChatSession = useCallback(async () => {
    if (!chatSessionRef.current) {
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.1-flash-lite-preview',
        systemInstruction: ministryContext,
      });
      chatSessionRef.current = model.startChat({
        history: [],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
      });
    }
  }, [ministryContext]);

  // ---- Scroll behavior ----
  const scrollToBottom = useCallback(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: 'auto',
      });
    }
  }, []);

  // ── MDA welcome content ───────────────────────────────────────────────────────
  useEffect(() => {
    const generateWelcomeContent = async () => {
      if (!mdaData?.fullname) return;
      try {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

        const servicesData = await getAllServicesCategory(formattedName(mdaData.fullname));
        const services = servicesData?.data || [];
        setMdaServices(services);

        const suggestions = services
          .sort(() => Math.random() - 0.5)
          .slice(0, 5)
          .map((s) => `How to access ${s.name}?`);

        const intelligentQuestions = [];
        const ministryName = mdaData.fullname?.toLowerCase() || '';

        if (ministryName.includes('health')) {
          intelligentQuestions.push(
            'What health programs are available for citizens?',
            'How do I get medical assistance or health insurance?',
            'Where can I find vaccination centers near me?',
            'What are the requirements for health facility registration?'
          );
        } else if (ministryName.includes('education')) {
          intelligentQuestions.push(
            'How do I apply for scholarships or educational grants?',
            'What schools are under your jurisdiction?',
            'What teacher certification programs do you offer?'
          );
        } else if (ministryName.includes('transport')) {
          intelligentQuestions.push(
            "How do I apply for driver's licenses or vehicle permits?",
            'What public transportation options are available?',
            'How can I report road safety issues?'
          );
        } else if (
          ministryName.includes('finance') ||
          ministryName.includes('budget') ||
          ministryName.includes('economic')
        ) {
          intelligentQuestions.push(
            'How can I access budget information and financial reports?',
            'What economic development programs are available?',
            'Where can I find tax information and payment options?'
          );
        } else if (ministryName.includes('technology') || ministryName.includes('innovation')) {
          intelligentQuestions.push(
            'What technology initiatives are currently running?',
            'How can I participate in innovation programs?',
            'What tech training opportunities are available?'
          );
        } else {
          intelligentQuestions.push(
            'What are the main services provided to citizens?',
            'How can I participate in community programs?',
            'How do I file complaints or provide feedback?'
          );
        }

        if (mdaData.contact?.address)
          intelligentQuestions.push('What are your office hours and location?');
        if (mdaData.contact?.phone || mdaData.contact?.email)
          intelligentQuestions.push("What's the best way to reach you for urgent matters?");
        intelligentQuestions.push(
          `What new initiatives has ${mdaData.fullname} launched recently?`,
          `What achievements has ${mdaData.fullname} accomplished recently?`
        );

        const remainingSlots = 10 - suggestions.length;
        intelligentQuestions
          .sort(() => Math.random() - 0.5)
          .slice(0, remainingSlots)
          .forEach((q) => suggestions.push(q));

        setWelcomeSuggestions(suggestions.sort(() => Math.random() - 0.5).slice(0, 10));
        setMessages([
          {
            role: 'assistant',
            content: `${greeting}! Welcome to ${mdaData.fullname}. How can I help you today?`,
          },
        ]);
      } catch (err) {
        console.error('Could not generate MDA welcome content:', err);
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
        setWelcomeSuggestions([
          `What services are available?`,
          `Tell me about ${mdaData.fullname}`,
          `How can I contact ${mdaData.fullname}?`,
          `What programs do you offer?`,
          `Where are you located?`,
          `Who leads ${mdaData.fullname}?`,
        ]);
        setMessages([
          {
            role: 'assistant',
            content: `${greeting}! Welcome to ${mdaData.fullname}. How can I help you today?`,
          },
        ]);
      }
    };
    generateWelcomeContent();
  }, [mdaData?.fullname]);

  // ── General LASG welcome content ─────────────────────────────────────────────
  useEffect(() => {
    if (!isGeneralPage || mdaData?.fullname) return;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const suggestions = [];

    // Pull from live data once it's loaded
    if (executiveCouncil.length > 0) {
      suggestions.push('Who are the current Lagos State Commissioners?');
      suggestions.push('Who leads Lagos State Government?');
    }
    if (allServices.length > 0) {
      allServices
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .forEach((s) => suggestions.push(`How to access ${s.name}?`));
    }
    if (allMdas.length > 0) {
      suggestions.push('Which government agency handles my needs?');
      suggestions.push('List all Lagos State MDAs');
    }

    const fallback = [
      'What healthcare services are available?',
      'How do I start a business in Lagos?',
      'What transportation options exist?',
      'How can I pay my taxes?',
      'What emergency services are available?',
      'How do I contact Lagos State Government?',
      'What digital services are available?',
    ];
    const remaining = 10 - suggestions.length;
    fallback
      .sort(() => Math.random() - 0.5)
      .slice(0, remaining)
      .forEach((q) => suggestions.push(q));

    setWelcomeSuggestions(suggestions.sort(() => Math.random() - 0.5).slice(0, 10));
    setMessages([
      {
        role: 'assistant',
        content: `${greeting}! Welcome to Lagos State Government. How can I help you access government services today?`,
      },
    ]);
  }, [
    isGeneralPage,
    mdaData?.fullname,
    executiveCouncil.length,
    allServices.length,
    allMdas.length,
  ]);

  useEffect(() => {
    if (checkIsChatOpen) {
      scrollToBottom();
      document.body.style.overflow = 'hidden';
      initializeChatSession();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [checkIsChatOpen]);

  useEffect(() => {
    if (ChatStoreMessage !== '') handleSubmit(ChatStoreMessage);
    addMessage('');
  }, [ChatStoreMessage, checkIsChatOpen]);

  useEffect(() => {
    setIsChatOpen(false);
    setCheckIsChatOpen(false);
    chatSessionRef.current = null;
    suggestionCache.clear();
    document.body.style.overflow = 'auto';
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (!chatWindowRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = chatWindowRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isAtBottom);
      isUserScrolling.current = !isAtBottom;
    };
    const chatEl = chatWindowRef.current;
    if (chatEl) chatEl.addEventListener('scroll', handleScroll);
    return () => chatEl && chatEl.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setSuggestions(initialSuggestions);
  }, [initialSuggestions]);

  useEffect(() => {
    if (checkIsChatOpen && !loading && inputRef.current) inputRef.current.focus();
  }, [messages, loading, checkIsChatOpen]);

  useEffect(() => {
    const allUserMessages = document.querySelectorAll('.user-msg');
    allUserMessages.forEach((msg) => msg.classList.remove('last-user-msg'));
    if (allUserMessages.length > 0 && chatWindowRef.current) {
      const lastUserMessage = allUserMessages[allUserMessages.length - 1];
      lastUserMessage.classList.add('last-user-msg');
      setTimeout(() => {
        chatWindowRef.current.scrollTo({ top: lastUserMessage.offsetTop - 80, behavior: 'smooth' });
      }, 50);
    }
  }, [messages]);

  // ---- Generate initial suggestions ----
  useEffect(() => {
    async function generateInitialSuggestions() {
      if (messages.length !== 1) return;
      const cacheKey = `initial_${safePage}`;
      const cached = suggestionCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setInitialSuggestions(cached.data);
        return;
      }
      const contextName = ministryInfo?.name || pageContext || 'Lagos State Government';
      const hour = new Date().getHours();
      let timeContext = '';
      if (isGeneralPage || contextName === 'Lagos State Official Website') {
        if (hour >= 5 && hour < 12) timeContext = 'Morning — services, permits, ministries.';
        else if (hour >= 12 && hour < 17)
          timeContext = 'Afternoon — services, permits, ministries.';
        else if (hour >= 17 && hour < 22)
          timeContext = 'Evening — emergencies, commute services, 24-hour services.';
        else timeContext = 'Late Night — emergencies, 24-hour services, police, health.';
      }
      const prompt = `Generate 6 service-focused questions (under 10 words) about accessing services from "${contextName}". ${timeContext}\nFormat: question1||question2||question3||question4||question5||question6`;
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
        const result = await model.generateContent(prompt);
        const suggestions = result.response
          .text()
          .split('||')
          .map((q) => q.trim())
          .filter(Boolean)
          .slice(0, 6);
        suggestionCache.set(cacheKey, { data: suggestions, timestamp: Date.now() });
        setInitialSuggestions(suggestions);
      } catch (err) {
        console.error('Error generating suggestions:', err);
      }
    }
    generateInitialSuggestions();
  }, [pageContext, ministryInfo, safePage, messages.length, isGeneralPage]);

  // ── Retrieve context from BOTH services table + document chunks ───────────────
  const getRelevantLagosContext = useCallback(
    async (query) => {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
        const embeddingResp = await model.embedContent({
          content: { role: 'user', parts: [{ text: `${pageContext} ${query}` }] },
          taskType: 'RETRIEVAL_QUERY',
          outputDimensionality: 768,
        });
        const embedding = embeddingResp.embedding.values;

        // Detect if question is about people/leadership — skip PDF chunks if so
        const queryIsAboutPeople = PERSONNEL_KEYWORDS.some((kw) =>
          query.toLowerCase().includes(kw)
        );

        const [servicesResult, docsResult] = await Promise.all([
          supabase.rpc('match_lagos_services', {
            query_embedding: embedding,
            match_threshold: 0.5,
            match_count: 4,
          }),
          // Skip doc chunks entirely for personnel questions to avoid stale data
          queryIsAboutPeople
            ? Promise.resolve({ data: [], error: null })
            : supabase.rpc('match_chunks', {
                query_embedding: embedding,
                match_threshold: 0.6,
                match_count: 6,
              }),
        ]);

        const contextParts = [];
        const downloadSources = [];

        if (!servicesResult.error && servicesResult.data?.length > 0) {
          const servicesContext = servicesResult.data
            .map((d) => `🏛️ **${d.name}**: ${d.short || ''} [Visit](${d.url || '#'})`)
            .join('\n');
          contextParts.push(`## Lagos State Services\n${servicesContext}`);
        }

        if (!docsResult.error && docsResult.data?.length > 0) {
          // Dedupe by document name, keep highest similarity
          const docMap = {};
          for (const chunk of docsResult.data) {
            if (
              !docMap[chunk.document_name] ||
              chunk.similarity > docMap[chunk.document_name].similarity
            ) {
              docMap[chunk.document_name] = chunk;
            }
          }

          const docsContext = docsResult.data
            .map(
              (chunk) =>
                `📄 **${chunk.document_name}** (${Math.round(chunk.similarity * 100)}% match):\n${chunk.content}`
            )
            .join('\n\n');
          contextParts.push(`## Knowledge Base Documents\n${docsContext}`);

          // Generate public download URLs for each unique matched doc
          for (const doc of Object.values(docMap)) {
            if (doc.file_path) {
              const { data: urlData } = supabase.storage.from('pdfs').getPublicUrl(doc.file_path);
              if (urlData?.publicUrl) {
                downloadSources.push({ name: doc.document_name, url: urlData.publicUrl });
              }
            }
          }
        }

        return { context: contextParts.join('\n\n'), downloadSources };
      } catch (err) {
        console.error('Error retrieving context:', err);
        return { context: '', downloadSources: [] };
      }
    },
    [pageContext]
  );

  // ---- Generate follow-ups ----
  const generateFollowUps = useCallback(
    async (lastReply, sender) => {
      if (sender !== 'assistant') return [];
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
        let contextStr = '';
        let entityName = '';

        if (mdaData && Object.keys(mdaData).length > 0) {
          entityName = mdaData.fullname || mdaData.name || currentMda;
          let services = [];
          try {
            const sd = await getAllServicesCategory(formattedName(mdaData.fullname));
            services =
              sd?.data
                ?.map((s) => s.name)
                .filter(Boolean)
                .slice(0, 5) || [];
          } catch (_) {}
          contextStr = `MDA: ${entityName}\nServices: ${services.join(', ') || 'various'}\nContact: ${mdaData.contact?.email || 'available'}`;
        } else if (isGeneralPage) {
          entityName = 'Lagos State Government';
          const serviceNames = allServices
            .slice(0, 8)
            .map((s) => s.name)
            .filter(Boolean);
          const mdaNames = allMdas
            .slice(0, 6)
            .map((m) => m.name)
            .filter(Boolean);
          const leaders = executiveCouncil.slice(0, 3).map((m) => `${m.name} (${m.position})`);
          contextStr = `Entity: Lagos State Government\nServices: ${serviceNames.join(', ') || 'healthcare, business, transport, education'}\nLeadership: ${leaders.join(', ') || 'Governor, Deputy Governor, Commissioners'}\nAgencies: ${mdaNames.join(', ') || 'various MDAs'}`;
        } else {
          return [];
        }

        const prompt = `Generate 5 service-focused follow-up questions (under 10 words each) for ${entityName} based on:
Response: "${lastReply.slice(0, 200)}"
Context: ${contextStr}
Rules: Questions must be actionable and about ${entityName} services only.
Format: q1||q2||q3||q4||q5`;

        const result = await model.generateContent(prompt);
        return result.response
          .text()
          .split('||')
          .map((q) => q.trim())
          .filter(Boolean)
          .slice(0, 5);
      } catch (err) {
        console.error('Follow-up generation error:', err);
        return [];
      }
    },
    [mdaData, currentMda, isGeneralPage, executiveCouncil, allServices, allMdas]
  );

  // ---- Location detection ----
  const detectNeedsLocation = useCallback((message) => {
    return ['near', 'closest', 'nearby', 'around', 'in my area', 'location'].some((kw) =>
      message.toLowerCase().includes(kw)
    );
  }, []);

  // ── Main handleSubmit ─────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (customInput) => {
      const input = customInput || chatInput;
      if (input.trim() === '' || loading) return;

      setLoading(true);
      setFollowUps([]);
      setIsStreaming(true);

      setMessages((prev) => [...prev, { role: 'user', content: input }]);
      scrollToBottom();

      const lga = extractLgaFromMessage(input);
      const needsLoc = needsLocationContext(input);
      const needsLocation = detectNeedsLocation(input);
      let activePrompt = isLocationPrompt;

      if (needsLoc && !lga && needsLocation) {
        activePrompt = input;
        setIsLocationPrompt(input);
        setLoading(false);
        setMessages((prev) => [...prev, { role: 'assistant', content: getLgaPrompt() }]);
        setChatInput('');
        return;
      }

      const finalInput =
        (needsLocation && activePrompt) || isLocationPrompt
          ? `${activePrompt || isLocationPrompt} in ${input}`
          : input;

      if (activePrompt || isLocationPrompt) setIsLocationPrompt(null);

      const assessConfidence = (text) => {
        const uncertain = [
          'not sure',
          "i don't have",
          'i need to check',
          'cannot verify',
          'unknown',
          'i am unsure',
        ];
        const count = uncertain.filter((kw) => text.toLowerCase().includes(kw)).length;
        return 1 - count / uncertain.length;
      };

      const fetchFallback = async (query) => {
        try {
          const m = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
          const r = await m.generateContent(
            `Provide verified Lagos State info (official sites only) for: "${query}" in under 100 words.`
          );
          return r.response.text();
        } catch (_) {
          return '';
        }
      };

      try {
        await initializeChatSession();

        const { context: lagosContext, downloadSources } =
          await getRelevantLagosContext(finalInput);

        const contextualPrompt = lagosContext
          ? `## Relevant Lagos State Context:\n${lagosContext}\n\n## Instructions\n- Prioritize Knowledge Base Documents and Services above.\n- Mention document names when referencing them.\n- For leadership/personnel questions, rely ONLY on the live data in your system context, not on documents.\n- Keep answers focused on Lagos State.\n\n## User Question\n${finalInput}`
          : finalInput;

        let assistantText = '';
        let fallbackTriggered = false;

        setMessages((prev) => [...prev, { role: 'assistant', content: '', downloadSources: [] }]);

        const result = await chatSessionRef.current.sendMessageStream(contextualPrompt);

        for await (const chunk of result.stream) {
          const textPart = chunk.text();
          if (!textPart) continue;
          assistantText += textPart;

          if (!fallbackTriggered && assessConfidence(textPart) < 0.6) {
            fallbackTriggered = true;
            const snippet = await fetchFallback(input);
            if (snippet) assistantText += `\n\n🔎 Latest info from Lagos State sites:\n${snippet}`;
          }

          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === 'assistant') last.content = assistantText;
            return updated;
          });
        }

        // Attach download sources after streaming completes
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === 'assistant') last.downloadSources = downloadSources;
          return updated;
        });

        setIsStreaming(false);
        const followUpQs = await generateFollowUps(assistantText, 'assistant');
        setFollowUps(followUpQs);
      } catch (err) {
        console.error('Chat error:', err);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Something went wrong. Please try again.' },
        ]);
        chatSessionRef.current = null;
      }

      setChatInput('');
      setLoading(false);
    },
    [
      chatInput,
      loading,
      isLocationPrompt,
      messages.length,
      initializeChatSession,
      getRelevantLagosContext,
      detectNeedsLocation,
      scrollToBottom,
      generateFollowUps,
    ]
  );

  // ---- Clickable service component ----
  const ClickableService = ({ children }) => {
    const text = typeof children === 'string' ? children : children?.props?.children || children;
    return (
      <span
        onClick={() => handleSubmit(text)}
        style={{
          cursor: 'pointer',
          color: '#28a745',
          textDecoration: 'underline',
          fontWeight: 'bold',
        }}
        title={`Click to ask: ${text}`}
      >
        {text}
      </span>
    );
  };

  const markdownComponents = useMemo(
    () => ({
      strong: ({ children, ...props }) => {
        const text =
          typeof children === 'string' ? children : children?.props?.children || children;
        const isService = mdaServices.some((s) => text.includes(s.name));
        const isQuestion = [
          'How to',
          'Tell me about',
          'Do you want to',
          'Who are',
          'What departments',
          'How can I',
          'Do you want to book',
        ].some((q) => text.includes(q));
        if (isService || isQuestion) return <ClickableService>{text}</ClickableService>;
        return <strong {...props}>{children}</strong>;
      },
    }),
    [mdaServices]
  );

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="bubblePage" onClick={() => setCheckIsChatOpen(true)}>
        <img src={think_img} alt="Chat Bubble" />
      </div>

      {checkIsChatOpen && (
        <div className="chatParent">
          <div className="chat-title">
            <div className="avatar">
              <img
                src="https://static.vecteezy.com/system/resources/previews/001/993/889/non_2x/beautiful-latin-woman-avatar-character-icon-free-vector.jpg"
                alt="avatar"
              />
            </div>
            <div className="identity flex justify-between items-center">
              Eko Smart
              <div className="closeChatModal" onClick={() => setCheckIsChatOpen(false)}>
                <Xmark strokeWidth={2} />
              </div>
            </div>
          </div>

          <div className="chat-window" ref={chatWindowRef}>
            <div className="messages">
              {messages.map((msg, i) => {
                if (msg.role === 'assistant' && msg.content.trim() === '') return null;
                const isUser = msg.role === 'user';
                return (
                  <div key={i} className={`message ${isUser ? 'user-msg' : 'bot-msg'}`}>
                    <div className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {/* ── Document download pills ── */}
                    {!isUser && msg.downloadSources?.length > 0 && (
                      <div className="chatbot-download-sources">
                        <span className="chatbot-download-label">📎 Referenced Documents:</span>
                        <div className="chatbot-download-list">
                          {msg.downloadSources.map((source, idx) => (
                            <a
                              key={idx}
                              href={source.url}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="chatbot-download-pill"
                            >
                              <img src={pdf} alt="" /> {source.name}{' '}
                              <div className="ml-auto">
                                <ArrowDown fontSize={9} />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="thinking">
                  <p>
                    <div className="think_img">
                      <img src={think_img} alt="Think" />
                    </div>
                    Eko Smart is thinking
                  </p>
                  <span className="thinking-dots"></span>
                </div>
              )}
            </div>

            <div className="quickSuggestions">
              {welcomeSuggestions.length > 0 && messages.length === 1 && (
                <>
                  <p>What can I help you with today?</p>
                  <div className="followups initial-suggestions">
                    {welcomeSuggestions.map((q, idx) => (
                      <button key={idx} onClick={() => handleSubmit(q)} className="followup-btn">
                        {q}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="input-section flex flex-col gap-[10px]">
            <div className="overflow-clip overflow-x-auto w-[calc(100%-20px)] no-scrollbar">
              {followUps.length > 0 && (
                <div className="followups flex-nowrap!">
                  {followUps.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSubmit(q)}
                      className="followup-btn flex-shrink-0"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <textarea
              ref={inputRef}
              disabled={loading}
              value={loading ? '' : chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Eko Smart about Lagos State services..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />

            <div
              className="language-preference flex items-center gap-[6px]"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <div>
                <Language className="text-[12px]" />
              </div>
              <p className="font-medium">{LANGUAGES[languagePreference].name}</p>
              <div>
                <NavArrowDown className="text-[12px]" />
              </div>
              {showLanguageMenu && (
                <LanguageModal
                  closeModal={() => setShowLanguageMenu(false)}
                  language={languagePreference}
                  setLanguage={setLanguagePreference}
                  setShowLanguageMenu={setShowLanguageMenu}
                  LANGUAGES={LANGUAGES}
                  customClass="main-lang"
                />
              )}
            </div>

            {loading ? (
              <button disabled className="stop-btn send-btn-chat">
                <ArrowUp />
              </button>
            ) : (
              <button className="send-btn-chat" onClick={() => handleSubmit()}>
                <ArrowUp />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
