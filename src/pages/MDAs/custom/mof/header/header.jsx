import useWindowWidth from '../../../../../hooks/useWindowWidth';
import '../../../shared/styles/style.scss';
import Wrapper from '../../../shared/Wrapper/Wrapper';
import { useEditModeStore } from '../../../stores/editMode.store';
import HeaderLg from './header-lg';
import HeaderSm from './header-sm';
import './header.css';

const Header = ({ fullname, isEdit }) => {
  const width = useWindowWidth();
  const info = '🚀 We just launched our new website, Enjoy the new v2.0 experience';
  const viewMode = useEditModeStore((s) => s.viewMode);
  const setSelectedComponent = useEditModeStore((state) => state.setSelectedComponent);

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  const isLargeScreen = width >= 1000;

  return (
    <header className="fixed top-0 w-full z-50">
      {isLargeScreen && (
        <div className="info-banner flex justify-center bg-[#1c3f3a]">
          <Wrapper customClass="flex justify-center py-[8px] uppercase text-[10px] tracking-[2px] text-[#f0ead2]">
            <p>{info}</p>
          </Wrapper>
        </div>
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
            <HeaderLg customClass="h-[80px]" fullname={fullname} />
          ) : (
            <HeaderSm customClass="h-[80px]" fullname={fullname} />
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
