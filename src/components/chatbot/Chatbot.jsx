import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { ArrowUp, Language, NavArrowDown, Xmark } from 'iconoir-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router';
import remarkGfm from 'remark-gfm';
import { getAllServicesCategory } from '../../api/read/services.req';
import { formattedName } from '../../pages/MDAs/api/admin/logic';
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

const Chatbot = ({ pageContext }) => {
  // start of chat store
  const checkIsChatOpen = useChatStore((state) => state.checkIsChatOpen);
  const setCheckIsChatOpen = useChatStore((state) => state.setCheckIsChatOpen);
  const ChatStoreMessage = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  // end of chat store

  // MDA data from theme store
  const mdaData = useThemeStore((state) => state.mdaData);
  const currentMda = useThemeStore((state) => state.mda);

  const safePage = typeof pageContext === 'string' ? pageContext.toLowerCase() : '';
  const ministryInfo = MINISTRY_CONTEXT_MAP[safePage] || null;

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm here to help you access services quickly and easily.

What service would you like to access today?`,
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

  // General Lagos State Information
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

  // ---- Functions to fetch General Lagos State Information ----
  const fetchExecutiveCouncil = useCallback(async () => {
    try {
      const members = await getAllMembers();
      if (members && members.length > 0) {
        // Format to only include name and position (excluding email and phone)
        const formattedMembers = members.map((member) => ({
          name: member.name || 'N/A',
          position: member.position || member.title || member.role || 'N/A',
        }));
        setExecutiveCouncil(formattedMembers);
      }
    } catch (err) {
      console.error('Error fetching executive council:', err);
    }
  }, []);

  const fetchAllServices = useCallback(async () => {
    try {
      const services = await getAllServices();
      if (services && services.data) {
        setAllServices(services.data);
      }
    } catch (err) {
      console.error('Error fetching all services:', err);
    }
  }, []);

  const fetchAllMdas = useCallback(async () => {
    try {
      const mdas = await getAllMdas();
      if (mdas && mdas.length > 0) {
        setAllMdas(mdas);
      }
    } catch (err) {
      console.error('Error fetching all MDAs:', err);
    }
  }, []);

  // Fetch general information when on main page (not MDA specific)
  useEffect(() => {
    const isGeneralPage = !pageContext || pageContext.trim() === 'general' || pageContext === '';
    if (isGeneralPage) {
      fetchExecutiveCouncil();
      fetchAllServices();
      fetchAllMdas();
    }
  }, [pageContext, fetchExecutiveCouncil, fetchAllServices, fetchAllMdas]);

  // ---- Single chat session per lifecycle ----
  const chatSessionRef = useRef(null);
  const location = useLocation();

  // ---- Memoized ministry context ----
  const ministryContext = useMemo(() => {
    const history = messages
      .slice(-6)
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const languageInstruction =
      languagePreference !== 'en'
        ? `\n\n🌍 CRITICAL LANGUAGE REQUIREMENT:\nYou MUST respond EXCLUSIVELY in ${LANGUAGES[languagePreference].name} language, regardless of what language the user writes in. Even if the user writes in English, you must respond in ${LANGUAGES[languagePreference].name}. This is a strict requirement.`
        : '';

    // Build rich MDA context if available
    let mdaContext = '';
    let generalLagosContext = '';

    if (mdaData && Object.keys(mdaData).length > 0) {
      mdaContext = `
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
              .join('\n')
          : 'No social media available'
      }

**People/Leadership:**
${
  mdaData.people
    ? mdaData.people
        .map((person) => `- ${person.name || 'N/A'} (${person.role || 'Position not specified'})`)
        .join('\n')
    : '- No people information available'
}

**Agencies & Departments:**
${
  mdaData.agencies
    ? mdaData.agencies
        .map((agency) => `- ${agency.name || 'Agency name'} (${agency.category || 'department'})`)
        .join('\n')
    : '- No agencies information available'
}

**Resources:**
${
  mdaData.resources
    ? mdaData.resources
        .map(
          (resource) =>
            `- ${resource.name || 'Resource title'}: Download available at ${resource.url || 'No URL available'}`
        )
        .join('\n')
    : '- No resources information available'
}

