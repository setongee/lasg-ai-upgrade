import { GoogleGenerativeAI } from '@google/generative-ai';
import { ArrowUp, StarSolid, Xmark, XmarkCircleSolid } from 'iconoir-react';
import { useState } from 'react';
import './AdminChatbot.css';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Context configurations with field specifications and generation instructions
const CONTEXT_CONFIGS = {
  heroSection: {
    fields: {
      hero_text: {
        minWords: 8,
        maxWords: 12,
        description:
          'premium, mission-driven headline that is concise, authoritative, and aspirational. Structure: action verb + quality promise + service area + inclusive audience.',
      },
      hero_subtitle: {
        minWords: 20,
        maxWords: 25,
        description:
          'supporting statement that expands on the headline, maintaining a professional and citizen-focused tone while emphasizing policy-grade content and inclusive service delivery.',
      },
      action_button_text: {
        minWords: 2,
        maxWords: 4,
        description:
          'clear, action-oriented call-to-action that encourages citizen engagement and service utilization.',
      },
    },
    instructions:
      'Generate premium, mission-driven content for the hero section of a government website. Focus on creating concise, authoritative, and aspirational messaging that reflects our commitment to excellent public service. Ensure all content is professional, citizen-focused, and policy-grade, with clear calls to action that drive citizen engagement and service utilization.',
  },
  aboutSection: {
    fields: {
      heading: { minWords: 3, maxWords: 6, description: 'section heading' },
      description: { minWords: 30, maxWords: 50, description: 'detailed description' },
      key_points: { minWords: 10, maxWords: 15, description: 'bullet points (3-5 items)' },
    },
    instructions: 'Generate informative and engaging content for the about section.',
  },
  commissionerZone: {
    fields: {
      welcomeTitle: {
        minWords: 5,
        maxWords: 10,
        description:
          "warm and official welcome title that reflects the commissioner's office and purpose",
      },
      welcomeMessage: {
        minWords: 50,
        maxWords: 100,
        description:
          'engaging welcome message from the commissioner, highlighting key priorities and vision',
      },
    },
    instructions:
      "Generate professional and engaging content for the commissioner's welcome section. The tone should be authoritative yet approachable, reflecting the commissioner's vision and priorities. Include key messages about service delivery, governance, and citizen engagement.",
  },
  // Add more contexts as needed
};

// Tone configurations for different MDAs
const MDA_TONES = {
  health: 'professional, caring, and reassuring',
  finance: 'precise, trustworthy, and clear',
  education: 'informative, encouraging, and accessible',
  default: 'professional, clear, and helpful',
};

