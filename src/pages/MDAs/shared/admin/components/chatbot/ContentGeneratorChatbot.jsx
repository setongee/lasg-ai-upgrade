import { GoogleGenerativeAI } from '@google/generative-ai';
import { Xmark } from 'iconoir-react';
import { useState } from 'react';
import { uploadFile } from '../../../../api/admin/content';
import './ContentGeneratorChatbot.css';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

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

// Derive a short scene description from the MDA name
const getMDAScene = (mdaFullName) => {
  const name = mdaFullName.toLowerCase();
  if (name.includes('agricult') || name.includes('farm') || name.includes('food'))
    return 'Nigerian farmers tending lush green crop fields and farmland in Lagos, golden hour light, wide shot';
  if (name.includes('women') || name.includes('gender'))
    return 'Confident Lagosian women in vibrant Nigerian attire gathered together, Nigerian flag in background, warm sunlight, wide shot';
  if (name.includes('health') || name.includes('hospital') || name.includes('medical'))
    return 'Modern hospital building in Lagos Nigeria with healthcare workers and patients outside, clear blue sky';
  if (name.includes('educat') || name.includes('school') || name.includes('learning'))
    return 'Nigerian students in school uniforms in a bright modern Lagos classroom, engaged and smiling, natural light';
  if (
    name.includes('work') ||
    name.includes('infrastructure') ||
    name.includes('road') ||
    name.includes('transport')
  )
    return 'Major road construction and modern highway infrastructure in Lagos Nigeria, wide aerial shot, blue sky';
  if (name.includes('environment') || name.includes('climate') || name.includes('forestry'))
    return 'Urban greenery and tree planting initiative in Lagos Nigeria, clean environment, bright natural light';
  if (
    name.includes('finance') ||
    name.includes('econom') ||
    name.includes('budget') ||
    name.includes('revenue')
  )
    return 'Modern Lagos financial district with glass office towers and business professionals, wide cinematic shot';
  if (name.includes('youth') || name.includes('sport') || name.includes('recreation'))
    return 'Young Nigerians playing football on a pitch in Lagos, energetic and joyful, golden hour light';
  if (name.includes('hous') || name.includes('urban') || name.includes('land'))
    return 'Modern affordable housing estate in Lagos Nigeria with Nigerian families outside, clean wide shot';
  if (
    name.includes('justice') ||
    name.includes('law') ||
    name.includes('attorney') ||
    name.includes('legal')
  )
    return 'Formal Nigerian court building exterior in Lagos, official architecture, clear sky, wide shot';
  if (name.includes('water') || name.includes('sanit'))
    return 'Clean water infrastructure and treatment facility in Lagos Nigeria, engineers working, wide shot';
  if (name.includes('energy') || name.includes('power') || name.includes('electric'))
    return 'Solar panels and electricity infrastructure in Lagos Nigeria, blue sky, wide cinematic shot';
  if (name.includes('tourism') || name.includes('culture') || name.includes('art'))
    return 'Vibrant Lagos cultural festival with colourful Nigerian traditional attire and art displays, wide shot';
  if (
    name.includes('trade') ||
    name.includes('commerce') ||
    name.includes('industry') ||
    name.includes('market')
  )
    return 'Busy modern Lagos commercial district with shops and business activity, wide cinematic shot, golden hour';
  if (
    name.includes('information') ||
    name.includes('communication') ||
    name.includes('technology') ||
    name.includes('digital')
  )
    return 'Modern technology hub in Lagos Nigeria with young professionals working on computers, bright open office';
  // Default fallback
  return `Lagos State government officials and citizens engaged in civic activities representing ${mdaFullName}, wide cinematic shot, golden hour`;
};

// --- Context-aware image prompts based on MDA name ---
const buildImagePrompts = (mdaFullName) => {
  const scene = getMDAScene(mdaFullName);
  return {
    heroImage: {
      prompt: `Photorealistic cinematic photograph: ${scene}. Ultra sharp, professional photography, no text, no watermarks, no logos, 16:9.`,
    },
    commissionerImage: {
      prompt: `Professional portrait photo of a Nigerian government official for ${mdaFullName}. Formal suit, confident friendly expression, neutral office background, soft studio lighting, sharp focus, 3:4 aspect ratio, no text.`,
    },
  };
};

