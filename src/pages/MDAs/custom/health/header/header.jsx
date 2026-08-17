import useWindowWidth from '../../../../../hooks/useWindowWidth';
import InfoBar from '../../custom-components/InfoBar';
import TabStripHeader from '../../../shared/header/TabStripHeader/TabStripHeader';
import '../../../shared/styles/style.scss';
import Wrapper from '../../../shared/Wrapper/Wrapper';
import { useThemeStore } from '../../../stores/theme.store';
import HeaderLg from './header-lg';
import HeaderSm from './header-sm';
import './header.css';

const Header = ({ fullname }) => {
  const width = useWindowWidth();
  const isLargeScreen = width >= 1000;
  const mdaData = useThemeStore((state) => state.mdaData);
  const navbarStyle = mdaData?.landingPage?.navbarStyle || 'classic';

  if (navbarStyle === 'tabStrip') {
    return <TabStripHeader fullname={fullname} />;
  }

  return (
    <header className="fixed top-0 w-full z-50">
      {isLargeScreen && (
        <InfoBar data={mdaData?.landingPage?.infoBar} fullname={mdaData?.fullname} />
      )}

      <div className="glass-card">
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
      </div>
    </header>
  );
};

export default Header;
