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
import { loadInitialSuggestions } from '../../utils/generateInitialSuggestions';
import { agentChatStream } from '../../utils/openrouter';
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
  const [initialSuggestions, setInitialSuggestions] = useState([]);
  const [welcomeSuggestions, setWelcomeSuggestions] = useState([]);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);
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

    // MDAs are NOT dumped in full (that was ~11k tokens on every request) —
    // just a compact name index so the model knows what exists; details
    // (description, contact info) come from the find_mda tool on demand.
    const mdaIndex = allMdas
      .map((m) => `${(m.name || '').trim()}${m.subdomain ? ` (${m.subdomain})` : ''}`)
      .filter(Boolean)
      .join('; ');

    return `
🏛️ LAGOS STATE GOVERNMENT — CURRENT LIVE DATA (always prefer this over any document for people and leadership)

EXECUTIVE LEADERSHIP:
${governor ? `• Governor: ${governor.name}\n` : ''}${deputyGovernor ? `• Deputy Governor: ${deputyGovernor.name}\n` : ''}${chiefOfStaff ? `• Chief of Staff: ${chiefOfStaff.name}\n` : ''}${deputyChiefOfStaff ? `• Deputy Chief of Staff: ${deputyChiefOfStaff.name}\n` : ''}${ssg ? `• Secretary to the State Government (SSG): ${ssg.name}\n` : ''}${headOfService ? `• Head of Service: ${headOfService.name}\n` : ''}
COMMISSIONERS (${commissioners.length}):
${commissioners.length > 0 ? commissioners.map((m) => `• ${m.name} — ${m.position}`).join('\n') : '- not loaded'}
${
  specialAdvisers.length > 0
    ? `\nSPECIAL ADVISERS:\n${specialAdvisers.map((m) => `• ${m.name} — ${m.position}`).join('\n')}`
    : ''
}
${
  others.length > 0
    ? `\nOTHER COUNCIL MEMBERS:\n${others.map((m) => `• ${m.name} — ${m.position}`).join('\n')}`
    : ''
}

MDA DIRECTORY (${allMdas.length}) — names only. For description, email, phone or address of any of these, call the find_mda tool; never guess them:
${mdaIndex || '- not loaded'}

SERVICES: use search_lagos_services — do not list services from memory.
Official portal: https://lagosstate.gov.ng
`;
  }, [isGeneralPage, executiveCouncil, allMdas]);

  // ── Memoized system prompt ────────────────────────────────────────────────────
  const ministryContext = useMemo(() => {
    const today = new Date().toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Africa/Lagos',
    });

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

Today's date: ${today} (Africa/Lagos). Treat anything before this as past; don't present expired events as upcoming.
${languageInstruction}
`;
  }, [
    safePage,
    ministryInfo,
    languagePreference,
    mdaData,
    currentMda,
    isGeneralPage,
    generalLagosContext,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageMenu && !event.target.closest('.language-preference')) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageMenu]);

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
    setCheckIsChatOpen(false);
    document.body.style.overflow = 'auto';
  }, [location]);

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
  // Shares a persistent (localStorage, 60-min) cache with App.jsx's first-paint
  // gate — for the page the user landed on, this resolves instantly from that
  // same cache entry instead of firing a second AI call.
  useEffect(() => {
    async function generateInitialSuggestions() {
      if (messages.length !== 1) return;
      const suggestions = await loadInitialSuggestions(safePage || 'general');
      setInitialSuggestions(suggestions);
    }
    generateInitialSuggestions();
  }, [safePage, messages.length]);

  // ── Main handleSubmit ─────────────────────────────────────────────────────────
  // Retrieval (services/knowledge-base search), web search, and the
  // "do I need their LGA?" decision all used to be client-side heuristics
  // (keyword lists, a confidence-score hack, a location state machine) run
  // before every model call. They're gone — the backend agent endpoint gives
  // the model real tools and lets it decide when it actually needs them.
  //
  // This is real token-by-token streaming again, just layered under the tool
  // loop: the backend streams every round, but tool-resolution rounds carry no
  // visible content (the model emits tool_calls, not text, on those turns), so
  // only the final round's tokens ever reach `onToken` — the "thinking" bubble
  // (via isAwaitingResponse below) naturally covers the tool-resolution time
  // and disappears the instant real answer tokens start arriving.
  const handleSubmit = useCallback(
    async (customInput) => {
      const input = customInput || chatInput;
      if (input.trim() === '' || loading) return;

      setLoading(true);

      // Real conversation turns (not a pasted blob in the system prompt): skip
      // the canned welcome message and empty placeholders, keep the last 8,
      // and clip long past answers so history stays cheap.
      const history = messagesRef.current
        .filter((m, i) => m.content && !(i === 0 && m.role === 'assistant'))
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));

      setMessages((prev) => [...prev, { role: 'user', content: input }]);
      scrollToBottom();

      try {
        setMessages((prev) => [...prev, { role: 'assistant', content: '', downloadSources: [] }]);

        const { content, downloadSources, truncated } = await agentChatStream(
          [
            { role: 'system', content: ministryContext },
            ...history,
            { role: 'user', content: input },
          ],
          {
            webSearch: true,
            maxTokens: 1800,
            temperature: 0.7,
            onToken: (_delta, fullSoFar) => {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === 'assistant') last.content = fullSoFar;
                return updated;
              });
            },
          }
        );

        const truncationNotice = truncated
          ? '\n\n*(That answer got cut short — ask me to continue if you need the rest.)*'
          : '';
        const fullText = (content || '') + truncationNotice;

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === 'assistant') {
            last.content = fullText;
            last.downloadSources = downloadSources || [];
          }
          return updated;
        });
      } catch (err) {
        console.error('Chat error:', err);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Something went wrong. Please try again.' },
        ]);
      }

      setChatInput('');
      setLoading(false);
    },
    [chatInput, loading, ministryContext, scrollToBottom]
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

  // Reasoning models (e.g. Nemotron) stream a "thinking" phase with no visible content first —
  // keep the thinking indicator up only until the assistant's actual answer text starts arriving.
  const lastMessage = messages[messages.length - 1];
  const isAwaitingResponse =
    loading &&
    (!lastMessage || lastMessage.role !== 'assistant' || lastMessage.content.trim() === '');

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

              {isAwaitingResponse && (
                <div className="thinking">
                  <div>
                    {/* <div className="think_img">
                      <img src={think_img} alt="Think" />
                    </div> */}
                    Eko Smart is thinking
                  </div>
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
