import { ArrowUp, Sparks } from 'iconoir-react';
import { useEffect, useRef, useState } from 'react';
import { askAboutLesson } from '../../../../api/admin/learn';

const SUGGESTIONS = [
  'Summarize this lesson',
  'What are the key steps?',
  'What mistakes should I avoid?',
];

const LessonChat = ({ lessonId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Each lesson gets a fresh conversation
  useEffect(() => {
    setMessages([]);
    setInput('');
  }, [lessonId]);

  useEffect(() => {
    if (messages.length || loading)
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, loading]);

  const send = async (text) => {
    const question = text.trim();
    if (!question || loading) return;

    const history = messages;
    setMessages([...history, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);

    try {
      const answer = await askAboutLesson(lessonId, question, history);
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I couldn't answer that. ${error.message}`,
          error: true,
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="h-full rounded-2xl bg-white overflow-hidden flex flex-col">
      <div className="px-5 py-3.5 bg-gradient-to-r from-[#27ae60] to-[#c5e554] flex items-center gap-2.5">
        <Sparks width={18} height={18} color="#011810" />
        <h3 className="text-[14px] font-semibold text-[#011810]">Lesson assistant</h3>
        <span className="ml-auto text-[11px] font-medium text-[#011810]/70">
          Ask about this lesson
        </span>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
        {!messages.length && (
          <div className="flex flex-col gap-2">
            <p className="text-[13px] text-gray-500 mb-1">
              Stuck on something? Try one of these, or type your own.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => send(suggestion)}
                  className="text-[13px] px-3.5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, i) => (
          <div
            key={i}
            className={`text-[13.5px] leading-relaxed px-4 py-2.5 rounded-2xl max-w-[90%] whitespace-pre-line ${
              message.role === 'user'
                ? 'self-end bg-[#011810] text-white rounded-br-md'
                : message.error
                  ? 'self-start bg-red-50 text-red-700 rounded-bl-md'
                  : 'self-start bg-gray-100 rounded-bl-md'
            }`}
          >
            {message.content}
          </div>
        ))}

        {loading && <div className="self-start text-[13px] text-gray-400 px-1">Thinking…</div>}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="p-3 border-t border-gray-100 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          maxLength={1000}
          className="flex-1 py-2.5 px-4 rounded-full bg-[#f5f5f5] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#27ae60]"
        />
        <button
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-full bg-[#011810] text-[#c5e554] flex items-center justify-center cursor-pointer disabled:opacity-40"
        >
          <ArrowUp width={18} height={18} />
        </button>
      </form>
    </div>
  );
};

export default LessonChat;
