import { GoogleGenerativeAI } from '@google/generative-ai';

// Content field structure for the admin panel
export const CONTENT_FIELDS = [
  { id: 'heroTitle', label: 'Hero Title', type: 'text' },
  { id: 'heroDescription', label: 'Hero Description', type: 'textarea' },
  { id: 'feature1Title', label: 'Feature 1 Title', type: 'text' },
  { id: 'feature1Description', label: 'Feature 1 Description', type: 'textarea' },
  { id: 'feature2Title', label: 'Feature 2 Title', type: 'text' },
  { id: 'feature2Description', label: 'Feature 2 Description', type: 'textarea' },
  { id: 'ctaText', label: 'Call to Action Text', type: 'text' },
  { id: 'ctaButton', label: 'Button Text', type: 'text' },
];

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Generate content for the specified fields using AI
 * @param {Array} fields - Array of field objects to generate content for
 * @param {string} context - Context for content generation (e.g., page context)
 * @param {function} onProgress - Callback function for generation progress updates
 * @returns {Promise<Object>} - Object containing generated content for each field
 */
export const generateContent = async (fields, context = '', onProgress = () => {}) => {
  const generatedContent = {};
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const prompt = `Generate a ${field.label.toLowerCase()} for a Lagos State government website. 
      It should be ${field.type === 'text' ? 'concise (5-10 words)' : 'descriptive (2-3 sentences)'}.
      Focus on the theme of: ${context || 'general government services'}.`;
    
    try {
      const result = await model.generateContent(prompt);
      generatedContent[field.id] = result.response.text().trim();
    } catch (error) {
      console.error(`Error generating content for ${field.id}:`, error);
      generatedContent[field.id] = ''; // Fallback to empty string on error
    }
    
    // Update progress
    const progress = Math.round(((i + 1) / fields.length) * 100);
    onProgress(progress, field.id, generatedContent[field.id]);
  }
  
  return generatedContent;
};

/**
 * Save content to the server
 * @param {Object} contentData - Content data to save
 * @returns {Promise<Object>} - Response from the server
 */
export const saveContent = async (contentData) => {
  try {
    // Replace this with your actual API call
    const response = await fetch('/api/content/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save content');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving content:', error);
    throw error;
  }
};

/**
 * Load saved content from the server
 * @returns {Promise<Object>} - Saved content data
 */
export const loadContent = async () => {
  try {
    // Replace this with your actual API call
    const response = await fetch('/api/content/load');
    
    if (!response.ok) {
      throw new Error('Failed to load content');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading content:', error);
    return {}; // Return empty object if loading fails
  }
};

/**
 * Get default content structure with empty values
 * @returns {Object} - Default content structure
 */
export const getDefaultContent = () => {
  const defaultContent = {};
  CONTENT_FIELDS.forEach(field => {
    defaultContent[field.id] = '';
  });
  return defaultContent;
};
