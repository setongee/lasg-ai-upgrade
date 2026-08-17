import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { getSingleCategory } from '../../../../../api/read/category.req';
import { getAllServicesCategory } from '../../../../../api/read/services.req';
import { notify } from '../../../../../utils/toast';
import { getSingleDraft } from '../../../api/admin/drafts';
import { formattedName } from '../../../api/admin/logic';
import HeroSection from '../../../shared/hero/HeroSection';
import { useEditDataStore } from '../../../stores/editData.store';
import { useEditModeStore } from '../../../stores/editMode.store';
import { useThemeStore } from '../../../stores/theme.store';
import {
  CommissionerZone,
  CoreInformation,
  CoreServices,
  DocumentShowcase,
  GalleryPreview,
  NewsletterSection,
  QuickDocuments,
  QuickServicesSection,
  Statistics,
  SupportLinks,
  UpcomingEvents,
  YoutubePlayer,
} from '../../custom-components';
import ResourceCategories from '../../../shared/resources/resource-categories/ResourceCategories';
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
        isEdit ? 'mt-0' : isMdaTypeService ? 'lg:mt-[120px] mt-[80px]' : 'lg:mt-[115px] mt-[85px]'
      }`}
      ref={componentRef}
      data-mda="health"
    >
      {/* Home */}
      {landingPage?.enabledSections?.heroSection && (
        <HeroSection
          style={landingPage?.hero_style || 'splitPhoto'}
          title={landingPage?.hero_text}
          subtitle={landingPage?.hero_subtitle}
          buttonText={landingPage?.action_button_text}
          buttonLink={landingPage?.action_button_link}
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

      {/* Quick Services */}
      {landingPage?.enabledSections?.quickServices && landingPage?.servicesData?.length > 0 && (
        <QuickServicesSection
          data={landingPage?.servicesData}
          backgroundColor={landingPage?.quickServices?.backgroundColor}
          style={landingPage?.quickServices?.style}
          ctaTitle={landingPage?.quickServices?.ctaTitle}
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
          style={landingPage?.services_style}
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
