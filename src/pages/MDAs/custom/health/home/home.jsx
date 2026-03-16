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
import Wrapper from '../../../shared/Wrapper/Wrapper';
import { useEditDataStore } from '../../../stores/editData.store';
import { useEditModeStore } from '../../../stores/editMode.store';
import { useThemeStore } from '../../../stores/theme.store';
import {
  CommissionerZone,
  CoreInformation,
  CoreServices,
  NewsletterSection,
  QuickServicesSection,
  YoutubePlayer,
} from '../../custom-components';
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

  const isMdaTypeService = mdaData?.type === 'service';

  return (
    <div
      className={`landingPage-version mx-auto my-0 ${
        isEdit ? 'mt-0' : isMdaTypeService ? 'lg:mt-[120px] mt-[80px]' : 'lg:mt-[180px] mt-[115px]'
      }`}
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
        <QuickServicesSection
          data={landingPage?.servicesData}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Core Services */}
      {landingPage?.enabledSections?.services && (
        <CoreServices
          data={services?.data}
          mdaName={mdaData?.fullname}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Commissioner Zone */}
      {landingPage?.enabledSections?.commissionersZone && (
        <CommissionerZone
          data={landingPage?.commissionersZone}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Core Information Cards */}
      {landingPage?.enabledSections?.coreInformation && (
        <CoreInformation
          data={landingPage?.coreInformation}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Youtube Component */}
      {landingPage?.enabledSections?.youtubePlayer && (
        <YoutubePlayer
          data={landingPage?.youtubePlayer}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Newsletter */}
      {landingPage?.enabledSections?.newsletter && (
        <NewsletterSection
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* end of sections */}
    </div>
  );
};

export default Home;
