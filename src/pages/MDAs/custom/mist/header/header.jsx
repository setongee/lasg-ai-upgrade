import useWindowWidth from '../../../../../hooks/useWindowWidth';
import '../../../shared/styles/style.scss';
import Wrapper from '../../../shared/Wrapper/Wrapper';
import { useThemeStore } from '../../../stores/theme.store';
import HeaderLg from './header-lg';
import HeaderSm from './header-sm';
import './header.css';

const Header = ({ fullname }) => {
  const width = useWindowWidth();
  const info = '🚀 We just launched our new website, Enjoy the new v2.0 experience';
  const isLargeScreen = width >= 1000;
  const mdaData = useThemeStore((state) => state.mdaData);

  return (
    <header className="fixed top-0 w-full z-50">
      {isLargeScreen && (
        <div className="info-banner flex justify-center bg-[#1c3f3a]">
          <Wrapper customClass="flex justify-center py-[12px] uppercase text-[10px] tracking-[2px] text-[#f0ead2]">
            <p>{info}</p>
          </Wrapper>
        </div>
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
