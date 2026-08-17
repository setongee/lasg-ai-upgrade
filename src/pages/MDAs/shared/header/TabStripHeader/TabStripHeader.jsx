import useWindowWidth from '../../../../../hooks/useWindowWidth';
import InfoBar from '../../../custom/custom-components/InfoBar';
import Wrapper from '../../Wrapper/Wrapper';
import { useThemeStore } from '../../../stores/theme.store';
import TabStripHeaderLg from './TabStripHeaderLg';
import TabStripHeaderSm from './TabStripHeaderSm';

const TabStripHeader = ({ fullname }) => {
  const width = useWindowWidth();
  const isLargeScreen = width >= 1000;
  const mdaData = useThemeStore((state) => state.mdaData);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fff] border-b border-[#e7e7e7]">
      {isLargeScreen && (
        <InfoBar data={mdaData?.landingPage?.infoBar} fullname={mdaData?.fullname} />
      )}
      <Wrapper style={{ margin: '0 auto', display: 'flex', alignItems: 'center' }}>
        {isLargeScreen ? (
          <TabStripHeaderLg customClass="h-[90px]" fullname={fullname} mdaData={mdaData} />
        ) : (
          <TabStripHeaderSm customClass="h-[90px]" fullname={fullname} mdaData={mdaData} />
        )}
      </Wrapper>
    </header>
  );
};

export default TabStripHeader;