**Statistics:**
${
  mdaData.statistics
    ? Object.entries(mdaData.statistics)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n')
    : '- No statistics available'
}
`;
    } else {
      // Build general Lagos State context when not on MDA page
      const isGeneralPage = !pageContext || pageContext.trim() === 'general' || pageContext === '';

      if (isGeneralPage) {
        generalLagosContext = `
🏛️ **LAGOS STATE GOVERNMENT INFORMATION:**

**Executive Council:**
${
  executiveCouncil.length > 0
    ? executiveCouncil
        .slice(0, 10) // Limit to top 10 for context
        .map((member) => `- ${member.name} (${member.position})`)
        .join('\n')
    : '- Executive council information being loaded...'
}

**Available Services:**
${
  allServices.length > 0
    ? allServices
        .slice(0, 15) // Limit to top 15 services for context
        .map((service) => `- ${service.name || service.title}`)
        .join('\n')
    : '- Services information being loaded...'
}

**Government Agencies (MDAs):**
${
  allMdas.length > 0
    ? allMdas
        .slice(0, 12) // Limit to top 12 MDAs for context
        .map((mda) => `- ${mda.name}`)
        .join('\n')
    : '- MDAs information being loaded...'
}

**Key Service Categories:**
- Healthcare Services (ILERA EKO, LASHMA)
- Business & Economy (LIRS, LSETF, LASRIC)
- Transportation (LAMATA, LASTMA)
- Education & Youth Development
- Environment & Waste Management (LAWMA, LASEPA)
- Security & Emergency Services
- Housing & Urban Development
- Tourism & Culture

**Official Government Portal:** https://lagosstate.gov.ng
`;
      }
    }

    return `
${CONTEXT}

You are assisting a user browsing the "${safePage}" section of the Lagos State Government website.

${
  mdaContext
    ? `**CURRENT MDA CONTEXT:**${mdaContext}`
    : generalLagosContext
      ? `**GENERAL LAGOS STATE CONTEXT:**${generalLagosContext}`
      : `If this section corresponds to a ministry, interpret it as:
**${ministryInfo ? ministryInfo.name : 'the appropriate Lagos State Ministry or Department'}**
${ministryInfo ? `Official Website: ${ministryInfo.url}` : ''}`
}

