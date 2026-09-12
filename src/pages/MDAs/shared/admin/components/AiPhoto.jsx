import { StarSolid } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../utils/toast';
import { generateAiImage } from '../../../../../utils/openrouter';
import { uploadDocument } from '../../../api/uploader/uploadFIles';
import { buildHeroPrompt } from '../pages/utils/ai/heroImagePrompt';

const AiPhoto = ({ onImageGenerated, mdaFullName, onLoadingChange }) => {
  const [aiDescription, setAiDescription] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isGeneratingImage);
    }
  }, [isGeneratingImage, onLoadingChange]);

  const generateImage = async (prompt, filename, folderName) => {
    try {
      const { base64, mimeType } = await Promise.race([
        generateAiImage(prompt),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Image generation timeout')), 60000)
        ),
      ]);

      const byteArray = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const blob = new Blob([byteArray], { type: mimeType });
      const ext = mimeType.split('/')[1] || 'png';
      const file = new File([blob], `${filename}.${ext}`, { type: mimeType });

      // Upload with timeout
      const uploadResponse = await Promise.race([
        uploadDocument(file, folderName),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Upload timeout')), 30000)),
      ]);

      return uploadResponse.data.url;
    } catch (error) {
      console.error('Image generation error:', error);

      // Handle specific 413 error
      if (error.response?.status === 413) {
        throw new Error(
          'Generated image is too large for upload. Please try generating a simpler image or contact support.'
        );
      }

      throw error;
    }
  };

  const handleAiImageGeneration = async () => {
    if (!aiDescription.trim()) {
      notify.error('Please provide a description for the AI image generation');
      return;
    }

    setIsGeneratingImage(true);
    try {
      const prompt = buildHeroPrompt(mdaFullName, aiDescription);
      const imageUrl = await generateImage(
        prompt,
        `${mdaFullName.replace(' ', '-')}-hero-image-ai`,
        'LASG Hero Images'
      );

      if (onImageGenerated) {
        onImageGenerated(imageUrl);
      }

      notify.success('AI image generated successfully!');
      setAiDescription('');
    } catch (error) {
      console.error('Error generating image:', error);

      // Provide specific error messages
      if (error.message === 'Image generation timeout') {
        notify.error(
          'Image generation is taking too long. Please try again with a simpler description.'
        );
      } else if (error.message === 'Upload timeout') {
        notify.error(
          'Image upload timed out. The image was generated but failed to upload. Please try again.'
        );
      } else if (error.message.includes('API_KEY')) {
        notify.error('API configuration error. Please contact support.');
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        notify.error('API quota exceeded. Please try again later.');
      } else {
        notify.error(`Failed to generate image: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="rounded-lg ">
      <div className="flex flex-col gap-3">
        <label htmlFor="ai-description" className="text-[13px] font-medium text-gray-700">
          Describe your hero image *
        </label>
        <textarea
          id="ai-description"
          value={aiDescription}
          onChange={(e) => setAiDescription(e.target.value)}
          placeholder="Describe what you want in the hero image... (e.g., modern government building with citizens, busy office scene, community event, etc.)"
          className="w-full p-4 rounded-[10px] field-sizing-content min-h-[120px] text-[14px] outline-none focus:ring-green-600 focus:border-green-600 resize-none bg-gray-100"
          rows={3}
          disabled={isGeneratingImage}
        />
        <button
          type="button"
          onClick={handleAiImageGeneration}
          disabled={isGeneratingImage || !aiDescription.trim()}
          className={`w-full py-2.5 px-4 rounded-[6px] text-[14px] font-medium transition-colors flex items-center justify-center gap-2 ${
            isGeneratingImage || !aiDescription.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isGeneratingImage ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <StarSolid className="w-4 h-4" />
              Generate AI Image
            </>
          )}
        </button>
        <p className="text-[13px] text-gray-500 italic">
          AI will generate a professional hero image based on your description and the MDA context.
        </p>
      </div>
    </div>
  );
};

export default AiPhoto;
