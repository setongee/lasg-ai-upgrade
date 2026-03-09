import { useState } from 'react';
import { useParams } from 'react-router';
import { updateAdminData } from '../../../../api/admin/content';
import { useThemeStore } from '../../../../stores/theme.store';
import ContentGeneratorChatbot from './ContentGeneratorChatbot';
import { themeInitialData } from './theme-initial-data';

const ContentGeneratorExample = () => {
  const [generatedContent, setGeneratedContent] = useState(null);
  const mdaData = useThemeStore((state) => state.mdaData);
  const { mda } = useParams();

  const landingPage = themeInitialData[mdaData?.theme];

  const update = async (content) => {
    await updateAdminData(
      mdaData?._id,
      { landingPage: content, isVerified: true },
      'updated website content'
    ).then(() => (window.location.href = `/${mda}/admin/published`));
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
      <ContentGeneratorChatbot
        onContentGenerated={handleContentGenerated}
        mdaFullName={mdaData?.fullname || ''}
        mdaType={mdaData?.theme || 'default'}
      />
    </div>
  );
};

export default ContentGeneratorExample;
