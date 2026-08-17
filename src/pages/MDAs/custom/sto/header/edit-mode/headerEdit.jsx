import InfoBar from '../../../custom-components/InfoBar';
import TabStripHeaderLg from '../../../../shared/header/TabStripHeader/TabStripHeaderLg';
import TabStripHeaderSm from '../../../../shared/header/TabStripHeader/TabStripHeaderSm';
import Wrapper from '../../../../shared/Wrapper/Wrapper';
import '../../../../shared/styles/style.scss';
import { useEditDataStore } from '../../../../stores/editData.store';
import { useEditModeStore } from '../../../../stores/editMode.store';
import { useThemeStore } from '../../../../stores/theme.store';
import HeaderLg from '../edit-mode/header-lg';
import HeaderSm from '../edit-mode/header-sm';
import '../header.css';

const DEFAULT_NAVBAR_STYLE = 'classic';

const HeaderEdit = ({ fullname }) => {
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const mdaData = useThemeStore((state) => state.mdaData);

  // deviceSize
  const deviceSize = useEditModeStore((state) => state.device);
  const isLargeScreen = deviceSize === 'desktop';
  const viewMode = useEditModeStore((state) => state.viewMode);
  const selectedComponent = useEditModeStore((state) => state.selectedComponent);
  const setSelectedComponent = useEditModeStore((state) => state.setSelectedComponent);

  const navbarStyle = mdaEditData?.navbarStyle || DEFAULT_NAVBAR_STYLE;

  if (navbarStyle === 'tabStrip') {
    return (
      <header className="sticky top-[0px] w-full z-4 bg-[#F5F9FA] border-b border-[#e7e7e7]">
        {isLargeScreen && (
          <InfoBar
            data={mdaEditData?.infoBar}
            fullname={fullname}
            isEdit
            viewMode={viewMode}
            selectedComponent={selectedComponent}
            onComponentClick={setSelectedComponent}
          />
        )}
        <Wrapper style={{ margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          {isLargeScreen ? (
            <TabStripHeaderLg customClass="h-[90px]" fullname={fullname} mdaData={mdaData} isEdit />
          ) : (
            <TabStripHeaderSm customClass="h-[90px]" fullname={fullname} mdaData={mdaData} isEdit />
          )}
        </Wrapper>
      </header>
    );
  }

  return (
    <header className="sticky top-[0px] w-full z-4">
      {isLargeScreen && (
        <InfoBar
          data={mdaEditData?.infoBar}
          fullname={fullname}
          isEdit
          viewMode={viewMode}
          selectedComponent={selectedComponent}
          onComponentClick={setSelectedComponent}
        />
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
