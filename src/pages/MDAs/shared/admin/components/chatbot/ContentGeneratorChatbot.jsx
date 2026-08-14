import { GoogleGenAI } from '@google/genai';
import { Xmark } from 'iconoir-react';
import { useState } from 'react';
import { uploadDocument } from '../../../../api/uploader/uploadFIles';
import { openRouterComplete } from '../../../../../../utils/openrouter';
import './ContentGeneratorChatbot.css';

// Required for image generation models (gemini-2.5-flash-image) — OpenRouter doesn't serve image output
const genAINew = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

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

// ─── Shared negative and quality suffixes ────────────────────────────────────
const NEGATIVE =
  'No text overlays, no watermarks, no logos, no banners, no blurry areas, no overexposed highlights, no lens flare, no cartoon or illustration style, no stock-photo cheese, no empty skies dominating the frame.';

const HERO_QUALITY =
  'Shot on Sony A7R V 24mm f/1.8 lens. ISO 100, 1/500s. RAW post-processed: crisp micro-detail, rich shadow separation, natural skin tones, cinematic colour grade. Ultra-sharp throughout. 16:9 wide frame.';

// ─── Rich, structured hero image prompts per MDA category ────────────────────
const buildHeroPrompt = (mdaFullName) => {
  const name = mdaFullName.toLowerCase();

  if (name.includes('agricult') || name.includes('farm') || name.includes('food'))
    return `Photorealistic editorial photograph of Nigerian farmers harvesting vibrant green crops on fertile Lagos-region farmland at golden hour. Foreground: close detail of hands gathering produce, sharp focus. Midground: rows of lush crops stretching to horizon. Background: warm amber sky. 2–3 farmers in traditional work attire, natural candid expressions. f/2.8 shallow depth on foreground. Rich earthy greens and golds. ${HERO_QUALITY} ${NEGATIVE}`;

  if (name.includes('women') || name.includes('gender'))
    return `Photorealistic editorial photograph of a group of confident, diverse Lagosian women in vibrant Nigerian Ankara attire gathered in a modern Lagos civic space. Natural directional sunlight from the left creating dimensional shadows. Foreground woman in sharp focus, background softly bokeh. Empowered, joyful expressions. Warm golden-hour palette with deep greens and reds from fabric prints. ${HERO_QUALITY} ${NEGATIVE}`;

  if (name.includes('health') || name.includes('hospital') || name.includes('medical'))
    return `Photorealistic editorial photograph of a bright modern hospital ward in Lagos Nigeria. Nigerian healthcare workers in scrubs attending to patients with focused, caring expressions. Clean white-and-teal interior, large windows with natural daylight flooding in. Sharp foreground detail on medical equipment, midground staff in motion. Clinical yet warm atmosphere. ${HERO_QUALITY} ${NEGATIVE}`;

  if (name.includes('educat') || name.includes('school') || name.includes('learning'))
    return `Photorealistic editorial photograph of Nigerian secondary school students in crisp green-and-white uniforms actively engaged in a modern Lagos classroom. Bright natural window light from the right. Foreground: student writing in notebook, sharp focus. Midground: teacher at whiteboard, students raising hands. Colours: vivid greens, warm skin tones, white walls. Energetic, aspirational atmosphere. ${HERO_QUALITY} ${NEGATIVE}`;

  if (
    name.includes('work') ||
    name.includes('infrastructure') ||
    name.includes('road') ||
    name.includes('transport')
  )
    return `Photorealistic aerial editorial photograph of a major modern highway interchange in Lagos Nigeria under bright blue-sky daylight. Sharp structural detail on road surfaces, lane markings, and overpasses. Active traffic flow: buses, cars, motorcycles. Surrounding urban landscape: commercial buildings, trees. Low-angle sun casting long directional shadows for depth and dimension. Powerful wide composition showing scale and order. ${HERO_QUALITY} ${NEGATIVE}`;

  if (name.includes('environment') || name.includes('climate') || name.includes('forestry'))
    return `Photorealistic editorial photograph of a thriving urban tree-planting initiative in Lagos Nigeria. Nigerian environmental workers and volunteers in bright safety vests planting young trees along a clean city boulevard. Lush green canopy overhead, dappled afternoon light filtering through leaves. Foreground: close sharp detail of hands placing sapling in earth. Background: leafy city street with pedestrians. Vivid greens, deep blues, warm skin tones. ${HERO_QUALITY} ${NEGATIVE}`;

  if (
    name.includes('finance') ||
    name.includes('econom') ||
    name.includes('budget') ||
    name.includes('revenue')
  )
    return `Photorealistic editorial photograph of the modern Lagos Island financial district at blue hour. Gleaming glass-and-steel tower facades with warm office lighting glowing from within. Foreground: sharp pavement detail with business professionals in purposeful motion. Midground: 2 Nigerian professionals in suits in conversation. Deep blues, amber glass reflections, city lights. Sophisticated, authoritative atmosphere. ${HERO_QUALITY} ${NEGATIVE}`;

  if (name.includes('youth') || name.includes('sport') || name.includes('recreation'))
    return `Photorealistic editorial action photograph of young Nigerians playing competitive football on a well-maintained grass pitch in Lagos at golden hour. Player mid-kick, ball sharply frozen in air. Foreground players in crisp focus; background crowd softly bokeh. Jerseys in bright Lagos state colours. Warm amber-and-green palette. Energy, motion, and joy. ${HERO_QUALITY} ${NEGATIVE}`;

  if (name.includes('hous') || name.includes('urban') || name.includes('land'))
    return `Photorealistic editorial photograph of a clean modern affordable housing estate in Lagos Nigeria. Rows of well-maintained mid-rise residential buildings with landscaped grounds. Foreground: Nigerian family—parents and two children—walking along a paved path, candid and natural. Morning light with long soft shadows. Colours: warm cream buildings, green lawns, bright clothing. Aspirational, community-focused atmosphere. ${HERO_QUALITY} ${NEGATIVE}`;

  if (
    name.includes('justice') ||
    name.includes('law') ||
    name.includes('attorney') ||
    name.includes('legal')
  )
    return `Photorealistic editorial photograph of the imposing exterior of a formal Lagos High Court building. Symmetrical architecture with wide stone steps leading to tall columns. Nigerian flag flying prominently. Late-morning directional sunlight creating strong shadows and highlights on architectural detail. Deep blue sky. 1–2 suited figures ascending steps for human scale. Dignified, powerful, wide composition. ${HERO_QUALITY} ${NEGATIVE}`;

  if (name.includes('water') || name.includes('sanit'))
    return `Photorealistic editorial photograph of a modern water treatment plant in Lagos Nigeria. Large clean filtration tanks and infrastructure under a wide blue sky. Nigerian engineers in hard hats and high-vis vests inspecting equipment in foreground, sharp focus. Gleaming pipes and machinery in midground. Blue-and-white colour palette. Competent, reassuring atmosphere. ${HERO_QUALITY} ${NEGATIVE}`;

  if (name.includes('energy') || name.includes('power') || name.includes('electric'))
    return `Photorealistic editorial photograph of a large solar farm installation in Lagos Nigeria. Rows of photovoltaic panels stretching to the horizon under a vivid blue sky with scattered clouds. Foreground: sharp detail of panel surface with reflected sky. Midground: 2 Nigerian solar technicians in uniform checking equipment. Golden midday light. Clean greens, electric blues, silver panels. Progressive, optimistic atmosphere. ${HERO_QUALITY} ${NEGATIVE}`;

  if (name.includes('tourism') || name.includes('culture') || name.includes('art'))
    return `Photorealistic editorial photograph of a vibrant Lagos cultural arts festival. Performers in elaborate traditional Yoruba attire—rich reds, golds, and indigos—dancing in an open civic square. Foreground dancer in sharp focus mid-movement. Background: engaged diverse crowd, colourful decorations. Late-afternoon warm light with deep colour saturation. Joyful, celebratory, culturally rich atmosphere. ${HERO_QUALITY} ${NEGATIVE}`;

  if (
    name.includes('trade') ||
    name.includes('commerce') ||
    name.includes('industry') ||
    name.includes('market')
  )
    return `Photorealistic editorial photograph of a busy modern commercial district in Lagos Nigeria at golden hour. Wide street lined with contemporary retail buildings and active foot traffic. Foreground: Nigerian trader and customer in candid transaction, sharp focus. Midground: bustling street activity. Background: warm building facades catching sunset light. Rich ambers, deep shadows, vivid clothing colours. Dynamic, prosperous atmosphere. ${HERO_QUALITY} ${NEGATIVE}`;

  if (
    name.includes('information') ||
    name.includes('communication') ||
    name.includes('technology') ||
    name.includes('digital')
  )
    return `Photorealistic editorial photograph of a modern open-plan tech hub in Lagos Nigeria. Young Nigerian professionals—men and women—working at standing desks with large monitors displaying code and dashboards. Bright diffused natural light from floor-to-ceiling windows. Foreground: developer typing, hands and screen in sharp focus. Midground: collaborative group discussion at whiteboard. Clean white-and-glass interior with pops of Lagos state green. Progressive, innovative atmosphere. ${HERO_QUALITY} ${NEGATIVE}`;

  // Default fallback
  return `Photorealistic editorial photograph of a dignified Lagos State Government civic engagement scene: Nigerian government officials and diverse citizens gathered outside a modern official building in Lagos, active discussion and handshakes. Late-afternoon directional sunlight. Foreground figures in sharp focus; architectural background softly bokeh. Nigerian flags visible. Warm tones, professional attire, positive community atmosphere. ${HERO_QUALITY} ${NEGATIVE}`;
};

