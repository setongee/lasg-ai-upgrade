import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight } from 'iconoir-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getAllServicesCategory } from '../../../../../api/read/services.req';
import { notify } from '../../../../../utils/toast';
import { getSingleDraft } from '../../../api/admin/drafts';
import { formattedName } from '../../../api/admin/logic';
import Button from '../../../shared/button/Button';
import Divider from '../../../shared/divider/Divider';
import Newsletter from '../../../shared/emailLetter/Newsletter';
import QuickServices from '../../../shared/quick_services/QuickServices';
import ResourceCategories from '../../../shared/resources/resource-categories/ResourceCategories';
import ServicesComponent from '../../../shared/services/style1/ServicesComponent';
import Wrapper from '../../../shared/Wrapper/Wrapper';
import YoutubeSocials from '../../../shared/youtubePlayer/YoutubeSocials';
import { useEditDataStore } from '../../../stores/editData.store';
import { useEditModeStore } from '../../../stores/editMode.store';
import { useThemeStore } from '../../../stores/theme.store';
import QuickDocumentsDummy from './dummy/QuickDocuments';
import StatisticsDummy from './dummy/Statistics';
import './home.css';

const Home = ({ isEdit }) => {
  const navigate = useNavigate();
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
        <div customClass={``}>
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
            {/* Decorative lines from v1 design */}
            <div className="lines line_a"></div>
            <div className="lines line_b"></div>
            <div className="lines line_c"></div>
            <div className="lines line_d"></div>
            <div className="lines line_e"></div>
            <div className="lines line_f"></div>

            <Wrapper customClass={''}>
              <div className="text-content flex flex-col">
                <div className="main-text">{landingPage?.hero_text}</div>
                <p>{landingPage?.hero_subtitle}</p>
                <Button
                  customClass="bg-[#90ee90] uppercase tracking-[2px] text-[#131313] rounded-[5px] flex gap-2 text-[11px] hover:opacity-90 transition-opacity"
                  action={() => (window.location.href = '#quickdocsContainder')}
                >
                  {landingPage?.action_button_text} <ArrowUpRight />
                </Button>
              </div>
            </Wrapper>
          </div>
        </div>
      )}

      {/* Budget Statistics */}
      {landingPage?.enabledSections?.statistics && (
        <section
          className={`budget-statistics bg-[#fff] py-4 ${
            isEdit && viewMode === 'edit'
              ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
              : ''
          } ${selectedComponent === 'statistics' ? '!border-green-500 active_component' : ''}`}
          onClick={isEdit && viewMode === 'edit' ? () => handleComponentClick('statistics') : null}
        >
          <Wrapper>
            <div className="budgetting flex">
              {landingPage?.statistics?.items?.map((statistic, index) => (
                <React.Fragment key={index}>
                  <div className="budget__card">
                    <div className="tiny">{statistic.label || 'Statistic Label'}</div>
                    <p>{statistic.value || 'Value'}</p>
                  </div>
                  {index < landingPage.statistics.items.length - 1 && (
                    <div className="divider"></div>
                  )}
                </React.Fragment>
              )) || <StatisticsDummy />}
            </div>
          </Wrapper>
        </section>
      )}

      {/* Quick Documents */}
      {landingPage?.enabledSections?.quickDocuments && (
        <section
          id="quickdocsContainder"
          className={`quick-documents ${
            isEdit && viewMode === 'edit'
              ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
              : ''
          } ${selectedComponent === 'quickDocuments' ? '!border-green-500 active_component' : ''}`}
          onClick={
            isEdit && viewMode === 'edit' ? () => handleComponentClick('quickDocuments') : null
          }
        >
          <Wrapper>
            <div className="quickLinksPoint" id="quickdocs">
              <div className="pointB">
                <div className="topic leading-[132%]">
                  {landingPage?.quickDocuments?.title ||
                    'Access Lagos State Budgets, Statistics, and Development Plans.'}
                  <div className="sub">
                    {landingPage?.quickDocuments?.subtitle ||
                      'Empowering informed decisions with accessible data, budget transparency, and strategic planning for Lagos.'}
                  </div>
                  <Button
                    customClass="bg-[#1C3F3A] leading-[100%] items-center text-white uppercase tracking-[2px] text-[11px] rounded-[5px] flex gap-2 hover:opacity-90 transition-opacity"
                    action={() => !isEdit && navigate(`/${mda}/resources/`)}
                  >
                    {landingPage?.quickDocuments?.discoverMoreText || 'Discover More'}{' '}
                    <ArrowUpRight />
                  </Button>
                </div>
                <div className="pointA">
                  <div className="docs">
                    {landingPage?.quickDocuments?.documents?.map((doc, index) => (
                      <a key={index} href={doc.link} download>
                        {doc.title}
                      </a>
                    )) || <QuickDocumentsDummy />}
                  </div>
                </div>
              </div>
            </div>
          </Wrapper>
        </section>
      )}

      {/* Quick Services */}
      {landingPage?.enabledSections?.quickServices && landingPage?.servicesData?.length > 0 && (
        <section
          className={`bg-[#f9f9f9] mt-20 py-10 
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
