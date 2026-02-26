import { useState } from 'react';
import { useParams } from 'react-router';
import { updateAdminData } from '../../../../api/admin/content';
import { useThemeStore } from '../../../../stores/theme.store';
import ContentGeneratorChatbot from './ContentGeneratorChatbot';

const ContentGeneratorExample = () => {
  const [generatedContent, setGeneratedContent] = useState(null);
  const mdaData = useThemeStore((state) => state.mdaData);
  const { mda } = useParams();

  const landingPage = {
    enabledSections: {
      quickServices: true,
      services: true,
      commissionersZone: true,
      youtubePlayer: true,
      newsletter: true,
    },
    hero_text: '',
    hero_subtitle: '',
    action_button_text: '',
    action_button_link: '',
    main_photo:
      'https://images.unsplash.com/photo-1618828665347-d870c38c95c7?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFnb3N8ZW58MHx8MHx8fDA%3D',
    commissionersZone: {
      commissionerImage:
        'https://res.cloudinary.com/dirmxkznt/image/upload/v1737329627/mr.tunbosunalake214345.jpg',
      welcomeTitle: '',
      welcomeMessage: '',
      commissionerName: '',
      commissionerTitle: '',
    },

    youtubePlayer: { id: 'TSccsFXwjtI' },
  };

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
      main_photo: content.heroImage || landingPage.main_photo,
      hero_text: content.hero_text,
      hero_subtitle: content.hero_subtitle,
      action_button_text: content.action_button_text,
      commissionersZone: {
        ...landingPage.commissionersZone,
        welcomeTitle: content.welcomeTitle,
        welcomeMessage: content.welcomeMessage,
        commissionerName: content.commissionerName,
        commissionerTitle: content.commissionerTitle,
        commissionerImage:
          content.commissionerImage || landingPage.commissionersZone.commissionerImage,
      },
    };
    update(landingArea);
  };

  return (
    <div style={{ padding: '20px' }}>
      <ContentGeneratorChatbot
        onContentGenerated={handleContentGenerated}
        mdaFullName={mdaData?.mdaFullName || ''}
        mdaType="Lagos State MDA"
      />
    </div>
  );
};

export default ContentGeneratorExample;
