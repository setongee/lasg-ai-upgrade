import { ArrowLeft } from 'iconoir-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { updateAdminData } from '../../../../api/admin/content';
import { useThemeStore } from '../../../../stores/theme.store';
import ContentGeneratorChatbot from './ContentGeneratorChatbot';
import { themeInitialData } from './theme-initial-data';

const ContentGeneratorExample = ({ prevStep, selectedTheme }) => {
  const [generatedContent, setGeneratedContent] = useState(null);
  const mdaData = useThemeStore((state) => state.mdaData);
  const { mda } = useParams();

  const landingPage = themeInitialData[selectedTheme];

  const update = async (content) => {
    await updateAdminData(
      mdaData?._id,
      { landingPage: content, isVerified: true },
      'updated the website content'
    ).then(() => (window.location.href = `/${mda}/admin/published`));
    console.log(content);
  };

  const handleSkipGeneration = () => {
    // Update with current landing page data without AI generation
    update(landingPage);
  };

  const handleContentGenerated = (content) => {
    const landingArea = {
      ...landingPage,
    };

    // Only update main_photo if it exists in landingPage
    if ('main_photo' in landingPage) {
      landingArea.main_photo = content.heroImage || landingPage.main_photo;
    }

    // Only update hero_text if it exists in landingPage
    if ('hero_text' in landingPage) {
      landingArea.hero_text = content.hero_text;
    }

    // Only update hero_subtitle if it exists in landingPage
    if ('hero_subtitle' in landingPage) {
      landingArea.hero_subtitle = content.hero_subtitle;
    }

    // Only update action_button_text if it exists in landingPage
    if ('action_button_text' in landingPage) {
      landingArea.action_button_text = content.action_button_text;
    }

    // Only update commissionersZone if it exists in landingPage
    if ('commissionersZone' in landingPage) {
      landingArea.commissionersZone = {
        ...landingPage.commissionersZone,
        welcomeTitle: content.welcomeTitle,
        welcomeMessage: content.welcomeMessage,
        commissionerName: content.commissionerName,
        commissionerTitle: content.commissionerTitle,
        commissionerImage:
          content.commissionerImage || landingPage.commissionersZone.commissionerImage,
      };
    }

    update(landingArea);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="flex items-center gap-2 mb-8 relative">
        <div
          onClick={prevStep}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft />
        </div>
        <h1 className="text-[18px] font-semibold absolute left-1/2 -translate-x-1/2 mt-[2px]">
          Generate Content
        </h1>
      </div>

      <ContentGeneratorChatbot
        onContentGenerated={handleContentGenerated}
        mdaFullName={mdaData?.fullname || ''}
        mdaType={mdaData?.theme || 'default'}
      />
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <button
          onClick={handleSkipGeneration}
          className="hover:bg-gray-800!"
          style={{
            padding: '10px 20px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            marginRight: '10px',
          }}
        >
          Skip AI Generation
        </button>
      </div>
    </div>
  );
};

export default ContentGeneratorExample;
