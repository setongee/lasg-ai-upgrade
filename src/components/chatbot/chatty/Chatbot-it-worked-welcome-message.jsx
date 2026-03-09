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

  const LANGUAGES = {
    en: { name: 'English', code: 'en' },
    yo: { name: 'Yorùbá', code: 'yo' },
    ig: { name: 'Igbo (Coming Soon)', code: 'ig' },
    ha: { name: 'Hausa (Coming Soon)', code: 'ha' },
  };

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
    }

    return `
${CONTEXT}

You are assisting a user browsing the "${safePage}" section of the Lagos State Government website.

${
  mdaContext
    ? `**CURRENT MDA CONTEXT:**${mdaContext}`
    : `If this section corresponds to a ministry, interpret it as:
**${ministryInfo ? ministryInfo.name : 'the appropriate Lagos State Ministry or Department'}**
${ministryInfo ? `Official Website: ${ministryInfo.url}` : ''}`
}

🧭 Behavioural Rules:
- Answer questions with verified Lagos-specific details.
- Include official links where applicable.
- Redirect politely if unrelated to Lagos State.
- Use the detailed MDA information above to provide specific, accurate responses about services, contacts, and resources.
${languageInstruction}

📚 Recent Conversation:
${history}
`;
  }, [safePage, ministryInfo, messages, languagePreference, mdaData, currentMda]);

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

  console.log(welcomeSuggestions);

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
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const embeddingResp = await model.embedContent(`${pageContext} ${query}`);
        const embedding = embeddingResp.embedding.values;

        const { data, error } = await supabase.rpc('match_lagos_services', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: 2,
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

        console.log('Current MDA data:', mdaData);
        console.log('Current Mda from store:', currentMda);

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
            console.log('Services fetched:', services);
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
          console.log('MDA Context built:', mdaSpecificContext);
        } else {
          console.log('No MDA data available, using fallback');
          return [];
        }

        const prompt = `You are generating service-focused follow-up questions STRICTLY for ${currentMdaName}. 

Based on this assistant response: "${lastReply.slice(0, 200)}"

AND this MDA context: ${mdaSpecificContext}

Generate 5 service-focused follow-up questions (under 10 words each) separated by double pipes (||).

CRITICAL REQUIREMENTS:
- Questions MUST be about ${currentMdaName} services ONLY
- Focus on HOW to access, apply for, or use services
- Include service names, application processes, contact methods
- DO NOT mention any other MDA or ministry
- Make questions actionable and service-oriented

Service-Focused Examples:
- "How to apply for [specific service]?"
- "[Service name] application requirements?"
- "Contact [service department] directly?"
- "Download [service] application forms?"
- "[Service] processing timeline?"
- "Pay for [service] online?"

Make them unique and specific to this response and ${currentMdaName} services.`;

        console.log('Prompt being sent:', prompt);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log('Raw API response:', responseText);
        const followups = responseText
          .split('||')
          .map((q) => q.trim())
          .filter(Boolean)
          .slice(0, 5);
        console.log('Final follow-ups:', followups);
        return followups;
      } catch (err) {
        console.error('Follow-up generation error:', err);
        return [];
      }
    },
    [mdaData, currentMda]
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

              {followUps.length > 0 && (
                <div className="followups">
                  {followUps.map((q, idx) => (
                    <button key={idx} onClick={() => handleSubmit(q)} className="followup-btn">
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="quickSuggestions">
              {initialSuggestions.length > 0 && messages.length === 1 && (
                <>
                  <p>What can I help you with today?</p>
                  <div className="followups initial-suggestions">
                    {initialSuggestions.map((q, idx) => (
                      <button key={idx} onClick={() => handleSubmit(q)} className="followup-btn">
                        {q}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="input-section">
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
