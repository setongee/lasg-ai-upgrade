import { openRouterComplete } from '../../../../../../../utils/openrouter.js';
import { getKeywordGenerationPrompt } from './prompts/keyword-generator.js';

/**
 * Generates keywords using Gemini AI based on service information
 * @param {string} serviceName - Name of the service
 * @param {string} serviceDescription - Description of the service
 * @param {string} mdaName - Name of the providing agency
 * @returns {Promise<Array>} Array of keyword objects with structure [{key: "keyword"}]
 */
export const generateKeywordsWithAI = async (serviceName, serviceDescription, mdaName) => {
  try {
    const prompt = getKeywordGenerationPrompt(serviceName, serviceDescription, mdaName);

    const text = await openRouterComplete([{ role: 'user', content: prompt }]);

    // Parse JSON response - handle potential markdown formatting
    let cleanedText = text;
    // Remove markdown code blocks if present
    if (text.includes('```json')) {
      cleanedText = text.replace(/```json\n?|```/g, '').trim();
    }

    const keywordsData = JSON.parse(cleanedText);

    // Ensure the response is an array of objects with 'key' property
    if (Array.isArray(keywordsData) && keywordsData.every((item) => item.key)) {
      return keywordsData;
    } else {
      console.error('Invalid AI response format:', keywordsData);
      return [];
    }
  } catch (error) {
    console.error('Error generating keywords with AI:', error);
    return [];
  }
};
