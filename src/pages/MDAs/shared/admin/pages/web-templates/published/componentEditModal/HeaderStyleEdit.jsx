import { useEditDataStore } from '../../../../../../stores/editData.store';
import SectionTitle from './util/SectionTitle';

const NAVBAR_STYLE_OPTIONS = [
  { value: 'classic', label: 'Classic' },
  { value: 'tabStrip', label: 'Tab Strip' },
];

const NavbarStylePreview = ({ style }) => {
  if (style === 'tabStrip') {
    return (
      <div className="w-full h-full flex items-center gap-0.5 p-1 bg-gray-100 rounded">
        <div className="w-3 h-3 rounded-full bg-gray-400 shrink-0" />
        <div className="flex-1" />
        <div className="w-4 h-full border-l border-gray-300" />
        <div className="w-4 h-full border-l border-gray-300" />
        <div className="w-5 h-full bg-green-600 rounded-sm ml-0.5" />
      </div>
    );
  }

  // classic
  return (
    <div className="w-full h-full flex items-center gap-1 p-1 bg-gray-100 rounded">
      <div className="w-3 h-3 rounded-full bg-gray-400 shrink-0" />
      <div className="flex-1" />
      <div className="w-4 h-1 bg-gray-400 rounded-full" />
      <div className="w-4 h-1 bg-gray-400 rounded-full" />
      <div className="w-4 h-1 bg-gray-400 rounded-full" />
    </div>
  );
};

const HeaderStyleEdit = () => {
  const { mdaEditData, setMdaEditData } = useEditDataStore();
  const navbarStyle = mdaEditData?.navbarStyle || 'classic';

  const setNavbarStyle = (value) => {
    setMdaEditData({ ...mdaEditData, navbarStyle: value });
  };

  return (
    <div className="fixed top-[145px] left-0 w-[350px] h-[calc(100vh-145px)] bg-white p-[30px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-90">
      <SectionTitle />

      <div className="pt-[20px] mt-[30px]">
        <p className="font-semibold text-[14px] mb-1">Navbar Style</p>
        <p className="text-[13px] text-gray-500 mb-3">Choose how the site navigation bar looks.</p>
        <div className="grid grid-cols-2 gap-2">
          {NAVBAR_STYLE_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => setNavbarStyle(option.value)}
              className={`flex flex-col gap-2 p-2 rounded-lg border-2 transition-colors text-left ${
                navbarStyle === option.value
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-[36px]">
                <NavbarStylePreview style={option.value} />
              </div>
              <span className="text-[11px] font-medium text-gray-700 leading-tight">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderStyleEdit;
