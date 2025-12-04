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
  const [response, setResponse] = useState('');
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

  // ---- Helper: Generate follow-ups from Supabase embeddings context ----
  function generateFollowUpsFromText(contextText) {
    if (!contextText) return [];
    const lines = contextText.split('\n').filter((l) => l.trim().startsWith('🏛️'));
    return lines
      .slice(0, 2)
      .map((line) => {
        const name = line.replace('🏛️ **', '').replace('**', '').trim();
        return [
          `How can I apply for services under ${name}?`,
          `Where is the ${name} office located in Lagos?`,
          `What are the current initiatives related to ${name}?`,
        ];
      })
      .flat();
  }

  // ---- Handle user message ----
  async function handleSubmit() {
    if (chatInput.trim() === '') return;
    setLoading(true);
    setResponse((prev) => prev + `\n\n🧑: ${chatInput}\n`);
    responseBuffer.current = '';

    try {
      // 1️⃣ Get Lagos context from embeddings
      const lagosContext = await getRelevantLagosContext(chatInput);

      // 2️⃣ Build Momore system instruction
      const momoreContext = `${CONTEXT} ${lagosContext}`;

      // 3️⃣ Initialize or reuse chat
      if (!chatRef.current) {
        chatRef.current = await ai.chats.create({
          model: 'gemini-2.5-flash-lite',
          config,
          systemInstruction: momoreContext,
        });
      }

      // 4️⃣ Send user message
      const stream = await chatRef.current.sendMessageStream({
        message: `${momoreContext}\n\nUser: ${chatInput}`,
      });

      let textOut = '';
      for await (const chunk of stream) {
        const textPart = chunk?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        responseBuffer.current += textPart;
        textOut += textPart;
        setResponse((prev) => prev + textPart);
      }
    } catch (err) {
      console.error(err);
      setResponse((prev) => prev + `\nSomething went wrong, check network connection`);
    }

    setChatInput('');
    setLoading(false);
  }

  return (
    <div className="chatParent glass-card">
      <div className="chat-title">
        <div className="avartar">
          <img src="" alt="" />
        </div>
        <div className="identity">Lagos State Services Assistant</div>
      </div>

      <div className="chat-window">
        <div
          id="response"
          //   style={{ minHeight: '300px', border: '1px solid #ccc', padding: '1rem' }}
        >
          <MDReactComponent text={response} />
          {loading && (
            <p>
              <em>Thinking...</em>
            </p>
          )}
        </div>

        <textarea
          autoFocus
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask Lola about Lagos State services..."
          style={{ width: '70%', padding: '0.5rem' }}
        />

        <div
          className="submit"
          onClick={handleSubmit}
          style={{
            padding: '0.5rem 1rem',
            marginTop: '0.5rem',
            cursor: 'pointer',
            background: '#0072ce',
            color: '#fff',
            display: 'inline-block',
          }}
        >
          Send
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
