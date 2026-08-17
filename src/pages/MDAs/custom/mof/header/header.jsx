import useWindowWidth from '../../../../../hooks/useWindowWidth';
import InfoBar from '../../custom-components/InfoBar';
import TabStripHeader from '../../../shared/header/TabStripHeader/TabStripHeader';
import '../../../shared/styles/style.scss';
import Wrapper from '../../../shared/Wrapper/Wrapper';
import { useEditModeStore } from '../../../stores/editMode.store';
import { useThemeStore } from '../../../stores/theme.store';
import HeaderLg from './header-lg';
import HeaderSm from './header-sm';
import './header.css';

const Header = ({ fullname, isEdit }) => {
  const width = useWindowWidth();
  const viewMode = useEditModeStore((s) => s.viewMode);
  const selectedComponent = useEditModeStore((state) => state.selectedComponent);
  const setSelectedComponent = useEditModeStore((state) => state.setSelectedComponent);
  const mdaData = useThemeStore((state) => state.mdaData);
  const navbarStyle = mdaData?.landingPage?.navbarStyle || 'classic';

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  const isLargeScreen = width >= 1000;

  if (navbarStyle === 'tabStrip') {
    return <TabStripHeader fullname={fullname} />;
  }

  return (
    <header className="fixed top-0 w-full z-50">
      {isLargeScreen && (
        <InfoBar
          data={mdaData?.landingPage?.infoBar}
          fullname={mdaData?.fullname}
          isEdit={isEdit}
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={handleComponentClick}
        />
      )}
      <div className="bg-green-700 text-white!">
        <Wrapper
          style={{
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isLargeScreen ? (
            <HeaderLg customClass="h-[80px]" fullname={fullname} mdaData={mdaData} />
          ) : (
            <HeaderSm customClass="h-[80px]" fullname={fullname} mdaData={mdaData} />
          )}
        </Wrapper>

        {/* check if enabled */}
        {/* <div
          className="bg-green-900 py-3"
          onClick={
            isEdit && viewMode === 'edit' ? () => handleComponentClick('supportLinks') : null
          }
        >
          <Wrapper>
            <div className="flex gap-4 items-center justify-end">
              <a
                href="#"
                className="flex items-center gap-1 uppercase text-[11px] font-normal tracking-[2px]"
              >
                Land Use Charge <ArrowUpRight fontSize={10} />
              </a>

              <div className="bg-gray-200 h-[12px] w-[1px]"></div>
            </div>
          </Wrapper>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
