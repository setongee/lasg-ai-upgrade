import { Xmark } from 'iconoir-react';
import { useState } from 'react';
import { uploadDocument } from '../../../../api/uploader/uploadFIles';
import { generateAiImage, openRouterComplete } from '../../../../../../utils/openrouter';
import { buildCommissionerPortraitPrompt, buildHeroPrompt } from '../../pages/utils/ai/heroImagePrompt';
import './ContentGeneratorChatbot.css';

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

const COMMISSIONER_TITLES = ['Honourable Commissioner', 'Permanent Secretary'];

// Predefined government-appropriate tones for Lagos State
const GOVERNMENT_TONES = [
  'Professional & Authoritative',
  'Citizen-Friendly & Accessible',
  'Formal & Official',
  'Warm & Welcoming',
  'Transparent & Accountable',
  'Innovative & Forward-Thinking',
  'Responsive & Service-Oriented',
  'Inclusive & Community-Focused',
  'Efficient & Results-Driven',
  'Dignified & Respectful',
  'Clear & Straightforward',
  'Inspiring & Visionary',
  'Custom Tone',
];

// ─── Context-aware image prompts based on MDA name ───────────────────────────
const buildImagePrompts = (mdaFullName) => ({
  heroImage: { prompt: buildHeroPrompt(mdaFullName) },
  commissionerImage: { prompt: buildCommissionerPortraitPrompt(mdaFullName) },
});

// ─── Generate → File → uploadDocument ───────────────────────────────────────
const generateImage = async (prompt, filename, folderName) => {
  const { base64, mimeType } = await Promise.race([
    generateAiImage(prompt),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Image generation timeout')), 60000)),
  ]);

  // Decode base64 → Uint8Array → Blob → File (no compression, full quality)
  const byteArray = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = new Blob([byteArray], { type: mimeType });
  const ext = mimeType.split('/')[1] || 'png';
  const file = new File([blob], `${filename}.${ext}`, { type: mimeType });

  const uploadResponse = await Promise.race([
    uploadDocument(file, folderName),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Upload timeout')), 30000)),
  ]);
  return uploadResponse.data.url;
};

const ContentGeneratorChatbot = ({
  onContentGenerated,
  mdaFullName = 'Lagos State Government',
  mdaType = 'default',
}) => {
  const [tone, setTone] = useState('');
  const [customTone, setCustomTone] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  // Get the actual tone value (either selected or custom)
  const getActualTone = () => {
    if (tone === 'Custom Tone') {
      return customTone || 'professional';
    }
    return tone || 'professional';
  };

  const generateContent = async () => {
    const randomName = LAGOSIAN_NAMES[Math.floor(Math.random() * LAGOSIAN_NAMES.length)];
    const randomTitle = COMMISSIONER_TITLES[Math.floor(Math.random() * COMMISSIONER_TITLES.length)];

    const systemPrompt = `
      You are a senior content strategist generating premium content for a government website.
      
      MDA: ${mdaFullName}
      Type: ${mdaType}
      Desired Tone: ${getActualTone()}
      Context: ${context || 'general government services'}
      
      Generate content for the following fields:
      - hero_text: A premium, mission-driven headline that is concise, authoritative, and aspirational (8-12 words). Must NOT start with or include the word "Lagos". Must NOT use colons or em-dashes. Should be a flowing, creative sentence — not a slogan format like "X: Y"
      - hero_subtitle: A supporting statement that expands on the headline, maintaining a professional and citizen-focused tone (20-25 words)
      - action_button_text: A clear, action-oriented call-to-action that encourages citizen engagement (2-4 words)
      - welcomeMessage: An engaging welcome message highlighting key priorities and vision (50-100 words)
      - commissionerName: Use exactly this name: "${randomName}"
      - commissionerTitle: Use exactly this title: "${randomTitle}"
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
      - Use the exact commissionerName and commissionerTitle provided above
    `;

    try {
      const text = await Promise.race([
        openRouterComplete([{ role: 'user', content: systemPrompt }], {
          responseFormat: { type: 'json_object' },
          reasoningEffort: 'minimal',
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Content generation timeout')), 60000)
        ),
      ]);

      return JSON.parse(text);
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
    setLoadingStep('Generating content & images...');

    try {
      const prompts = buildImagePrompts(mdaFullName);

      const [content, heroImage, commissionerImage] = await Promise.all([
        generateContent(),
        generateImage(prompts.heroImage.prompt, `${mdaFullName}-hero-image`, 'LASG Hero Images'),
        generateImage(
          prompts.commissionerImage.prompt,
          `${mdaFullName}-commissioner-image`,
          'LASG Commissioner Images'
        ),
      ]);

      const fullContent = {
        ...content,
        heroImage,
        commissionerImage,
      };

      if (onContentGenerated) {
        onContentGenerated(fullContent);
      }

      setTone('');
      setContext('');
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="content-chatbot-container">
      <div className="content-chatbot-window">
        <div className="chat-header">
          <h3>Content Generator</h3>
          <button className="close-chat">
            <Xmark />
          </button>
        </div>

        <div className="chat-input-container">
          <form onSubmit={handleGenerate}>
            <div className="input-group">
              <label htmlFor="tone">Desired Tone *</label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => {
                  setTone(e.target.value);
                  if (e.target.value !== 'Custom Tone') {
                    setCustomTone('');
                  }
                }}
                disabled={isLoading}
                className="w-full p-2.5 border border-gray-300 rounded-[4px] text-[14px] outline-none focus:ring-green-600 bg-white"
              >
                <option value="">Select a tone...</option>
                {GOVERNMENT_TONES.map((toneOption) => (
                  <option key={toneOption} value={toneOption}>
                    {toneOption}
                  </option>
                ))}
              </select>
            </div>

            {tone === 'Custom Tone' && (
              <div className="input-group mt-3">
                <label htmlFor="customTone">Custom Tone Description *</label>
                <input
                  id="customTone"
                  type="text"
                  value={customTone}
                  onChange={(e) => setCustomTone(e.target.value)}
                  placeholder="Describe your custom tone (e.g., casual and conversational, technical and precise)"
                  disabled={isLoading}
                  className="w-full p-2.5 border border-gray-300 rounded-[4px] text-[14px] outline-none focus:ring-green-600 bg-white"
                />
              </div>
            )}

            <div className="input-group mt-3">
              <label htmlFor="context">Context *</label>
              <textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Describe the context or purpose of the content..."
                disabled={isLoading}
                rows={3}
                className="w-full p-2.5 border border-gray-300 rounded-[4px] text-[14px] outline-none focus:ring-green-600 bg-white resize-none"
              />
            </div>

            <div className="">
              {isLoading ? (
                <div
                  className="w-full !rounded-[5px] bg-gray-700 py-3 mt-5 text-[14px] font-semibold text-white text-center"
                  title="Generating..."
                >
                  {loadingStep || 'Generating...'}
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
