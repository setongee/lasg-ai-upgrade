import { GoogleGenerativeAI } from '@google/generative-ai';
import { Xmark } from 'iconoir-react';
import { useState } from 'react';
import './ContentGeneratorChatbot.css';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// List of random Lagosian names
const LAGOSIAN_NAMES = [
  'Adebayo Oluwafemi',
  'Funke Akindele',
  'Chidi Eze',
  'Bola Ahmed',
  'Ngozi Okonkwo',
  'Tunde Balogun',
  'Chioma Okafor',
  'Kunle Adeyemi',
  'Rashida Bello',
  'Emeka Nwosu',
  'Yetunde Williams',
  'Ibrahim Musa',
  'Grace Johnson',
  'Samuel Ogunleye',
  'Patience Eze',
  'Femi Kuti',
  'Adaobi Nwankwo',
  'Micheal Cole',
  'Blessing Adeola',
  'David Onyeka',
];

const ContentGeneratorChatbot = ({
  onContentGenerated,
  mdaFullName = 'Lagos State Government',
  mdaType = 'default',
}) => {
  const [tone, setTone] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateContent = async () => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    // Select a random Lagosian name
    const randomName = LAGOSIAN_NAMES[Math.floor(Math.random() * LAGOSIAN_NAMES.length)];

    const systemPrompt = `
      You are a senior content strategist generating premium content for a government website.
      
      MDA: ${mdaFullName}
      Type: ${mdaType}
      Desired Tone: ${tone || 'professional and authoritative'}
      Context: ${context || 'general government services'}
      
      Generate content for the following fields:
      - hero_text: A premium, mission-driven headline that is concise, authoritative, and aspirational (8-12 words)
      - hero_subtitle: A supporting statement that expands on the headline, maintaining a professional and citizen-focused tone (20-25 words)
      - action_button_text: A clear, action-oriented call-to-action that encourages citizen engagement (2-4 words)
      - welcomeMessage: An engaging welcome message highlighting key priorities and vision (50-100 words)
      - commissionerName: Use exactly this name: "${randomName}"
      - welcomeTitle: A short, impactful title for the commissioners zone (strictly 6-8 words) and make it sound like a short quote inline with the welcomeMessage
      
      Guidelines:
      - Generate professional, authoritative, and policy-grade content
      - Focus on trust, quality, and real-world service impact
      - Ensure content is citizen-focused and service-oriented
      - Maintain semantic alignment with the provided tone and context
      - Vary phrasing intentionally while preserving institutional credibility
      
      Output rules:
      - Return ONLY a valid JSON object
      - Match the exact field names provided
      - Follow the specified word counts strictly
      - Use the exact commissionerName provided above
    `;

    try {
      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No valid JSON found in response');

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!tone.trim() && !context.trim()) {
      alert('Please provide at least a tone or context for content generation.');
      return;
    }

    setIsLoading(true);
    try {
      const content = await generateContent();

      if (onContentGenerated) {
        onContentGenerated(content);
      } else {
        ('Generated content:', content);
      }

      // Reset form
      setTone('');
      setContext('');
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content-chatbot-container">
      <div className="content-chatbot-window">
        <div className="chat-header">
          <h3>Content Generator</h3>
          <button className="close-chat" onClick={() => setIsOpen(false)}>
            <Xmark />
          </button>
        </div>

        <div className="chat-input-container">
          <form onSubmit={handleGenerate}>
            <div className="input-group">
              <label htmlFor="tone">Desired Tone *</label>
              <input
                id="tone"
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="e.g., professional, friendly, authoritative"
                disabled={isLoading}
              />
            </div>

            <div className="input-group mt-3">
              <label htmlFor="context">Context *</label>
              <textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Describe the context or purpose of the content..."
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="">
              {isLoading ? (
                <div
                  className="w-full !rounded-[5px] bg-gray-700 py-3 mt-5 text-[14px] font-semibold text-white text-center"
                  title="Generating..."
                >
                  Generating...
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-center !rounded-[5px] bg-green-600 py-3 mt-5 text-[14px] font-semibold text-white"
                  title="Generate content"
                >
                  Generate Web Page
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContentGeneratorChatbot;
