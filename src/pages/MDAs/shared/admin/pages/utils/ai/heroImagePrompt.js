// Shared hero-image prompt builder — was duplicated near-verbatim between
// AiPhoto.jsx and ContentGeneratorChatbot.jsx. One place to update the
// photography style (camera/lens language, negative prompt) going forward.

// ─── Shared negative and quality suffixes ────────────────────────────────────
const NEGATIVE =
  'No text overlays, no watermarks, no logos, no banners, no blurry areas, no overexposed highlights, no lens flare, no cartoon or illustration style, no stock-photo cheese, no empty skies dominating the frame.';

const HERO_QUALITY =
  'Shot on Sony A7R V 24mm f/1.8 lens. ISO 100, 1/500s. RAW post-processed: crisp micro-detail, rich shadow separation, natural skin tones, cinematic colour grade. Ultra-sharp throughout. 16:9 wide frame.';

// ─── Rich, structured hero image prompts per MDA category ────────────────────
export const buildHeroPrompt = (mdaFullName, customDescription = '') => {
  const name = mdaFullName.toLowerCase();
  let basePrompt = '';

  if (name.includes('agricult') || name.includes('farm') || name.includes('food'))
    basePrompt = `Photorealistic editorial photograph of Nigerian farmers harvesting vibrant green crops on fertile Lagos-region farmland at golden hour. Foreground: close detail of hands gathering produce, sharp focus. Midground: rows of lush crops stretching to horizon. Background: warm amber sky. 2–3 farmers in traditional work attire, natural candid expressions. f/2.8 shallow depth on foreground. Rich earthy greens and golds.`;
  else if (name.includes('women') || name.includes('gender'))
    basePrompt = `Photorealistic editorial photograph of a group of confident, diverse Lagosian women in vibrant Nigerian Ankara attire gathered in a modern Lagos civic space. Natural directional sunlight from the left creating dimensional shadows. Foreground woman in sharp focus, background softly bokeh. Empowered, joyful expressions. Warm golden-hour palette with deep greens and reds from fabric prints.`;
  else if (name.includes('health') || name.includes('hospital') || name.includes('medical'))
    basePrompt = `Photorealistic editorial photograph of a bright modern hospital ward in Lagos Nigeria. Nigerian healthcare workers in scrubs attending to patients with focused, caring expressions. Clean white-and-teal interior, large windows with natural daylight flooding in. Sharp foreground detail on medical equipment, midground staff in motion. Clinical yet warm atmosphere.`;
  else if (name.includes('educat') || name.includes('school') || name.includes('learning'))
    basePrompt = `Photorealistic editorial photograph of Nigerian secondary school students in crisp green-and-white uniforms actively engaged in a modern Lagos classroom. Bright natural window light from the right. Foreground: student writing in notebook, sharp focus. Midground: teacher at whiteboard, students raising hands. Colours: vivid greens, warm skin tones, white walls. Energetic, aspirational atmosphere.`;
  else if (
    name.includes('work') ||
    name.includes('infrastructure') ||
    name.includes('road') ||
    name.includes('transport')
  )
    basePrompt = `Photorealistic aerial editorial photograph of a major modern highway interchange in Lagos Nigeria under bright blue-sky daylight. Sharp structural detail on road surfaces, lane markings, and overpasses. Active traffic flow: buses, cars, motorcycles. Surrounding urban landscape: commercial buildings, trees. Low-angle sun casting long directional shadows for depth and dimension. Powerful wide composition showing scale and order.`;
  else if (name.includes('environment') || name.includes('climate') || name.includes('forestry'))
    basePrompt = `Photorealistic editorial photograph of a thriving urban tree-planting initiative in Lagos Nigeria. Nigerian environmental workers and volunteers in bright safety vests planting young trees along a clean city boulevard. Lush green canopy overhead, dappled afternoon light filtering through leaves. Foreground: close sharp detail of hands placing sapling in earth. Background: leafy city street with pedestrians. Vivid greens, deep blues, warm skin tones.`;
  else if (
    name.includes('finance') ||
    name.includes('econom') ||
    name.includes('budget') ||
    name.includes('revenue')
  )
    basePrompt = `Photorealistic editorial photograph of the modern Lagos Island financial district at blue hour. Gleaming glass-and-steel tower facades with warm office lighting glowing from within. Foreground: sharp pavement detail with business professionals in purposeful motion. Midground: 2 Nigerian professionals in suits in conversation. Deep blues, amber glass reflections, city lights. Sophisticated, authoritative atmosphere.`;
  else if (name.includes('youth') || name.includes('sport') || name.includes('recreation'))
    basePrompt = `Photorealistic editorial action photograph of young Nigerians playing competitive football on a well-maintained grass pitch in Lagos at golden hour. Player mid-kick, ball sharply frozen in air. Foreground players in crisp focus; background crowd softly bokeh. Jerseys in bright Lagos state colours. Warm amber-and-green palette. Energy, motion, and joy.`;
  else if (name.includes('hous') || name.includes('urban') || name.includes('land'))
    basePrompt = `Photorealistic editorial photograph of a clean modern affordable housing estate in Lagos Nigeria. Rows of well-maintained mid-rise residential buildings with landscaped grounds. Foreground: Nigerian family—parents and two children—walking along a paved path, candid and natural. Morning light with long soft shadows. Colours: warm cream buildings, green lawns, bright clothing. Aspirational, community-focused atmosphere.`;
  else if (
    name.includes('justice') ||
    name.includes('law') ||
    name.includes('attorney') ||
    name.includes('legal')
  )
    basePrompt = `Photorealistic editorial photograph of the imposing exterior of a formal Lagos High Court building. Symmetrical architecture with wide stone steps leading to tall columns. Nigerian flag flying prominently. Late-morning directional sunlight creating strong shadows and highlights on architectural detail. Deep blue sky. 1–2 suited figures ascending steps for human scale. Dignified, powerful, wide composition.`;
  else if (name.includes('water') || name.includes('sanit'))
    basePrompt = `Photorealistic editorial photograph of a modern water treatment plant in Lagos Nigeria. Large clean filtration tanks and infrastructure under a wide blue sky. Nigerian engineers in hard hats and high-vis vests inspecting equipment in foreground, sharp focus. Gleaming pipes and machinery in midground. Blue-and-white colour palette. Competent, reassuring atmosphere.`;
  else if (name.includes('energy') || name.includes('power') || name.includes('electric'))
    basePrompt = `Photorealistic editorial photograph of a large solar farm installation in Lagos Nigeria. Rows of photovoltaic panels stretching to the horizon under a vivid blue sky with scattered clouds. Foreground: sharp detail of panel surface with reflected sky. Midground: 2 Nigerian solar technicians in uniform checking equipment. Golden midday light. Clean greens, electric blues, silver panels. Progressive, optimistic atmosphere.`;
  else if (name.includes('tourism') || name.includes('culture') || name.includes('art'))
    basePrompt = `Photorealistic editorial photograph of a vibrant Lagos cultural arts festival. Performers in elaborate traditional Yoruba attire—rich reds, golds, and indigos—dancing in an open civic square. Foreground dancer in sharp focus mid-movement. Background: engaged diverse crowd, colourful decorations. Late-afternoon warm light with deep colour saturation. Joyful, celebratory, culturally rich atmosphere.`;
  else if (
    name.includes('trade') ||
    name.includes('commerce') ||
    name.includes('industry') ||
    name.includes('market')
  )
    basePrompt = `Photorealistic editorial photograph of a busy modern commercial district in Lagos Nigeria at golden hour. Wide street lined with contemporary retail buildings and active foot traffic. Foreground: Nigerian trader and customer in candid transaction, sharp focus. Midground: bustling street activity. Background: warm building facades catching sunset light. Rich ambers, deep shadows, vivid clothing colours. Dynamic, prosperous atmosphere.`;
  else if (
    name.includes('information') ||
    name.includes('communication') ||
    name.includes('technology') ||
    name.includes('digital')
  )
    basePrompt = `Photorealistic editorial photograph of a modern open-plan tech hub in Lagos Nigeria. Young Nigerian professionals—men and women—working at standing desks with large monitors displaying code and dashboards. Bright diffused natural light from floor-to-ceiling windows. Foreground: developer typing, hands and screen in sharp focus. Midground: collaborative group discussion at whiteboard. Clean white-and-glass interior with pops of Lagos state green. Progressive, innovative atmosphere.`;
  else
    basePrompt = `Photorealistic editorial photograph of a dignified Lagos State Government civic engagement scene: Nigerian government officials and diverse citizens gathered outside a modern official building in Lagos, active discussion and handshakes. Late-afternoon directional sunlight. Foreground figures in sharp focus; architectural background softly bokeh. Nigerian flags visible. Warm tones, professional attire, positive community atmosphere.`;

  if (customDescription.trim()) {
    basePrompt = `Photorealistic editorial photograph for ${mdaFullName}: ${customDescription}. ${basePrompt}`;
  }

  return `${basePrompt} ${HERO_QUALITY} ${NEGATIVE}`;
};

export const buildCommissionerPortraitPrompt = (mdaFullName) =>
  `Photorealistic professional studio portrait of a Nigerian government official representing ${mdaFullName}. Subject: Nigerian person in their 40s–50s wearing a sharp formal suit or traditional attire, sitting slightly angled toward camera. Expression: confident, approachable, calm authority. Lighting: soft Rembrandt studio lighting, key light upper-left, subtle fill from right, dark neutral background with slight vignette. Sharp focus on eyes and face, shallow depth-of-field f/2.0, gentle shoulder bokeh. Deep navy or charcoal suit, white shirt. No text, no watermarks, no badges, no busy backgrounds. Shot on Canon EOS R5, 85mm f/1.4. 3:4 aspect ratio.`;
