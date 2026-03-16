import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'iconoir-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { getAllServicesCategory } from '../../../../../api/read/services.req';
import { notify } from '../../../../../utils/toast';
import { getSingleDraft } from '../../../api/admin/drafts';
import { formattedName } from '../../../api/admin/logic';
import Divider from '../../../shared/divider/Divider';
import Newsletter from '../../../shared/emailLetter/Newsletter';
import ServicesComponent from '../../../shared/services/style1/ServicesComponent';
import Wrapper from '../../../shared/Wrapper/Wrapper';
import YoutubeSocials from '../../../shared/youtubePlayer/YoutubeSocials';
import { useEditDataStore } from '../../../stores/editData.store';
import { useEditModeStore } from '../../../stores/editMode.store';
import { useThemeStore } from '../../../stores/theme.store';
import './home.css';

const Home = ({ isEdit }) => {
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const mdaData = useThemeStore((state) => state.mdaData);

  const [landingPage, setLandingPage] = useState(mdaData?.landingPage);
  const isFetchingDraft = useRef(false);

  const { mda, page, id } = useParams();

  const getDraft = async () => {
    if (isFetchingDraft.current) return;
    isFetchingDraft.current = true;

    await getSingleDraft(id)
      .then((response) => setLandingPage(response?.data))
      .catch(() => {
        notify.error('Draft could not be retrieved or has been deleted!');
        setTimeout(() => {
          window.location.href = `/${mda}`;
        }, 2000);
      })
      .finally(() => {
        isFetchingDraft.current = false;
      });
  };

  useEffect(() => {
    if (page === 'draft') {
      getDraft();
    }
  }, []);

  useEffect(() => {
    if (isEdit) {
      setLandingPage(mdaEditData);
    } else {
      setLandingPage(mdaData?.landingPage);
    }
  }, [mdaData, mdaEditData, isEdit]);

  const selectedComponent = useEditModeStore((state) => state.selectedComponent);
  const componentRef = useRef(null);
  const viewMode = useEditModeStore((state) => state.viewMode);
  const setSelectedComponent = useEditModeStore((state) => state.setSelectedComponent);

  const { data: services, isLoading } = useQuery({
    queryKey: ['services', mdaData?.fullname],
    queryFn: () => getAllServicesCategory(formattedName(mdaData?.fullname)),
    enabled: !!mdaData?.fullname,
  });

  // if (isLoading || iconLoading) return <Loader />;

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  const isMdaTypeService = mdaData?.type === 'service';

  return (
    <div
      data-mda="mof"
      className={`landingPage-version mx-auto my-0 ${
        isEdit ? 'mt-0' : isMdaTypeService ? 'lg:mt-[110px] mt-[80px]' : 'mt-0]'
      }`}
      ref={componentRef}
    >
      {/* Home */}
      {landingPage?.enabledSections?.heroSection && (
        <div customClass={``}>
          <div
            className={`home-hero-section relative ${
              isEdit && viewMode === 'edit'
                ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
                : ''
            } ${selectedComponent === 'heroSection' ? '!border-green-500 active_component' : ''}`}
            onClick={
              isEdit && viewMode === 'edit' ? () => handleComponentClick('heroSection') : null
            }
          >
            {/* Background image overlay */}
            <div className="hero-background">
              <img src={landingPage?.main_photo} alt="landing page background" draggable={false} />
            </div>

            <Wrapper>
              {/* Content */}
              <div className="hero-content">
                <div className="hero-title">{landingPage?.hero_text}</div>
                <p className="hero-description">{landingPage?.hero_subtitle}</p>
                <div
                  className="hero-button"
                  onClick={() => window.open(landingPage?.action_button_link, '_blank')}
                >
                  {landingPage?.action_button_text} <ArrowRight width={18} />
                </div>
              </div>
            </Wrapper>
          </div>
        </div>
      )}

      {/* Core MDA specific services */}
      {landingPage?.enabledSections?.services && (
        <section className="bg-[#e6edef] md:py-20 py-16 pb-10">
          <ServicesComponent data={services?.data} name={mdaData?.fullname} />
        </section>
      )}

      {/* Youtube Component */}
      {landingPage?.enabledSections?.youtubePlayer && (
        <section
          className={`${
            isEdit && viewMode === 'edit'
              ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
              : ''
          } ${selectedComponent === 'youtubePlayer' ? '!border-green-500 active_component' : ''}`}
          onClick={
            isEdit && viewMode === 'edit' ? () => handleComponentClick('youtubePlayer') : null
          }
        >
          <Wrapper>
            <Divider customClass="sm:mb-[80px] mb-[40px]" />
            <YoutubeSocials id={landingPage?.youtubePlayer?.id} viewMode={viewMode} />
          </Wrapper>
        </section>
      )}

      {/* Newsletter */}
      {landingPage?.enabledSections?.newsletter && (
        <Wrapper>
          <Newsletter />
        </Wrapper>
      )}
    </div>
  );
};

export default Home;