const AdminChatbot = ({
  onContentGenerated,
  context = 'heroSection',
  mdaType = 'default',
  vision = 'Delivering efficient, transparent, and people-centered services to all Lagos residents through innovation and technology.',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFields, setSelectedFields] = useState(['all']);

  // Get the fields configuration for the current context
  const contextConfig = CONTEXT_CONFIGS[context] || {};
  const allFields = Object.keys(contextConfig.fields || {});

  // Toggle field selection
  const toggleField = (field) => {
    setSelectedFields((prev) => {
      // If 'all' is selected and we're toggling another field
      if (field !== 'all' && prev.includes('all')) {
        return [field];
      }

      // If 'all' is being toggled
      if (field === 'all') {
        return prev.includes('all') ? [] : ['all', ...allFields];
      }

      // Toggle individual field
      if (prev.includes(field)) {
        const newSelection = prev.filter((f) => f !== field);
        // If no fields are selected, default back to all
        return newSelection.length > 0 ? newSelection : ['all'];
      } else {
        const newSelection = [...prev, field];
        // If all fields are selected, switch to 'all'
        return newSelection.length === allFields.length ? ['all'] : newSelection;
      }
    });
  };

  // Get the fields to generate based on selection
  const getFieldsToGenerate = () => {
    if (selectedFields.includes('all')) {
      return null; // null means generate all fields
    }
    return selectedFields;
  };

  const generateContent = async (prompt) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    // Get context config or default to general
    const config = CONTEXT_CONFIGS[context] || {
      fields: {},
      instructions: 'Generate appropriate content.',
    };
    const tone = MDA_TONES[mdaType] || MDA_TONES.default;

    // Determine which fields to generate
    const fields = getFieldsToGenerate() || Object.keys(config.fields);

    // Build field descriptions for the prompt
    const fieldDescriptions = fields
      .filter((field) => config.fields[field])
      .map((field) => {
        const { minWords, maxWords, description } = config.fields[field];
        return `${field}: ${description} (${minWords}-${maxWords} words)`;
      })
      .join('\n      ');

    const systemPrompt = `
        You are a senior content strategist generating premium content for a ${mdaType} government website.

        ${config.instructions}

        Vision (context only, do NOT paraphrase or echo directly):
        ${vision}

        Tone: ${tone}

        Generate content for the following fields:
        ${fieldDescriptions}

        Guidelines:
        - Use the vision as thematic guidance, not as source text
        - Do NOT paraphrase, mirror, or reuse sentence structure from the vision
        - Maintain semantic alignment while ensuring strong lexical and structural variation
        - Avoid repetitive sentence openings or rhetorical patterns
        - Prefer outcome-focused, citizen-impact language over abstract or generic goals
        - Avoid defaulting to high-frequency institutional verbs
        - If an action verb is used, ensure it is specific and adds clear meaning
        - Vary phrasing intentionally while preserving institutional credibility
        - Do NOT use colons, semicolons, or split-headline constructions
        - Headlines must read as a single, continuous phrase or sentence fragment

        Headline construction guidance:
        - Do NOT default to a single action-verb-led structure
        - Choose ONE distinct structural approach per headline:
        1. Outcome-focused
        2. Assurance-focused
        3. System or capability-focused
        4. Access or inclusion-focused
        5. Citizen experience-focused
        6. Action-oriented (use sparingly)

        Quality check before responding:
        - Review generated content
        - If multiple fields start with similar verbs or phrasing, rewrite for diversity

        Output rules:
        - Return ONLY a valid JSON object
        - Match the exact field names provided
        - Follow the specified word counts strictly
        - Ensure content is professional, authoritative, and policy-grade
        - Focus on trust, quality, and real-world service impact

        User request:
        ${prompt}
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
    // Input is now optional, so we don't need to check for empty input

    setIsLoading(true);
    try {
      const content = await generateContent(input);

      if (onContentGenerated) {
        onContentGenerated(content);
      } else {
        ('Generated content:', content);
      }

      setInput('');
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render field selection pills
  const renderFieldPills = () => (
    <div className="field-selection">
      <span className="field-label">Generate:</span>
      <div className="field-pills">
        <button
          type="button"
          className={`field-pill ${selectedFields.includes('all') ? 'selected' : ''}`}
          onClick={() => toggleField('all')}
        >
          All
          {selectedFields.includes('all') && (
            <span className="remove-pill">
              {' '}
              <XmarkCircleSolid />
            </span>
          )}
        </button>

        {/* Generate the pills from the context config from allFields with the object.keys method */}
        {allFields.map((field) => (
          <button
            key={field}
            type="button"
            className={`field-pill ${selectedFields.includes(field) ? 'selected' : ''}`}
            onClick={() => toggleField(field)}
          >
            {field.replace(/_/g, ' ')}
            {selectedFields.includes(field) && (
              <span className="remove-pill">
                <XmarkCircleSolid />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <button className="admin-chatbot-toggle" onClick={() => setIsOpen(true)}>
        <span>
          <StarSolid fontSize={12} />
        </span>
        <span> AI Content Assistant</span>
      </button>
    );
  }

  return (
    <div className="admin-chatbot-container">
      <div className="admin-chatbot-window">
        <div className="chat-header">
          <h3>Content Generator</h3>
          <button className="admin-close-chat cursor-pointer" onClick={() => setIsOpen(false)}>
            <Xmark />
          </button>
        </div>

        {allFields?.length > 0 ? (
          <div className="chat-input-container">
            {renderFieldPills()}
            <div className="input-wrapper">
              <div className="textarea-form">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Add any additional details (optional)"
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate(e)}
                />
              </div>
              {isLoading ? (
                <div className="generating">
                  <span className="dot">•</span>
                  <span className="dot" style={{ animationDelay: '0.2s' }}>
                    •
                  </span>
                  <span className="dot" style={{ animationDelay: '0.4s' }}>
                    •
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="admin-send-button"
                  title="Generate content"
                >
                  <ArrowUp />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-[150px] flex items-center justify-center px-6 rounded text-center">
            Sorry cannot generate content for the selected section!
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatbot;
