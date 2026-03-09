import Wrapper from '../../../../shared/Wrapper/Wrapper';
import '../../../../shared/styles/style.scss';
import { useEditModeStore } from '../../../../stores/editMode.store';
import HeaderLg from '../edit-mode/header-lg';
import HeaderSm from '../edit-mode/header-sm';
import '../header.css';

const HeaderEdit = ({ fullname }) => {
  const info = '🚀 We just launched our new website, Enjoy the new v2.0 experience';

  // deviceSize
  const deviceSize = useEditModeStore((state) => state.device);
  const isLargeScreen = deviceSize === 'desktop';

  return (
    <header className="sticky top-[0px] w-full z-10">
      {isLargeScreen && (
        <div className="info-banner flex justify-center bg-[#1c3f3a]">
          <Wrapper customClass="flex justify-center py-[12px] uppercase text-[10px] tracking-[2px] text-[#f0ead2]">
            <p>{info}</p>
          </Wrapper>
        </div>
      )}

      <div className="bg-white border-b border-[#eee]">
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
      </div>
    </header>
  );
};

export default HeaderEdit;
