import { GoogleGenerativeAI } from '@google/generative-ai';
import { Xmark } from 'iconoir-react';
import { useState } from 'react';
import { uploadFile } from '../../../../api/admin/content';
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

const COMMISSIONER_TITLES = ['Honourable Commissioner', 'Permanent Secretary'];

// --- Image prompt builder ---
const buildImagePrompts = (mdaFullName, context) => ({
  heroImage: {
    prompt: `
Generate a high-quality, photorealistic image that visually represents the work and impact of ${mdaFullName} in Lagos State, Nigeria.
Focus on people, activities, environment, or infrastructure directly related to its core function.
Scene should feel authentic, modern, civic-focused, and inspiring.
Natural lighting, cinematic composition, professional photography, 16:9 aspect ratio.
`,
  },

  serviceAreaImage: {
    prompt: `
Generate a detailed, photorealistic image representing ${mdaFullName}'s service area in Lagos, Nigeria.
Show real-life activity, citizens benefiting from services, relevant infrastructure or operational environment.
Golden hour lighting, dynamic composition, wide angle, 4:3 aspect ratio.
`,
  },

  commissionerImage: {
    prompt: `
Generate a professional portrait of a Nigerian government leader aligned with ${mdaFullName}.
Formal business attire, confident and approachable expression.
Neutral or subtle office background related to the ministry’s function.
Sharp focus, soft lighting, 3:4 aspect ratio.
`,
  },
});

// Detect white/near-white margins and return tight crop bounds
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
      // Count pixel as content if not near-white and not transparent
      if (a > 10 && !(r > threshold && g > threshold && b > threshold)) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  // Return null if nothing found (fully white image)
  if (top > bottom || left > right) return null;
  return { top, bottom, left, right };
};

// Compress a base64 image via canvas — auto-crops white margins, resizes, re-exports as JPEG
const compressImage = (base64Data, mimeType, maxWidth = 1280, quality = 1, autoCrop = false) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // First pass: draw full image to detect crop bounds if needed
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
          const pad = 4; // small padding so face isn't clipped
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

// --- Generate image with Gemini 2.0 Flash, compress, upload, return URL ---
const generateImage = async (prompt, filename, autoCrop = false) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp-image-generation',
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const { mimeType, data } = part.inlineData;

      // Compress to JPEG blob, then read back as base64 data URL
      const compressedBlob = await compressImage(data, mimeType, 1280, 0.82, autoCrop);
      const compressedDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(compressedBlob);
      });

      // Match exact uploadFile signature: { photo: { temp, data } }
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
      - hero_text: A premium, mission-driven headline that is concise, authoritative, and aspirational (8-12 words)
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
      - Use the exact commissionerName provided above
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
    setLoadingStep('Generating text content & images...');

    try {
      const prompts = buildImagePrompts(mdaFullName, context);

      // Generate text + all 3 images in parallel, each uploads and resolves to a URL
      const [content, heroImage, serviceAreaImage, commissionerImage] = await Promise.all([
        generateContent(),
        generateImage(prompts.heroImage.prompt, `${mdaFullName}-hero-image`),
        generateImage(prompts.serviceAreaImage.prompt, `${mdaFullName}-service-area-image`),
        generateImage(prompts.commissionerImage.prompt, `${mdaFullName}-commissioner-image`, true),
      ]);

      const fullContent = {
        ...content,
        heroImage, // Firebase URL e.g. https://storage.googleapis.com/...
        serviceAreaImage, // Firebase URL
        commissionerImage, // Firebase URL
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