🧭 Behavioural Rules:
- Answer questions with verified Lagos-specific details.
- Include official links where applicable.
- Redirect politely if unrelated to Lagos State.
- Use the detailed information above to provide specific, accurate responses about services, contacts, and resources.
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
    executiveCouncil,
    allServices,
    allMdas,
    pageContext,
  ]);

  useEffect(() => {
    if (chatSessionRef.current) {
      chatSessionRef.current = null;
      initializeChatSession();
    }
  }, [languagePreference, setLanguagePreference]);

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

  welcomeSuggestions;

  // Simple time-based greeting and citizen suggestions
  useEffect(() => {
    const generateWelcomeContent = async () => {
      if (mdaData?.fullname) {
        try {
          // Get time-based greeting
          const hour = new Date().getHours();
          let greeting = 'Hello';
          if (hour < 12) greeting = 'Good morning';
          else if (hour < 17) greeting = 'Good afternoon';
          else greeting = 'Good evening';

          // Get services for suggestions
          const servicesData = await getAllServicesCategory(formattedName(mdaData.fullname));
          const services = servicesData?.data || [];
          setMdaServices(services);

          // Generate 10 intelligent citizen suggestions based on MDA's core actions
          const suggestions = [];

          // Add 4-5 services if available
          if (services.length > 0) {
            const shuffledServices = [...services].sort(() => Math.random() - 0.5);
            shuffledServices.slice(0, 5).forEach((service) => {
              suggestions.push(`How to access ${service.name}?`);
            });
          }

          // Generate intelligent questions based on MDA's core purpose and data
          const intelligentQuestions = [];

          // Leadership and governance questions
          if (mdaData.people?.leadership) {
            intelligentQuestions.push(
              `Who is the current ${mdaData.people.leadership[0]?.title || 'head'} of ${mdaData.fullname}?`
            );
            intelligentQuestions.push(
              `How can I schedule a meeting with ${mdaData.people.leadership[0]?.title || 'leadership'}?`
            );
          }
          if (mdaData.people?.departments) {
            intelligentQuestions.push(
              `Which department handles ${mdaData.people.departments[0]?.responsibilities?.[0] || 'citizen services'}?`
            );
          }

          // Service and program questions based on MDA type
          const ministryName = mdaData.fullname?.toLowerCase() || '';
          if (ministryName.includes('health')) {
            intelligentQuestions.push(
              `What health programs are currently available for citizens?`,
              `How do I get medical assistance or health insurance?`,
              `Where can I find vaccination centers near me?`,
              `What are the requirements for health facility registration?`
            );
          } else if (ministryName.includes('education')) {
            intelligentQuestions.push(
              `How do I apply for scholarships or educational grants?`,
              `What schools are under your jurisdiction?`,
              `How can I access educational resources for my children?`,
              `What teacher certification programs do you offer?`
            );
          } else if (ministryName.includes('transport')) {
            intelligentQuestions.push(
              `How do I apply for driver's licenses or vehicle permits?`,
              `What public transportation options are available?`,
              `How can I report road safety issues?`,
              `Where can I find information about road projects?`
            );
          } else if (
            ministryName.includes('finance') ||
            ministryName.includes('budget') ||
            ministryName.includes('economic')
          ) {
            intelligentQuestions.push(
              `How can I access budget information and financial reports?`,
              `What economic development programs are available?`,
              `How do I apply for business grants or funding?`,
              `Where can I find tax information and payment options?`
            );
          } else if (ministryName.includes('technology') || ministryName.includes('innovation')) {
            intelligentQuestions.push(
              `What technology initiatives are currently running?`,
              `How can I participate in innovation programs?`,
              `Where can I access digital services and platforms?`,
              `What tech training opportunities are available?`
            );
          } else {
            // Generic questions for other ministries
            intelligentQuestions.push(
              `What are the main services provided to citizens?`,
              `How can I participate in community programs?`,
              `What public facilities are available for citizens?`,
              `How do I file complaints or provide feedback?`
            );
          }

          // Contact and location questions
          if (mdaData.contact?.address) {
            intelligentQuestions.push(`What are your office hours and location?`);
          }
          if (mdaData.contact?.phone || mdaData.contact?.email) {
            intelligentQuestions.push(`What's the best way to reach you for urgent matters?`);
          }

          // Add recent/trending questions
          intelligentQuestions.push(
            `What new initiatives or programs have been launched recently?`,
            `How is ${mdaData.fullname} serving the community this year?`,
            `What achievements has ${mdaData.fullname} accomplished recently?`
          );

          // Fill remaining slots with intelligent questions
          const remainingSlots = 10 - suggestions.length;
          const shuffledQuestions = [...intelligentQuestions].sort(() => Math.random() - 0.5);
          shuffledQuestions.slice(0, remainingSlots).forEach((question) => {
            suggestions.push(question);
          });

          // Shuffle all suggestions and take exactly 10
          const finalSuggestions = [...suggestions].sort(() => Math.random() - 0.5).slice(0, 10);

          setWelcomeSuggestions(finalSuggestions);

          // Set simple greeting message
          setMessages([
            {
              role: 'assistant',
              content: `${greeting}! Welcome to ${mdaData.fullname}. How can I help you today?`,
            },
          ]);
        } catch (err) {
          console.error('Could not generate welcome content:', err);
          // Fallback greeting
          const hour = new Date().getHours();
          let greeting = 'Hello';
          if (hour < 12) greeting = 'Good morning';
          else if (hour < 17) greeting = 'Good afternoon';
          else greeting = 'Good evening';

          setWelcomeSuggestions([
            `How can I help you today?`,
            `What services are available?`,
            `Tell me about ${mdaData.fullname}`,
            `How can I contact ${mdaData.fullname}?`,
            `What programs do you offer?`,
            `Where are you located?`,
            `Who leads ${mdaData.fullname}?`,
            `What departments exist in ${mdaData.fullname}?`,
            `Can I visit ${mdaData.fullname}?`,
            `What are the office hours?`,
          ]);

          setMessages([
            {
              role: 'assistant',
              content: `${greeting}! Welcome to ${mdaData.fullname}. How can I help you today?`,
            },
          ]);
        }
      }
    };

    generateWelcomeContent();
  }, [mdaData?.fullname]);

  // General Lagos State welcome content generation
  useEffect(() => {
    const generateGeneralWelcomeContent = async () => {
      const isGeneralPage = !pageContext || pageContext.trim() === 'general' || pageContext === '';

      if (isGeneralPage && !mdaData?.fullname) {
        try {
          // Get time-based greeting
          const hour = new Date().getHours();
          let greeting = 'Hello';
          if (hour < 12) greeting = 'Good morning';
          else if (hour < 17) greeting = 'Good afternoon';
          else greeting = 'Good evening';

          // Generate 10 intelligent suggestions for general Lagos State
          const suggestions = [];

          // Executive Council suggestions
          if (executiveCouncil.length > 0) {
            suggestions.push('Who leads Lagos State Executive Council?');
            suggestions.push('Tell me about the state leadership');
          }

          // Services suggestions
          if (allServices.length > 0) {
            const shuffledServices = [...allServices].sort(() => Math.random() - 0.5);
            shuffledServices.slice(0, 4).forEach((service) => {
              suggestions.push(`How to access ${service.name || service.title}?`);
            });
          }

          // MDA exploration suggestions
          if (allMdas.length > 0) {
            suggestions.push('Which government agency handles my needs?');
            suggestions.push('Explore Lagos State MDAs');
          }

          // General service categories
          const categorySuggestions = [
            'What healthcare services are available?',
            'How do I start a business in Lagos?',
            'What transportation options exist?',
            'How can I pay my taxes?',
            'Where can I get educational support?',
            'What emergency services are available?',
          ];

          const shuffledCategories = [...categorySuggestions].sort(() => Math.random() - 0.5);
          shuffledCategories.slice(0, 3).forEach((suggestion) => {
            suggestions.push(suggestion);
          });

          // Fill remaining slots with general Lagos State questions
          const generalQuestions = [
            'How do I contact Lagos State Government?',
            'What are the working hours of government offices?',
            'Where can I find official government forms?',
            'How do I report issues to the government?',
            'What digital services are available?',
          ];

          const remainingSlots = 10 - suggestions.length;
          const shuffledGeneral = [...generalQuestions].sort(() => Math.random() - 0.5);
          shuffledGeneral.slice(0, remainingSlots).forEach((question) => {
            suggestions.push(question);
          });

          // Shuffle all suggestions and take exactly 10
          const finalSuggestions = [...suggestions].sort(() => Math.random() - 0.5).slice(0, 10);

          setWelcomeSuggestions(finalSuggestions);

          // Set general greeting message
          setMessages([
            {
              role: 'assistant',
              content: `${greeting}! Welcome to Lagos State Government. How can I help you access government services today?`,
            },
          ]);
        } catch (err) {
          console.error('Could not generate general welcome content:', err);
          // Fallback greeting
          const hour = new Date().getHours();
          let greeting = 'Hello';
          if (hour < 12) greeting = 'Good morning';
          else if (hour < 17) greeting = 'Good afternoon';
          else greeting = 'Good evening';

          setWelcomeSuggestions([
            'How can I help you today?',
            'What government services are available?',
            'Tell me about Lagos State Government',
            'How can I contact government offices?',
            'What programs do you offer?',
            'Where are government offices located?',
            'Who leads Lagos State?',
            'What departments exist in the government?',
            'Can I visit government offices?',
            'What are the office hours?',
          ]);

          setMessages([
            {
              role: 'assistant',
              content: `${greeting}! Welcome to Lagos State Government. How can I help you today?`,
            },
          ]);
        }
      }
    };

    generateGeneralWelcomeContent();
  }, [pageContext, mdaData?.fullname, executiveCouncil, allServices, allMdas]);

  useEffect(() => {
    if (checkIsChatOpen) {
      scrollToBottom();
      document.body.style.overflow = 'hidden';
      initializeChatSession();
      // Auto-focus input when chat opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else document.body.style.overflow = 'auto';
  }, [checkIsChatOpen]);

  // check from store
  useEffect(() => {
    if (ChatStoreMessage !== '') {
      handleSubmit(ChatStoreMessage);
    }
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

  // Refocus input after messages are updated
  useEffect(() => {
    if (checkIsChatOpen && !loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, loading, checkIsChatOpen]);

  // Scroll last user message to near the top
  useEffect(() => {
    const allUserMessages = document.querySelectorAll('.user-msg');
    allUserMessages.forEach((msg) => msg.classList.remove('last-user-msg'));

    if (allUserMessages.length > 0 && chatWindowRef.current) {
      const lastUserMessage = allUserMessages[allUserMessages.length - 1];
      lastUserMessage.classList.add('last-user-msg');

      // Scroll the last user message to near the top
      setTimeout(() => {
        const messagePosition = lastUserMessage.offsetTop;
        const offset = 80; // Distance from top (adjust as needed)

        chatWindowRef.current.scrollTo({
          top: messagePosition - offset,
          behavior: 'smooth',
        });
      }, 50); // Small delay to ensure DOM is updated
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
      const now = new Date();
      const hour = now.getHours();
      const day = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

      let timeContext = '';
      if (
        !pageContext ||
        pageContext.trim() === 'general' ||
        contextName === 'Lagos State Official Website'
      ) {
        if (hour >= 5 && hour < 12)
          timeContext = 'Morning — Lagos State services, permits, find a particular ministry, etc.';
        else if (hour >= 12 && hour < 17)
          timeContext =
            'Afternoon — Lagos State services, permits, find a particular ministry, etc.';
        else if (hour >= 17 && hour < 22)
          timeContext =
            'Evening — Lagos State emergencies, commute services like lagride, ferry, brt, rail lines, etc. 24-hour services, police numbers, health services, plan a visit to a ministry for the next day.';
        else
          timeContext =
            'Late Night — emergencies, 24-hour services, police numbers, health services';
      }

      const prompt = `Generate 6 service-focused questions (under 10 words) about accessing services from "${contextName}". ${timeContext} 

Focus on practical service access questions like:
- How to register/pay for services
- Application processes and requirements
- Contact information and locations
- Document downloads and applications
- Service eligibility and timelines

Format: question1||question2||question3||question4||question5||question6`;

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
  }, [pageContext, ministryInfo, safePage, messages.length]);

  // ---- Retrieve relevant context from Supabase ----
  const getRelevantLagosContext = useCallback(
    async (query) => {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
        const embeddingResp = await model.embedContent(`${pageContext} ${query}`);
        const embedding = embeddingResp.embedding.values;

        const { data, error } = await supabase.rpc('match_lagos_services', {
          query_embedding: embedding,
          match_threshold: 0.5,
          match_count: 4,
        });

        if (error || !data || data.length === 0) return '';

        return data
          .map((d) => `🏛️ **${d.name}**: ${d.short || ''} [Visit](${d.url || '#'})`)
          .join('\n');
      } catch (err) {
        console.error('Error retrieving context:', err);
        return '';
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

        // Build MDA-specific context for follow-ups
        let mdaSpecificContext = '';
        let currentMdaName = '';
        let isGeneralPage = false;

        ('Current MDA data:', mdaData);
        ('Current Mda from store:', currentMda);

        if (mdaData && Object.keys(mdaData).length > 0) {
          currentMdaName = mdaData.fullname || mdaData.name || currentMda;

          // Get services from API
          let services = [];
          try {
            const servicesData = await getAllServicesCategory(formattedName(mdaData.fullname));
            services =
              servicesData?.data
                ?.map((s) => s.name)
                .filter(Boolean)
                .slice(0, 5) || [];
            ('Services fetched:', services);
          } catch (err) {
            console.error('Could not fetch services:', err);
          }

          const people = mdaData.people
            ? mdaData.people
                .map((p) => p.role)
                .filter(Boolean)
                .slice(0, 3)
            : [];

          const agencies = mdaData.agencies
            ? mdaData.agencies
                .map((a) => a.name)
                .filter(Boolean)
                .slice(0, 3)
            : [];

          const resources = mdaData.resources
            ? mdaData.resources
                .map((r) => r.name)
                .filter(Boolean)
                .slice(0, 3)
            : [];

          mdaSpecificContext = `
CURRENT MDA: ${currentMdaName}
Available Services: ${services.length > 0 ? services.join(', ') : 'various government services'}
Key Leadership: ${people.length > 0 ? people.join(', ') : 'commissioner and directors'}
Departments: ${agencies.length > 0 ? agencies.join(', ') : 'multiple departments'}
Resources: ${resources.length > 0 ? resources.join(', ') : 'various resources'}
Contact: ${mdaData.contact?.email ? 'email available' : 'contact information available'}
`;
          ('MDA Context built:', mdaSpecificContext);
        } else {
          // Check if this is a general Lagos State page
          isGeneralPage = !pageContext || pageContext.trim() === 'general' || pageContext === '';

          if (isGeneralPage) {
            currentMdaName = 'Lagos State Government';

            // Use the general state information
            const services =
              allServices.length > 0
                ? allServices
                    .slice(0, 8)
                    .map((s) => s.name || s.title)
                    .filter(Boolean)
                : [
                    'healthcare',
                    'business registration',
                    'tax payment',
                    'transportation',
                    'education',
                  ];

            const leadership =
              executiveCouncil.length > 0
                ? executiveCouncil.slice(0, 3).map((m) => `${m.name} (${m.position})`)
                : ['Governor', 'Deputy Governor', 'Commissioners'];

            const mdas =
              allMdas.length > 0
                ? allMdas
                    .slice(0, 6)
                    .map((m) => m.name)
                    .filter(Boolean)
                : ['Ministry of Health', 'Ministry of Education', 'Ministry of Transportation'];

            mdaSpecificContext = `
CURRENT CONTEXT: Lagos State Government
Available Services: ${services.join(', ')}
Executive Council: ${leadership.join(', ')}
Key Agencies: ${mdas.join(', ')}
Service Categories: Healthcare, Business & Economy, Transportation, Education, Environment, Security
Official Portal: lagosstate.gov.ng
`;
            ('General Lagos State Context built:', mdaSpecificContext);
          } else {
            ('No MDA data available, using fallback');
            return [];
          }
        }

        const prompt = `You are generating service-focused follow-up questions for ${currentMdaName}. 

Based on this assistant response: "${lastReply.slice(0, 200)}"

AND this context: ${mdaSpecificContext}

Generate 5 service-focused follow-up questions (under 10 words each) separated by double pipes (||).

CRITICAL REQUIREMENTS:
${
  isGeneralPage
    ? `- Questions MUST be about Lagos State Government services and agencies
- Focus on HOW to access, apply for, or use ANY Lagos State service
- Include service names, application processes, contact methods for any state agency
- Cover different service categories: healthcare, business, transportation, education, etc.
- Make questions actionable and service-oriented for Lagos State generally`
    : `- Questions MUST be about ${currentMdaName} services ONLY
- Focus on HOW to access, apply for, or use services
- Include service names, application processes, contact methods
- DO NOT mention any other MDA or ministry
- Make questions actionable and service-oriented`
}

Service-Focused Examples:
${
  isGeneralPage
    ? `- "How to apply for Lagos State health insurance?"
- "Business registration requirements in Lagos?"
- "Pay Lagos State taxes online?"
- "Transportation services available?"
- "Educational support programs?"
- "Emergency contact numbers?"
- "Where to get government forms?"`
    : `- "How to apply for [specific service]?"
- "[Service name] application requirements?"
- "Contact [service department] directly?"
- "Download [service] application forms?"
- "[Service] processing timeline?"
- "Pay for [service] online?"`
}

Make them unique and specific to this response and ${isGeneralPage ? 'Lagos State Government services' : currentMdaName + ' services'}.`;

        ('Prompt being sent:', prompt);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        ('Raw API response:', responseText);
        const followups = responseText
          .split('||')
          .map((q) => q.trim())
          .filter(Boolean)
          .slice(0, 5);
        ('Final follow-ups:', followups);
        return followups;
      } catch (err) {
        console.error('Follow-up generation error:', err);
        return [];
      }
    },
    [mdaData, currentMda, pageContext, executiveCouncil, allServices, allMdas]
  );

  // ---- Location detection ----
  const detectNeedsLocation = useCallback((message) => {
    const locationKeywords = ['near', 'closest', 'nearby', 'around', 'in my area', 'location'];
    return locationKeywords.some((keyword) => message.toLowerCase().includes(keyword));
  }, []);

  // ---- Main handleSubmit ----
  const handleSubmit = useCallback(
    async (customInput) => {
      const input = customInput || chatInput;
      if (input.trim() === '' || loading) return;

      setLoading(true);
      setFollowUps([]);
      setIsStreaming(true);

      const userMsg = { role: 'user', content: input };
      setMessages((prev) => [...prev, userMsg]);
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

      const assessConfidenceChunk = (text) => {
        const uncertainKeywords = [
          'not sure',
          "i don't have",
          'i need to check',
          'cannot verify',
          'unknown',
          'i am unsure',
        ];
        const lowerText = text.toLowerCase();
        let count = 0;
        uncertainKeywords.forEach((kw) => {
          if (lowerText.includes(kw)) count++;
        });
        return 1 - count / uncertainKeywords.length;
      };

      const fetchGoogleFallback = async (query) => {
        try {
          const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
          const prompt = `Provide verified Lagos State info (official sites only) for: "${query}" in under 100 words.`;
          const result = await model.generateContent(prompt);
          return result.response.text();
        } catch (err) {
          console.error('Google fallback error:', err);
          return '';
        }
      };

      try {
        await initializeChatSession();

        const lagosContext = await getRelevantLagosContext(finalInput);
        const contextualPrompt = lagosContext
          ? `Relevant Lagos Services:\n${lagosContext}\n\nUser Question: ${finalInput}`
          : finalInput;

        let assistantText = '';
        let fallbackTriggered = false;

        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        const result = await chatSessionRef.current.sendMessageStream(contextualPrompt);

        for await (const chunk of result.stream) {
          const textPart = chunk.text();
          if (!textPart) continue;

          assistantText += textPart;
          const confidence = assessConfidenceChunk(textPart);

          if (!fallbackTriggered && confidence < 0.6) {
            fallbackTriggered = true;
            const snippet = await fetchGoogleFallback(input);
            if (snippet) assistantText += `\n\n🔎 Latest info from Lagos State sites:\n${snippet}`;
          }

          setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg.role === 'assistant') lastMsg.content = assistantText;
            return updated;
          });
        }

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

  // Custom component for clickable services
  const ClickableService = ({ children }) => {
    const serviceName =
      typeof children === 'string' ? children : children?.props?.children || children;

    const handleServiceClick = () => {
      // Send the service name as a user message
      handleSubmit(serviceName);
    };

    return (
      <span
        onClick={handleServiceClick}
        style={{
          cursor: 'pointer',
          color: '#28a745',
          textDecoration: 'underline',
          fontWeight: 'bold',
        }}
        title={`Click to ask: ${serviceName}`}
      >
        {serviceName}
      </span>
    );
  };

  // Custom markdown components
  const markdownComponents = useMemo(
    () => ({
      strong: ({ children, ...props }) => {
        const text =
          typeof children === 'string' ? children : children?.props?.children || children;

        // Check if this is a service name, trending service, popular topic, or question
        const isService = mdaServices.some((service) => text.includes(service.name));
        const isQuestion =
          text.includes('How to') ||
          text.includes('Tell me about') ||
          text.includes('Do you want to') ||
          text.includes('Who are') ||
          text.includes('What departments') ||
          text.includes('How can I') ||
          text.includes('Do you want to book');

        if (isService || isQuestion) {
          return <ClickableService>{text}</ClickableService>;
        }

        return <strong {...props}>{children}</strong>;
      },
    }),
    [mdaServices]
  );

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
                    <div className={`markdown-body`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="thinking">
                  <p>
                    <div className="think_img">
                      <img src={think_img} alt="Think Image" />
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

              {showLanguageMenu ? (
                <LanguageModal
                  closeModal={() => setShowLanguageMenu(false)}
                  language={languagePreference}
                  setLanguage={setLanguagePreference}
                  setShowLanguageMenu={setShowLanguageMenu}
                  LANGUAGES={LANGUAGES}
                  customClass="main-lang"
                />
              ) : null}
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
