import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CONTEXT } from '../context';
import './chatbot.css';

// ---- Safe Ministry Context Setup ----
const MINISTRY_CONTEXT_MAP = {
  health: {
    name: 'Lagos State Ministry of Health',
    url: 'https://health.lagosstate.gov.ng',
  },
  mepb: {
    name: 'Lagos State Ministry of Economic Planning and Budget',
    url: 'https://mepb.lagosstate.gov.ng',
  },
  finance: {
    name: 'Lagos State Ministry of Finance',
    url: 'https://finance.lagosstate.gov.ng',
  },
  sto: {
    name: 'Lagos State Treasury Office',
    url: 'https://sto.lagosstate.gov.ng',
  },
  transport: {
    name: 'Lagos State Ministry of Transportation',
    url: 'https://transportation-blush.vercel.app',
  },
  mist: {
    name: 'Lagos State Ministry of Innovation, Science and Technology (MIST)',
    url: 'https://mist.lagosstate.gov.ng',
  },

  '': {
    name: 'Lagos State Official Website',
    url: 'https://lagosstate.gov.ng',
  },
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

  const chatRef = useRef(null);
  const responseBuffer = useRef('');
  const chatWindowRef = useRef(null);

  // ---- Auto scroll to bottom whenever messages update ----
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

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

  // ---- Handle user message ----
  async function handleSubmit() {
    if (chatInput.trim() === '') return;
    setLoading(true);

    const userMsg = { role: 'user', content: chatInput };
    setMessages((prev) => [...prev, userMsg]);
    responseBuffer.current = '';

    try {
      // 1️⃣ Get Lagos context
      const lagosContext = await getRelevantLagosContext(chatInput);

      // 2️⃣ Construct context
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

      // 3️⃣ Initialize chat if not created yet
      if (!chatRef.current) {
        chatRef.current = await ai.chats.create({
          model: 'gemini-2.5-flash-lite',
          config,
          systemInstruction: ministryContext,
        });
      }

      // 4️⃣ Add placeholder assistant message
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      let assistantText = '';

      // 5️⃣ Stream Gemini’s reply
      const stream = await chatRef.current.sendMessageStream({
        message: `${ministryContext}\n\nUser: ${chatInput}`,
      });

      for await (const chunk of stream) {
        const textPart = chunk?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        assistantText += textPart;
        responseBuffer.current += textPart;

        // Update the latest assistant message in real time
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.role === 'assistant') {
            lastMsg.content = assistantText;
          }
          return updated;
        });
      }
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
            const isUser = msg.role === 'user';
            return (
              <div key={i} className={`message ${isUser ? 'user-msg' : 'bot-msg'}`}>
                <div
                  className={`markdown-body prose prose-sm max-w-none
              prose-headings:font-semibold prose-p:leading-relaxed
              prose-a:text-blue-600 hover:prose-a:underline
              prose-code:px-1 prose-code:rounded prose-li:my-1
              prose-ol:list-decimal prose-ol:pl-6
              prose-ul:list-disc prose-ul:pl-6
              ${isUser ? 'prose-invert text-white' : 'text-gray-900 dark:text-gray-100'}`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              </div>
            );
          })}

          {loading && <div>💭 Lola is thinking...</div>}
        </div>
      </div>

      <div className="input-section">
        <textarea
          autoFocus
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask Lola about Lagos State services..."
        />
        <div onClick={handleSubmit} disabled={loading}>
          Send
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