// ─── Context-aware image prompts based on MDA name ───────────────────────────
const buildImagePrompts = (mdaFullName) => ({
  heroImage: {
    prompt: buildHeroPrompt(mdaFullName),
  },
  commissionerImage: {
    prompt: `Photorealistic professional studio portrait of a Nigerian government official representing ${mdaFullName}. Subject: Nigerian person in their 40s–50s wearing a sharp formal suit or traditional attire, sitting slightly angled toward camera. Expression: confident, approachable, calm authority. Lighting: soft Rembrandt studio lighting, key light upper-left, subtle fill from right, dark neutral background with slight vignette. Sharp focus on eyes and face, shallow depth-of-field f/2.0, gentle shoulder bokeh. Deep navy or charcoal suit, white shirt. No text, no watermarks, no badges, no busy backgrounds. Shot on Canon EOS R5, 85mm f/1.4. 3:4 aspect ratio.`,
  },
});

// ─── Generate → File → uploadDocument ───────────────────────────────────────
const generateImage = async (prompt, filename, folderName) => {
  // Must use @google/genai (new SDK) — @google/generative-ai does not support image output models
  const response = await genAINew.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const { mimeType, data } = part.inlineData;

      // Decode base64 → Uint8Array → Blob → File (no compression, full quality)
      const byteArray = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
      const blob = new Blob([byteArray], { type: mimeType });
      const ext = mimeType.split('/')[1] || 'png';
      const file = new File([blob], `${filename}.${ext}`, { type: mimeType });

      const uploadResponse = await uploadDocument(file, folderName);
      return uploadResponse.data.url;
    }
  }

  throw new Error('No image returned from Gemini');
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
      const text = await openRouterComplete([{ role: 'user', content: systemPrompt }]);

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
