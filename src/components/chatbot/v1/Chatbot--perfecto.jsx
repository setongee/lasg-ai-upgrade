import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CONTEXT } from '../context';
import './chatbot.css';
import think_img from './comment.png';

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
      content: `Hello! I'm Lola, your AI assistant from the Lagos State Ministry of Information, Science and Technology. How can I help you with Lagos State Government services and information today?`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [followUps, setFollowUps] = useState([]);

  const chatRef = useRef(null);
  const chatWindowRef = useRef(null);
  const responseBuffer = useRef('');
  const isUserScrolling = useRef(false);

  // ---- Scroll behavior ----
  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.style.paddingBottom = '50px';
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

  // ---- Smart adaptive follow-up generator ----
  async function generateFollowUps(lastReply, sender = 'assistant') {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

      // Automatically infer the next speaker
      const nextRole = sender.toLowerCase() === 'assistant' ? 'user' : 'assistant';

      const prompt = `
You are a conversational AI generator that produces 3 short, natural, context-aware follow-up messages.

The most recent message came from: **${sender.toUpperCase()}**
The next speaker should be: **${nextRole.toUpperCase()}**

Last message content:
"${lastReply}"

=== RULES ===
1. **If next speaker = USER:**
   - Generate 3 short, natural replies the user might tap or type next.
   - They should sound like *user responses*, not questions directed at the assistant.
   - Examples: “Yes, show me how”, “Tell me more”, “Where can I apply?”
   - Keep them under 12 words each.

2. **If next speaker = ASSISTANT:**
   - Generate 3 conversational questions or nudges the assistant could ask next.
   - Example: “Would you like me to guide you?”, “Have you used it before?”
   - Avoid formal or robotic phrasing.
   - Keep them under 15 words each.

3. **Tone:** Always friendly, fluid, and contextual.
4. **Formatting:** Output only the 3 follow-ups separated by double pipes (||). No explanations.

Now generate the 3 follow-up messages.
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

  // ---- Handle user message ----
  async function handleSubmit(customInput) {
    const input = customInput || chatInput;
    if (input.trim() === '') return;
    setLoading(true);
    setFollowUps([]);

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    responseBuffer.current = '';
    scrollToBottom();

    try {
      const lagosContext = await getRelevantLagosContext(input);

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
        message: `${ministryContext}\n\nUser: ${input}`,
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

        if (isUserScrolling.current) setShowScrollButton(true);
      }

      // Generate adaptive follow-ups for clickable suggestions
      const followUpQs = await generateFollowUps(assistantText, 'assistant');
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
        <div className="identity">Lagos State Services Assistant (Lola)</div>
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
                {' '}
                <div className="think_img">
                  <img src={think_img} alt="Think Image" />
                </div>{' '}
                Lola is thinking
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
          <div className="scroll-arrow" onClick={scrollToBottom}>
            ↓
          </div>
        )}
      </div>

      <div className="input-section">
        <textarea
          autoFocus
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask Lola about Lagos State services..."
        />
        <div onClick={() => handleSubmit()} disabled={loading}>
          Send
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
