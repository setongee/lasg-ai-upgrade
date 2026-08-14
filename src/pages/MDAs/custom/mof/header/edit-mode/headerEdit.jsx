import InfoBar from '../../../custom-components/InfoBar';
import Wrapper from '../../../../shared/Wrapper/Wrapper';
import '../../../../shared/styles/style.scss';
import { useEditDataStore } from '../../../../stores/editData.store';
import { useEditModeStore } from '../../../../stores/editMode.store';
import HeaderLg from '../edit-mode/header-lg';
import HeaderSm from '../edit-mode/header-sm';
import '../header.css';

const HeaderEdit = ({ fullname }) => {
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);

  // deviceSize
  const deviceSize = useEditModeStore((state) => state.device);
  const isLargeScreen = deviceSize === 'desktop';
  const viewMode = useEditModeStore((state) => state.viewMode);
  const selectedComponent = useEditModeStore((state) => state.selectedComponent);
  const setSelectedComponent = useEditModeStore((state) => state.setSelectedComponent);

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
      </div>
    </header>
  );
};

export default HeaderEdit;
