import { NavArrowDown } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { useEditModeStore } from '../../../../../../../stores/editMode.store';
import { useThemeStore } from '../../../../../../../stores/theme.store';

const SectionTitle = () => {
  const { selectedComponent, setSelectedComponent } = useEditModeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const landingPageData = useThemeStore((state) => state.mdaData)?.landingPage?.enabledSections;

  // Only show sections that exist in landingPageData
  const sections = landingPageData
    ? {
        heroSection: landingPageData.hasOwnProperty('heroSection') ? 'Hero Section' : null,
        quickServices: landingPageData.hasOwnProperty('quickServices') ? 'Quick Services' : null,
        commissionerZone: landingPageData.hasOwnProperty('commissionersZone')
          ? 'Commissioner Zone'
          : null,
        youtubePlayer: landingPageData.hasOwnProperty('youtubePlayer') ? 'Youtube Player' : null,
        services: landingPageData.hasOwnProperty('services') ? 'Services' : null,
        resourceCategories: landingPageData.hasOwnProperty('resourceCategories')
          ? 'Resource Categories'
          : null,
        quickDocuments: landingPageData.hasOwnProperty('quickDocuments') ? 'Quick Documents' : null,
        statistics: landingPageData.hasOwnProperty('statistics') ? 'Statistics' : null,
        supportLinks: landingPageData.hasOwnProperty('supportLinks') ? 'Support Links' : null,
        coreInformation: landingPageData.hasOwnProperty('coreInformation')
          ? 'Core Information'
          : null,
      }
    : {};

  // Filter out null values (sections that don't exist in landingPageData)
  const activeSections = Object.entries(sections).filter(([key, value]) => value !== null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Scroll to the active component whenever selectedComponent changes
  useEffect(() => {
    if (selectedComponent) {
      const sectionElement = document.querySelector('.active_component');
      if (sectionElement) {
        sectionElement.style.scrollMarginTop = '125px';
        sectionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }, [selectedComponent]);

  const handleSectionSelect = (section) => {
    setSelectedComponent(section);
    setIsDropdownOpen(false);
  };

  return (
    <div className="text-[14px] flex items-center gap-1 mb-6 fixed top-[145px] left-[280px] w-[350px] bg-white z-10 px-[30px] py-[20px] border-b border-gray-200">
      <div className="flex gap-1">
        <span className="text-gray-400">Landing Page / </span>
        <span className="font-medium"> {sections[selectedComponent] || 'Select Section'}</span>
      </div>

      <div className="relative ml-auto">
        <button
          type="button"
          className="flex items-center gap-1 font-medium hover:text-green-600 focus:outline-none"
          onClick={toggleDropdown}
        >
          <NavArrowDown
            className={`transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 mt-2 w-60 rounded-[6px] shadow-lg bg-white border border-gray-100">
            <div className="" role="menu" aria-orientation="vertical">
              {activeSections.map(([key, value]) => (
                <button
                  key={key}
                  className={`block w-full text-left px-4 py-2.5 text-sm ${
                    selectedComponent === key
                      ? 'bg-[#d8e9e370] text-green-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleSectionSelect(key)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionTitle;
