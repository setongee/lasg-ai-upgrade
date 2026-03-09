import { GoogleGenerativeAI } from '@google/generative-ai';
import { getKeywordGenerationPrompt } from './prompts/keyword-generator.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

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
