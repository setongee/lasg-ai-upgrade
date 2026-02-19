import { useState, useEffect, useCallback } from 'react';
import { CONTENT_FIELDS, generateContent, saveContent, loadContent, getDefaultContent } from '../../utils/contentGenerator';
import { Check, Pencil, Save, Xmark } from 'iconoir-react';

const ContentEditor = ({ isOpen, onClose, pageContext }) => {
  const [contentData, setContentData] = useState(getDefaultContent());
  const [selectedFields, setSelectedFields] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [currentGeneratingField, setCurrentGeneratingField] = useState('');

  // Load saved content when the editor opens
  useEffect(() => {
    if (isOpen) {
      const fetchContent = async () => {
        try {
          const savedContent = await loadContent();
          if (savedContent) {
            setContentData(prev => ({
              ...getDefaultContent(),
              ...savedContent,
              ...prev
            }));
          }
        } catch (error) {
          console.error('Error loading content:', error);
        }
      };
      fetchContent();
    }
  }, [isOpen]);

  // Toggle field selection for content generation
  const toggleFieldSelection = (fieldId) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  // Handle content generation
  const handleGenerateContent = useCallback(async () => {
    const fieldsToGenerate = CONTENT_FIELDS.filter(field => selectedFields[field.id]);
    if (fieldsToGenerate.length === 0) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      await generateContent(
        fieldsToGenerate,
        pageContext,
        (progress, fieldId, generatedText) => {
          setGenerationProgress(progress);
          setCurrentGeneratingField(
            CONTENT_FIELDS.find(f => f.id === fieldId)?.label || fieldId
          );
          
          if (generatedText !== undefined) {
            setContentData(prev => ({
              ...prev,
              [fieldId]: generatedText
            }));
          }
        }
      );
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
      setCurrentGeneratingField('');
    }
  }, [selectedFields, pageContext]);

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveContent(contentData);
      alert('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Update content field
  const updateContentField = (fieldId, value) => {
    setContentData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Content Generator</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Xmark />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          {/* Field Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Select Fields to Generate</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {CONTENT_FIELDS.map((field) => (
                <label key={field.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!!selectedFields[field.id]}
                    onChange={() => toggleFieldSelection(field.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isGenerating}
                  />
                  <span>{field.label}</span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleGenerateContent}
                disabled={isGenerating || !Object.values(selectedFields).some(Boolean)}
                className={`px-4 py-2 rounded-md text-white ${
                  isGenerating || !Object.values(selectedFields).some(Boolean)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isGenerating ? 'Generating...' : 'Generate Selected'}
              </button>
              
              <button
                onClick={() => {
                  const allFields = {};
                  CONTENT_FIELDS.forEach(field => {
                    allFields[field.id] = true;
                  });
                  setSelectedFields(allFields);
                }}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                disabled={isGenerating}
              >
                Select All
              </button>
              
              <button
                onClick={() => setSelectedFields({})}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                disabled={isGenerating}
              >
                Clear All
              </button>
            </div>
            
            {isGenerating && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Generating {currentGeneratingField}... {Math.round(generationProgress)}% complete
                </p>
              </div>
            )}
          </div>
          
          {/* Content Preview/Edit */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Content Preview</h3>
              <button
                onClick={handleSave}
                disabled={isSaving || Object.keys(contentData).length === 0}
                className={`px-4 py-2 rounded-md text-white flex items-center gap-1 ${
                  isSaving || Object.keys(contentData).length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSaving ? 'Saving...' : (
                  <>
                    <Save width={16} height={16} />
                    <span>Save All Changes</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="space-y-4">
              {CONTENT_FIELDS.map((field) => (
                <div key={field.id} className="border rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={contentData[field.id] || ''}
                      onChange={(e) => updateContentField(field.id, e.target.value)}
                      className="w-full p-2 border rounded-md h-24"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={contentData[field.id] || ''}
                      onChange={(e) => updateContentField(field.id, e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  )}
                  {contentData[field.id] && (
                    <div className="mt-2 text-xs text-green-600 flex items-center">
                      <Check width={14} height={14} className="mr-1" />
                      {contentData[field.id].split(' ').length} words, {contentData[field.id].length} characters
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
