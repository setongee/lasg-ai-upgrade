import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { getSingleCategory } from '../../../../../api/read/category.req';
import { getAllServicesCategory } from '../../../../../api/read/services.req';
import { notify } from '../../../../../utils/toast';
import { getSingleDraft } from '../../../api/admin/drafts';
import { formattedName } from '../../../api/admin/logic';
import { themeInitialData } from '../../../shared/admin/components/chatbot/theme-initial-data';
import HeroSection from '../../../shared/hero/HeroSection';
import ResourceCategories from '../../../shared/resources/resource-categories/ResourceCategories';
import { useEditDataStore } from '../../../stores/editData.store';
import { useEditModeStore } from '../../../stores/editMode.store';
import { useThemeStore } from '../../../stores/theme.store';
import {
  CommissionerZone,
  CoreInformation,
  CoreServices,
  DocumentShowcase,
  NewsletterSection,
  QuickDocuments,
  QuickServicesSection,
  Statistics,
  SupportLinks,
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

  const { data: services } = useQuery({
    queryKey: ['services', mdaData?.fullname],
    queryFn: () => getAllServicesCategory(formattedName(mdaData?.fullname)),
    enabled: !!mdaData?.fullname,
  });

  useQuery({
    queryKey: ['icon', mdaData?.fullname],
    queryFn: () => getSingleCategory(formattedName(mdaData?.fullname)),
    enabled: !!mdaData?.fullname,
  });

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  const isMdaTypeService = mdaData?.type === 'service';

  // Fall back to the theme defaults when this MDA's landing page was never seeded
  // (e.g. onboarded before mot had its own theme-initial-data entry).
  const enabledSections = landingPage?.enabledSections ?? themeInitialData.mot.enabledSections;

  return (
    <div
      className={`landingPage-version mx-auto my-0 ${
        isEdit ? 'mt-0' : isMdaTypeService ? 'lg:mt-[120px] mt-[80px]' : 'lg:mt-[115px] mt-[85px]'
      }`}
      ref={componentRef}
      data-mda="mot"
    >
      {/* Hero */}
      {enabledSections?.heroSection && (
        <HeroSection
          style={landingPage?.hero_style || 'splitCircleFloating'}
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
      {enabledSections?.statistics && (
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
      {enabledSections?.quickDocuments && (
        <QuickDocuments
          data={landingPage?.quickDocuments}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Quick Services */}
      {enabledSections?.quickServices && landingPage?.servicesData?.length > 0 && (
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
      {enabledSections?.services && (
        <CoreServices
          data={services?.data}
          mdaName={mdaData?.fullname}
          style={landingPage?.services_style || 'style2'}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Commissioner Zone */}
      {enabledSections?.commissionersZone && (
        <CommissionerZone
          data={landingPage?.commissionersZone}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Core Information Cards */}
      {enabledSections?.coreInformation && (
        <CoreInformation
          data={landingPage?.coreInformation}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Resource Categories */}
      {enabledSections?.resourceCategories && (
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
      {enabledSections?.documentShowcase && (
        <DocumentShowcase
          data={landingPage?.documentShowcase}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Youtube Component */}
      {enabledSections?.youtubePlayer && (
        <YoutubePlayer
          data={landingPage?.youtubePlayer}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}

      {/* Support Links */}
      {enabledSections?.supportLinks && (
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
      {enabledSections?.newsletter && (
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
