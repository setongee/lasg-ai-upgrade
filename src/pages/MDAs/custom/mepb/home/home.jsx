import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { getAllServicesCategory } from '../../../../../api/read/services.req';
import { notify } from '../../../../../utils/toast';
import { getSingleDraft } from '../../../api/admin/drafts';
import { formattedName } from '../../../api/admin/logic';
import Divider from '../../../shared/divider/Divider';
import Newsletter from '../../../shared/emailLetter/Newsletter';
import HeroSection from '../../../shared/hero/HeroSection';
import {
  CommissionerZone,
  CoreInformation,
  DocumentShowcase,
  QuickDocuments,
  Statistics,
  SupportLinks,
} from '../../custom-components';
import GalleryPreview from '../../custom-components/GalleryPreview';
import UpcomingEvents from '../../custom-components/UpcomingEvents';
import QuickServices from '../../../shared/quick_services/QuickServices';
import ResourceCategories from '../../../shared/resources/resource-categories/ResourceCategories';
import ServicesSection from '../../../shared/services/ServicesSection';
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
      .then((response) => {
        if (response?.data) {
          setLandingPage(response.data);
        } else {
          notify.error('Draft could not be retrieved or has been deleted!');
          setTimeout(() => {
            window.location.href = `/${mda}`;
          }, 2000);
        }
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

  // if (isLoading || iconLoading) return <Loader />;

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div
      data-mda="mepb"
      className={`landingPage-version mx-auto my-0 ${isEdit ? 'mt-0' : 'lg:mt-[120px] mt-[120px]'}`}
      ref={componentRef}
    >
      {/* Home */}
      {landingPage?.enabledSections?.heroSection && (
        <HeroSection
          style={landingPage?.hero_style || 'splitPhoto'}
          title={landingPage?.hero_text}
          subtitle={landingPage?.hero_subtitle}
          buttonText={landingPage?.action_button_text}
          buttonLink={landingPage?.action_button_link || '#quickdocsContainder'}
          images={landingPage?.hero_images}
          legacyImage={landingPage?.main_photo}
          secondaryImage={landingPage?.secondary_photo}
          slideshowEnabled={!!landingPage?.hero_slideshow}
          bgType={landingPage?.hero_bg_type}
          bgColor={landingPage?.hero_bg_color}
          bgGradient={landingPage?.hero_bg_gradient}
          isEdit={isEdit}
          viewMode={viewMode}
          isSelected={selectedComponent === 'heroSection'}
          onSelect={() => handleComponentClick('heroSection')}
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

      {/* Statistics */}
      {landingPage?.enabledSections?.statistics && (
        <Statistics
          data={landingPage?.statistics}
          style={landingPage?.statistics_style}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Quick Documents */}
      {landingPage?.enabledSections?.quickDocuments && (
        <QuickDocuments
          data={landingPage?.quickDocuments}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Document Showcase */}
      {landingPage?.enabledSections?.documentShowcase && (
        <DocumentShowcase
          data={landingPage?.documentShowcase}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Quick Services */}
      {landingPage?.enabledSections?.quickServices && landingPage?.servicesData?.length > 0 && (
        <section
          style={{
            backgroundColor:
              landingPage?.quickServices?.backgroundColor || 'var(--theme-section-bg, #f9f9f9)',
          }}
          className={`mt-20 py-10
              ${
                isEdit && viewMode === 'edit'
                  ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
                  : ''
              } ${selectedComponent === 'quickServices' ? '!border-green-500 active_component' : ''}`}
          onClick={
            isEdit && viewMode === 'edit' ? () => handleComponentClick('quickServices') : null
          }
        >
          <QuickServices
            data={landingPage?.servicesData}
            style={landingPage?.quickServices?.style}
            ctaTitle={landingPage?.quickServices?.ctaTitle}
          />
        </section>
      )}

      {/* Resource Categories */}
      {landingPage?.enabledSections?.resourceCategories && (
        <section
          className={`mt-[80px] ${
            isEdit && viewMode === 'edit'
              ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
              : ''
          } ${selectedComponent === 'resourceCategories' ? '!border-green-500 active_component' : ''}`}
          onClick={
            isEdit && viewMode === 'edit' ? () => handleComponentClick('resourceCategories') : null
          }
        >
          <ResourceCategories
            data={landingPage?.resourceCategories}
            isEdit={isEdit}
            mda={mda}
            type="component"
          />
        </section>
      )}

      {/* Services */}
      {landingPage?.enabledSections?.services && (
        <section className="bg-[#e6edef] md:py-20 py-5 pb-10">
          <ServicesSection
            style={landingPage?.services_style}
            data={services?.data}
            name={mdaData?.fullname}
          />
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

      {/* Gallery Preview */}
      {/* {landingPage?.enabledSections?.galleryPreview !== false && (
        <GalleryPreview
          backgroundColor={landingPage?.galleryPreview?.backgroundColor}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )} */}

      {/* Upcoming Events */}
      {/* {landingPage?.enabledSections?.upcomingEvents !== false && (
        <UpcomingEvents
          backgroundColor={landingPage?.upcomingEvents?.backgroundColor}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )} */}

      {/* Support Links */}
      {landingPage?.enabledSections?.supportLinks && (
        <SupportLinks
          data={landingPage?.supportLinks}
          backgroundColor={landingPage?.supportLinksSettings?.backgroundColor}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
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
