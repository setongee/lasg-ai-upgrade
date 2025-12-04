import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { ArrowUp, Language, NavArrowDown, Xmark } from 'iconoir-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router';
import remarkGfm from 'remark-gfm';
import { useApp } from '../../stores/app.store';
import { useChatStore } from '../../stores/chat.store';
import {
  extractLgaFromMessage,
  getLgaPrompt,
  needsLocationContext,
} from '../../utils/locationUtils';
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

  const safePage = typeof pageContext === 'string' ? pageContext.toLowerCase() : '';
  const ministryInfo = MINISTRY_CONTEXT_MAP[safePage] || null;

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: ``,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [initialSuggestions, setInitialSuggestions] = useState([]);
  const chatWindowRef = useRef(null);
  const isUserScrolling = useRef(false);
  const [isLocationPrompt, setIsLocationPrompt] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const setSuggestions = useApp((state) => state.setSuggestions);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [languagePreference, setLanguagePreference] = useState('en');

  const LANGUAGES = {
    en: { name: 'English', code: 'en' },
    yo: { name: 'Yorùbá', code: 'yo' },
    ig: { name: 'Igbo (Coming Soon)', code: 'ig' },
    ha: { name: 'Hausa (Coming Soon)', code: 'ha' },
  };

  console.log(languagePreference);

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

    return `
${CONTEXT}

You are assisting a user browsing the "${safePage}" section of the Lagos State Government website.

If this section corresponds to a ministry, interpret it as:
**${ministryInfo ? ministryInfo.name : 'the appropriate Lagos State Ministry or Department'}**
${ministryInfo ? `Official Website: ${ministryInfo.url}` : ''}

🧭 Behavioural Rules:
- Answer questions with verified Lagos-specific details.
- Include official links where applicable.
- Redirect politely if unrelated to Lagos State.
${languageInstruction}

📘 Ministry Context:
${ministryInfo ? `${ministryInfo.name} (${ministryInfo.url})` : 'Automatically infer'}

📚 Recent Conversation:
${history}
`;
  }, [safePage, ministryInfo, messages, languagePreference]);

  useEffect(() => {
    if (chatSessionRef.current) {
      chatSessionRef.current = null;
      initializeChatSession();
    }
  }, [languagePreference]);

  // ---- Initialize chat session ONCE ----
  const initializeChatSession = useCallback(async () => {
    if (!chatSessionRef.current) {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
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

  useEffect(() => {
    if (checkIsChatOpen) {
      scrollToBottom();
      document.body.style.overflow = 'hidden';
      initializeChatSession();
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

      const prompt = `Generate 6 short Lagos citizen questions (under 10 words) about "${contextName}". ${timeContext} Format: question1||question2||question3||question4||question5||question6`;

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
  const generateFollowUps = useCallback(async (lastReply, sender) => {
    if (sender !== 'assistant') return [];
    const cacheKey = `followup_${lastReply.slice(0, 50)}`;
    const cached = suggestionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) return cached.data;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      const prompt = `Based on: "${lastReply.slice(
        0,
        200
      )}" Generate 3 short user follow-up questions (under 10 words each) separated by double pipes (||)`;
      const result = await model.generateContent(prompt);
      const followups = result.response
        .text()
        .split('||')
        .map((q) => q.trim())
        .filter(Boolean)
        .slice(0, 3);
      suggestionCache.set(cacheKey, { data: followups, timestamp: Date.now() });
      return followups;
    } catch (err) {
      console.error('Follow-up generation error:', err);
      return [];
    }
  }, []);

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

        if (messages.length % 3 === 0) {
          const followUpQs = await generateFollowUps(assistantText, 'assistant');
          setFollowUps(followUpQs);
        }
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

  return (
    <>
      <div className="bubblePage" onClick={() => setCheckIsChatOpen(true)}>
        <img src={think_img} alt="" />
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
              Lagos State Services Assistant (Seth)
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
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
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
                    Seth is thinking
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
              disabled={loading}
              value={loading ? '' : chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Seth about Lagos State services..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <div className="language-preference flex items-center gap-[6px]">
              <div>
                <Language className="text-[12px]" />
              </div>
              <p className="font-medium">English</p>
              <div>
                <NavArrowDown className="text-[12px]" />
              </div>
            </div>
            {loading ? (
              <button disabled className="stop-btn">
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
