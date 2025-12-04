import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import MDReactComponent from 'markdown-react-js';
import React, { useRef, useState } from 'react';
import { CONTEXT } from '../context';
import './chatbot.css';

// ---- Gemini ----
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// ---- Supabase ----
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

// ---- Chat config ----
const groundingTool = { googleSearch: {} };
const config = { tools: [groundingTool] };

const Chatbot = () => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]); // <-- new structure
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);
  const responseBuffer = useRef('');

  // ---- Helper: Retrieve relevant Lagos services using embeddings ----
  async function getRelevantLagosContext(query) {
    try {
      const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const embeddingResp = await model.embedContent(query);
      const embedding = embeddingResp.embedding.values;

      const { data, error } = await supabase.rpc('match_lagos_services', {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 3,
      });

      if (error) {
        console.error('Supabase search error:', error);
        return 'I’m having trouble finding relevant Lagos State information right now.';
      }

      if (!data || data.length === 0) {
        return 'I couldn’t find any matching Lagos State service related to your question.';
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

    // Add user message
    const userMsg = { role: 'user', content: chatInput };
    setMessages((prev) => [...prev, userMsg]);
    responseBuffer.current = '';

    try {
      // 1️⃣ Get Lagos context
      const lagosContext = await getRelevantLagosContext(chatInput);

      // 2️⃣ System + user message combo
      const momoreContext = `${CONTEXT} ${lagosContext}`;

      // 3️⃣ Initialize or reuse chat
      if (!chatRef.current) {
        chatRef.current = await ai.chats.create({
          model: 'gemini-2.5-flash-lite',
          config,
          systemInstruction: momoreContext,
        });
      }

      // 4️⃣ Stream Gemini’s reply
      const stream = await chatRef.current.sendMessageStream({
        message: `${momoreContext}\n\nUser: ${chatInput}`,
      });

      let assistantText = '';
      for await (const chunk of stream) {
        const textPart = chunk?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        assistantText += textPart;
        responseBuffer.current += textPart;

        // Update last assistant message as it streams
        setMessages((prev) => {
          const updated = [...prev];
          if (updated[updated.length - 1]?.role === 'assistant') {
            updated[updated.length - 1].content += textPart;
          } else {
            updated.push({ role: 'assistant', content: textPart });
          }
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Something went wrong, please check your connection.' },
      ]);
    }

    setChatInput('');
    setLoading(false);
  }

  console.log(messages);

  return (
    <div className="chatParent glass-card">
      <div className="chat-title">
        <div className="avatar">
          <img src="/lagos-logo.png" alt="Lagos Logo" />
        </div>
        <div className="identity">Lagos State Services Assistant (Lola)</div>
      </div>

      <div className="chat-window">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role === 'user' ? 'user-msg' : 'bot-msg'}`}>
              <MDReactComponent text={msg.content} />
            </div>
          ))}
          {loading && <div className="bot-msg thinking">💭 Lola is thinking...</div>}
        </div>

        <div className="input-section">
          <textarea
            autoFocus
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask Lola about Lagos State services..."
          />
          <button onClick={handleSubmit} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
