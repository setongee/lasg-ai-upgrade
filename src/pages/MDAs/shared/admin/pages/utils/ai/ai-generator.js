import { openRouterComplete } from '../../../../../../../utils/openrouter.js';
import { getKeywordGenerationPrompt } from './prompts/keyword-generator.js';

/**
 * Generates SEO keywords for a service using the AI proxy.
 * @param {string} serviceName - Name of the service
 * @param {string} serviceDescription - Description of the service
 * @param {string} mdaName - Name of the providing agency
 * @returns {Promise<Array>} Array of keyword objects with structure [{key: "keyword"}]
 */
export const generateKeywordsWithAI = async (serviceName, serviceDescription, mdaName) => {
  try {
    const prompt = getKeywordGenerationPrompt(serviceName, serviceDescription, mdaName);

    const text = await openRouterComplete([{ role: 'user', content: prompt }], {
      responseFormat: { type: 'json_object' },
      reasoningEffort: 'minimal',
    });

    const { keywords } = JSON.parse(text);

    if (Array.isArray(keywords) && keywords.every((item) => item.key)) {
      return keywords;
    }

    console.error('Invalid AI response format:', keywords);
    return [];
  } catch (error) {
    console.error('Error generating keywords with AI:', error);
    return [];
  }
};
