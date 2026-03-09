import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight } from 'iconoir-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { getSingleCategory } from '../../../../../api/read/category.req';
import { getAllServicesCategory } from '../../../../../api/read/services.req';
import { notify } from '../../../../../utils/toast';
import { getSingleDraft } from '../../../api/admin/drafts';
import { formattedName } from '../../../api/admin/logic';
import Button from '../../../shared/button/Button';
import Divider from '../../../shared/divider/Divider';
import Newsletter from '../../../shared/emailLetter/Newsletter';
import QuickServices from '../../../shared/quick_services/QuickServices';
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

  const setSelectedComponent = useEditModeStore((state) => state.setSelectedComponent);
  const selectedComponent = useEditModeStore((state) => state.selectedComponent);
  const componentRef = useRef(null);
  const viewMode = useEditModeStore((state) => state.viewMode);

  const { data: services, isLoading } = useQuery({
    queryKey: ['services', mdaData?.fullname],
    queryFn: () => getAllServicesCategory(formattedName(mdaData?.fullname)),
    enabled: !!mdaData?.fullname,
  });

  const { data: icon, isLoading: iconLoading } = useQuery({
    queryKey: ['icon', mdaData?.fullname],
    queryFn: () => getSingleCategory(formattedName(mdaData?.fullname)),
    enabled: !!mdaData?.fullname,
  });

  // if (isLoading || iconLoading) return <Loader />;

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div
      className={`landingPage-version mx-auto my-0 ${isEdit ? 'mt-0' : 'mt-[115px]'}`}
      ref={componentRef}
      data-mda="health"
    >
      {/* Home */}
      {landingPage?.enabledSections?.heroSection && (
        <Wrapper customClass={``}>
          <div
            className={`home-version relative flex justify-between ${
              isEdit && viewMode === 'edit'
                ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
                : ''
            } ${selectedComponent === 'heroSection' ? '!border-green-500 active_component' : ''}`}
            onClick={
              isEdit && viewMode === 'edit' ? () => handleComponentClick('heroSection') : null
            }
          >
            <div className="text-content flex flex-col">
              <div className="main-text">{landingPage?.hero_text}</div>
              <p>{landingPage?.hero_subtitle}</p>
              <Button
                customClass="bg-[#108a00] uppercase tracking-[2px] text-white rounded-[5px] flex gap-2 text-[11px]"
                onClick={() => window.open(landingPage?.action_button_link, '_blank')}
              >
                {landingPage?.action_button_text} <ArrowUpRight />
              </Button>
            </div>
            <div className="landing-photo w-[550px] h-[600px] my-10">
              <img
                src={landingPage?.main_photo}
                alt="landing page"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Wrapper>
      )}

      {/* Quick Services */}
      {landingPage?.enabledSections?.quickServices && landingPage?.servicesData?.length > 0 && (
        <section
          className={`bg-[#e6edef] py-10 
        ${
          isEdit && viewMode === 'edit'
            ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
            : ''
        } ${selectedComponent === 'quickServices' ? '!border-green-500 active_component' : ''}`}
          onClick={
            isEdit && viewMode === 'edit' ? () => handleComponentClick('quickServices') : null
          }
        >
          <QuickServices data={landingPage?.servicesData} />
        </section>
      )}

      {/* Core Services */}
      {landingPage?.enabledSections?.services && (
        <section className="bg-[#e6edef] md:py-10 py-5 pb-10">
          <ServicesComponent data={services?.data} icon={icon} name={mdaData?.fullname} />
        </section>
      )}

      {/* Commissioner Zone */}
      {landingPage?.enabledSections?.commissionersZone && (
        <section
          className={`bg-[#fff] flex commisioners-zone md:py-[120px] py-[50px] ${
            isEdit && viewMode === 'edit'
              ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
              : ''
          } ${selectedComponent === 'commissionerZone' ? '!border-green-500 active_component' : ''}`}
          onClick={
            isEdit && viewMode === 'edit' ? () => handleComponentClick('commissionerZone') : null
          }
        >
          <Wrapper>
            <div className="flex wrapped lg:gap-[100px] gap-[30px] items-center justify-center flex-wrap lg:flex-nowrap">
              <div className="commissioner-container md:w-[600px] md:h-[580px] w-[500px] sm:h-[480px] h-[380px] relative">
                <div className="backdrop-photo w-[100%] h-[100%] sm:h-[80%] bg-[#eee]"></div>
                <div className="commissioner-image h-[calc(100%_-_20px)] w-[calc(100%_-_20px)] sm:w-[calc(100%_-_100px)] sm:h-[500px] md:w-[calc(100%_-_150px)] overflow-hidden absolute bottom-[10px] sm:bottom-0 left-[50%] transform-[translateX(-50%)]">
                  <img
                    src={landingPage?.commissionersZone?.commissionerImage}
                    alt="commissioners photo"
                    className="object-top w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="content flex flex-col w-full sm:w-[550px]">
                <div className="flex flex-col lg:gap-8 gap-5">
                  <div className="text-[24px] sm:text-[32px] md:text-[40px] font-semibold comms-title leading-[130%]">
                    {landingPage?.commissionersZone?.welcomeTitle}
                  </div>
                  <p className="leading-[180%] whitespace-pre-line">
                    {landingPage?.commissionersZone?.welcomeMessage}
                  </p>
                </div>

                <div className="font-semibold mt-5 block commissioner-name">
                  <h1>{landingPage?.commissionersZone?.commissionerName}</h1>
                  <span className="!font-normal block">
                    {landingPage?.commissionersZone?.commissionerTitle}
                  </span>
                </div>
              </div>
            </div>
          </Wrapper>
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

      {/* end of sections */}
    </div>
  );
};

export default Home;