// Sharpen canvas using unsharp mask convolution
const sharpenCanvas = (ctx, width, height, strength = 0.3) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const copy = new Uint8ClampedArray(data);
  const w = width;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const center = copy[i + c];
        const top = copy[((y - 1) * w + x) * 4 + c];
        const bottom = copy[((y + 1) * w + x) * 4 + c];
        const left = copy[(y * w + (x - 1)) * 4 + c];
        const right = copy[(y * w + (x + 1)) * 4 + c];
        const blurred = (top + bottom + left + right + center * 4) / 8;
        data[i + c] = Math.min(255, Math.max(0, center + (center - blurred) * strength * 4));
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

// Detect white/near-white margins for auto-crop
const getAutoCropBounds = (ctx, width, height, threshold = 240) => {
  const { data } = ctx.getImageData(0, 0, width, height);
  let top = height,
    bottom = 0,
    left = width,
    right = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2],
        a = data[i + 3];
      if (a > 10 && !(r > threshold && g > threshold && b > threshold)) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  if (top > bottom || left > right) return null;
  return { top, bottom, left, right };
};

// Compress + optional auto-crop + sharpen
const compressImage = (base64Data, mimeType, maxWidth = 1600, quality = 0.92, autoCrop = false) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = img.width;
      tmpCanvas.height = img.height;
      const tmpCtx = tmpCanvas.getContext('2d');
      tmpCtx.drawImage(img, 0, 0);

      let sx = 0,
        sy = 0,
        sw = img.width,
        sh = img.height;

      if (autoCrop) {
        const bounds = getAutoCropBounds(tmpCtx, img.width, img.height);
        if (bounds) {
          const pad = 4;
          sx = Math.max(0, bounds.left - pad);
          sy = Math.max(0, bounds.top - pad);
          sw = Math.min(img.width, bounds.right + pad) - sx;
          sh = Math.min(img.height, bounds.bottom + pad) - sy;
        }
      }

      const scale = Math.min(1, maxWidth / sw);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(sw * scale);
      canvas.height = Math.round(sh * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

      // Sharpen: stronger for portrait, lighter for hero
      sharpenCanvas(ctx, canvas.width, canvas.height, autoCrop ? 0.4 : 0.28);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Canvas compression failed'));
          resolve(blob);
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = `data:${mimeType};base64,${base64Data}`;
  });

// Generate → compress → upload → return Firebase URL
const generateImage = async (prompt, filename, autoCrop = false) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp-image-generation',
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;

  // Debug: log full response structure
  ('Gemini image response candidates:',
    JSON.stringify(
      response.candidates?.map((c) => ({
        parts: c.content?.parts?.map((p) => ({
          type: p.inlineData ? 'image' : 'text',
          textPreview: p.text?.slice(0, 100),
        })),
      })),
      null,
      2
    ));

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const { mimeType, data } = part.inlineData;

      const compressedBlob = await compressImage(data, mimeType, 1600, 0.92, autoCrop);
      const compressedDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(compressedBlob);
      });

      const uploadResponse = await uploadFile({
        photo: {
          temp: filename,
          data: compressedDataUrl,
        },
      });

      return uploadResponse.url;
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
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const generateContent = async () => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const randomName = LAGOSIAN_NAMES[Math.floor(Math.random() * LAGOSIAN_NAMES.length)];
    const randomTitle = COMMISSIONER_TITLES[Math.floor(Math.random() * COMMISSIONER_TITLES.length)];

    const systemPrompt = `
      You are a senior content strategist generating premium content for a government website.
      
      MDA: ${mdaFullName}
      Type: ${mdaType}
      Desired Tone: ${tone || 'professional and authoritative'}
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
      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

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
        generateImage(prompts.heroImage.prompt, `${mdaFullName}-hero-image`),
        generateImage(prompts.commissionerImage.prompt, `${mdaFullName}-commissioner-image`, true),
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
