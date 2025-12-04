import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { ArrowDown } from 'iconoir-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getTimeOfDayGreeting } from '../../../utils/greeting';
import {
  extractLgaFromMessage,
  getLgaPrompt,
  needsLocationContext,
} from '../../../utils/locationUtils';
import { CONTEXT } from '../context';
import './chatbot.css';
import think_img from './comment.png';
import sendIcon from './sendIcon.png';
import stopIcon from './stop.png';

// ---- Safe Ministry Context Setup ----
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

// ---- Gemini ----
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// ---- Supabase ----
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

// ---- Chat config ----
const groundingTool = { googleSearch: {} };
const config = { tools: [groundingTool] };

const Chatbot = ({ pageContext }) => {
  const safePage = typeof pageContext === 'string' ? pageContext.toLowerCase() : '';
  const ministryInfo = MINISTRY_CONTEXT_MAP[safePage] || null;

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! ${getTimeOfDayGreeting()} I'm Seth, your AI assistant from the Lagos State Ministry of Information, Science and Technology. How can I help you with Lagos State Government services and information today?`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [initialSuggestions, setInitialSuggestions] = useState([]);
  const chatRef = useRef(null);
  const chatWindowRef = useRef(null);
  const responseBuffer = useRef('');
  const isUserScrolling = useRef(false);

  const [isLocationPrompt, setIsLocationPrompt] = useState(null);

  // ---- Scroll behavior ----
  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.style.paddingBottom = '20px';
      chatWindowRef.current.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

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
    const contextName = ministryInfo?.name || pageContext || 'Lagos State Government';
    const isGeneralContext =
      !pageContext ||
      pageContext.trim() === 'general' ||
      contextName === 'Lagos State Official Website';

    const now = new Date();
    const hour = now.getHours();
    const day = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

    let timeContext = '';
    let dayContext = '';

    if (isGeneralContext) {
      // only include time/day sensitivity for general context
      if (hour >= 5 && hour < 12) {
        timeContext =
          'Morning — include food, transport routes, daily commute, public service announcements, and early errands.';
      } else if (hour >= 12 && hour < 17) {
        timeContext =
          'Afternoon — include restaurants, lunch deliveries, traffic updates, office hours, and errands.';
      } else if (hour >= 17 && hour < 22) {
        timeContext =
          'Evening — include safety, emergencies, relaxation, traffic alerts, nightlife, and security tips.';
      } else {
        timeContext =
          'Late Night — include emergencies, police hotlines, 24-hour hospitals, and night-time safety.';
      }

      if (['friday', 'saturday', 'sunday'].includes(day)) {
        dayContext =
          'Weekend — include events, parks, entertainment, beaches, fun spots, and family activities.';
      }
    }

    const prompt = `
You are an AI assistant for the Lagos State Government citizen platform.

Generate 10 short, human-like, and clickable questions Lagos citizens might ask
about services related to "${contextName}" right now.

Each question should:
- Be realistic, action-driven, and natural to Lagos residents
- Stay under 12 words
- Be separated by double pipes (||)
- Mix government service topics (taxes, jobs, health, safety) with relevant daily-life or civic questions.

${
  isGeneralContext
    ? `
Time of day: ${now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
Day of week: ${day.charAt(0).toUpperCase() + day.slice(1)}
Time-based hints: ${timeContext}
Day-based hints: ${dayContext}
`
    : `
Focus strictly on questions relevant to ${contextName}, such as:
- Key services, permits, programs, or initiatives from that ministry
- How citizens can access or apply for them
- Ongoing reforms, news, or leadership information
- Related Lagos State agencies or parastatals
`
}

Examples of good questions:
- How can I renew my driver’s license?
- What are Lagos tax payment options?
- Are there government loans for small businesses?
- What hospitals are open tonight?
- What’s the latest Lagos traffic update?
- What events are happening this weekend?
- How can I apply for a housing scheme?
- What are the governor’s recent initiatives?

Now generate 10 relevant and realistic questions for Lagos citizens.
Respond ONLY with the questions separated by || and nothing else.
`;
    async function generateInitialSuggestions() {
      if (messages.length !== 1) return; // Only for fresh chat

      try {
        // Use your existing Gemini follow-up function
        const suggestions = await generateNewChatSuggestions(prompt, 10);
        setInitialSuggestions(suggestions);
      } catch (err) {
        console.error('Error generating initial service suggestions:', err);
      }
    }

    generateInitialSuggestions();
  }, [pageContext, messages]);

  // ---- Retrieve relevant Lagos services using embeddings ----
  async function getRelevantLagosContext(query) {
    try {
      const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const embeddingResp = await model.embedContent(`${pageContext} ${query}`);
      const embedding = embeddingResp.embedding.values;

      const { data, error } = await supabase.rpc('match_lagos_services', {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 3,
        category_filter: pageContext,
      });

      if (error) {
        console.error('Supabase search error:', error);
        return `I’m having trouble finding ${pageContext} information in Lagos State right now.`;
      }

      if (!data || data.length === 0) {
        return `I couldn’t find any ${pageContext}-related Lagos State service for your question.`;
      }

      return data
        .map(
          (d) => `
🏛️ **${d.name}**  
${d.short || ''}  
🔗 [Visit Site](${d.url || '#'})  
${d.content || ''}  
*(Relevance: ${(d.similarity * 100).toFixed(1)}%)*`
        )
        .join('\n\n');
    } catch (err) {
      console.error('Error retrieving Lagos context:', err);
      return '';
    }
  }

  // new chat suggestions
  async function generateNewChatSuggestions(prompt, size) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
      const result = await model.generateContent(
        `${prompt} **Formatting:** Output only the ${size} follow-ups separated by double pipes (||). No explanations.`
      );
      const text = result.response.text();

      return text
        .split('||')
        .map((q) => q.trim())
        .filter(Boolean);
    } catch (err) {
      console.error('Follow-up generation error:', err);
      return [];
    }
  }

  // ---- Smart adaptive follow-up generator ----
  async function generateFollowUps(lastReply, sender, size) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

      // Automatically infer the next speaker
      const nextRole = sender.toLowerCase() === 'assistant' ? 'user' : 'assistant';

      const prompt = `
You are a conversational AI generator that produces ${size} short, natural, context-aware follow-up messages.

The most recent message came from: **${sender.toUpperCase()}**
The next speaker should be: **${nextRole.toUpperCase()}**

Last message content:
"${lastReply}"

=== RULES ===
1. **If next speaker = USER:**
   - Generate ${size} short, natural replies the user might tap or type next.
   - They should sound like *user responses*, not questions directed at the assistant.
   - Examples: “Yes, show me how”, “Tell me more”, “Where can I apply?”
   - Keep them under 12 words each.

2. **If next speaker = ASSISTANT:**
   - Generate ${size} conversational questions or nudges the assistant could ask next.
   - Example: “Would you like me to guide you?”, “Have you used it before?”
   - Avoid formal or robotic phrasing.
   - Keep them under 15 words each.

3. **Tone:** Always friendly, fluid, and contextual.
4. **Formatting:** Output only the ${size} follow-ups separated by double pipes (||). No explanations.

Now generate the ${size} follow-up messages.
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return text
        .split('||')
        .map((q) => q.trim())
        .filter(Boolean);
    } catch (err) {
      console.error('Follow-up generation error:', err);
      return [];
    }
  }

  async function detectNeedsLocationAI(message) {
    const prompt = `
    You are a classification model. 
    Does this message require knowledge of a physical location to answer properly?
    Reply strictly with "yes" or "no".
  
    Message: "${message}"
    `;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const res = await model.generateContent(prompt);
    return res.response.text().toLowerCase().includes('yes');
  }

  // ---- Handle user message ----
  async function handleSubmit(customInput) {
    const input = customInput || chatInput;
    if (input.trim() === '') return;

    setLoading(true);
    setFollowUps([]);
    setIsStreaming(true);

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    responseBuffer.current = '';
    scrollToBottom();

    const lga = extractLgaFromMessage(input);
    const needsLoc = needsLocationContext(input);

    // 🧭 Keep stable reference for previous “location-needed” prompt
    let activePrompt = isLocationPrompt;

    // If the user’s message needs an LGA but doesn’t include one yet
    if (needsLoc && !lga) {
      activePrompt = input;
      setIsLocationPrompt(input);
      setLoading(false);
      setMessages((prev) => [...prev, { role: 'assistant', content: getLgaPrompt() }]);
      return; // Wait for user to respond with LGA
    }

    // 🧠 AI-based location detection
    const needsLocation = await detectNeedsLocationAI(input);

    // ✅ Fix: correctly merge old question with new LGA
    const newInput =
      (needsLocation && activePrompt) || isLocationPrompt
        ? `${activePrompt || isLocationPrompt} in ${input}`
        : input;

    // 🧹 Clear location prompt state once used
    if (activePrompt || isLocationPrompt) {
      setIsLocationPrompt(null);
    }

    try {
      const lagosContext = await getRelevantLagosContext(newInput);

      const ministryContext = `
  ${CONTEXT}
  
  You are currently assisting a user browsing the "${safePage}" section of the Lagos State Government website.
  
  If this section corresponds to a ministry, interpret it as:
  **${ministryInfo ? ministryInfo.name : 'the appropriate Lagos State Ministry or Department'}**
  ${ministryInfo ? `Official Website: ${ministryInfo.url}` : ''}
  
  🧭 Behavioural Rules:
  - Always interpret questions like “Who is the commissioner?”, “What are their services?”, etc. as referring to **${ministryInfo ? ministryInfo.name : 'the relevant Lagos State Ministry'}**.
  - Respond only with verified Lagos-specific details.
  - Use Google Search for official *.lagosstate.gov.ng* sources if needed.
  - Include official links where applicable.
  - If unrelated to Lagos State, politely redirect the user.
  
  📘 Current Lagos State Ministry Context:
  ${ministryInfo ? `${ministryInfo.name} (${ministryInfo.url})` : 'Automatically infer from page context'}
  
  🗂 Relevant Lagos Data:
  ${lagosContext}
  `;

      if (!chatRef.current) {
        chatRef.current = await ai.chats.create({
          model: 'gemini-2.5-flash-lite',
          config,
          systemInstruction: ministryContext,
        });
      }

      let assistantText = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      const stream = await chatRef.current.sendMessageStream({
        message: `${ministryContext}\n\nUser: ${newInput}`,
      });

      for await (const chunk of stream) {
        const textPart = chunk?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (!textPart) continue;
        assistantText += textPart;
        responseBuffer.current += textPart;

        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.role === 'assistant') lastMsg.content = assistantText;
          return updated;
        });

        setShowScrollButton(true);
      }

      setIsStreaming(false);
      setShowScrollButton(true);

      const followUpQs = await generateFollowUps(assistantText, 'assistant', 4);
      setFollowUps(followUpQs);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Something went wrong. Please try again.' },
      ]);
    }

    setChatInput('');
    setLoading(false);
  }

  return (
    <div className="chatParent">
      <div className="chat-title">
        <div className="avatar">
          <img
            src="https://static.vecteezy.com/system/resources/previews/001/993/889/non_2x/beautiful-latin-woman-avatar-character-icon-free-vector.jpg"
            alt="avatar"
          />
        </div>
        <div className="identity">Lagos State Services Assistant (Seth)</div>
      </div>

      <div className="chat-window" ref={chatWindowRef}>
        <div className="messages">
          {messages.map((msg, i) => {
            if (msg.role === 'assistant' && msg.content.trim() === '') return null;
            const isUser = msg.role === 'user';
            return (
              <div key={i} className={`message ${isUser ? 'user-msg' : 'bot-msg'}`}>
                <div
                  className={`markdown-body prose prose-sm max-w-none
                  prose-headings:font-semibold prose-p:leading-relaxed
                  prose-a:text-blue-600 hover:prose-a:underline
                  prose-code:px-1 prose-code:rounded prose-li:my-1
                  prose-ol:list-decimal prose-ol:pl-6 prose-ul:list-disc prose-ul:pl-6
                  ${isUser ? 'prose-invert text-white' : 'text-gray-900 dark:text-gray-100'}`}
                >
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

        {showScrollButton && (
          <div className={`scroll-arrow ${isStreaming ? 'pulsing' : ''}`} onClick={scrollToBottom}>
            <ArrowDown strokeWidth={2} />
          </div>
        )}

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
          autoFocus
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
        {loading ? (
          <button disabled className="stop-btn">
            <img src={stopIcon} alt="" />
          </button>
        ) : (
          <button onClick={() => handleSubmit()} disabled={loading}>
            <img src={sendIcon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
