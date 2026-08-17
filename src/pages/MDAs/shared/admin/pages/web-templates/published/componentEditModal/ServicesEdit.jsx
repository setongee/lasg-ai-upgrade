import { ArrowRight } from 'iconoir-react';
import { useNavigate } from 'react-router';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import { useThemeStore } from '../../../../../../stores/theme.store';
import SectionTitle from './util/SectionTitle';

const SERVICES_STYLE_OPTIONS = [
  { value: 'style1', label: 'Card Grid' },
  { value: 'style2', label: 'Scroll Cards' },
];

const ServicesStylePreview = ({ style }) => {
  if (style === 'style2') {
    return (
      <div className="w-full h-full flex gap-1 p-1">
        <div className="flex-1 rounded bg-green-600" />
        <div className="flex-1 rounded bg-gray-300" />
        <div className="flex-1 rounded bg-gray-300" />
      </div>
    );
  }

  // style1
  return (
    <div className="w-full h-full grid grid-cols-3 gap-1 p-1">
      <div className="rounded bg-gray-300" />
      <div className="rounded bg-gray-300" />
      <div className="rounded bg-gray-300" />
    </div>
  );
};

const ServicesEdit = () => {
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const { slug } = useThemeStore((state) => state.mdaData);
  let navigate = useNavigate();

  const servicesStyle = mdaEditData?.services_style || 'style1';
  const setServicesStyle = (value) => {
    setMdaEditData({ ...mdaEditData, services_style: value });
  };

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      enabledSections: {
        ...mdaEditData.enabledSections,
        services: !mdaEditData.enabledSections?.services,
      },
    });
  };

  const navigateToServices = () => {
    // Navigate to services section - this would need to be implemented based on your routing
    // For now, let's assume there's a route to servicesislug && window.location.href = `/${slug}/admin/services`;
    if (slug) {
      navigate(`/${slug}/admin/services`);
    }
  };

  return (
    <div className="fixed top-[145px] left-0 w-[350px] h-[calc(100vh-145px)] bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-90">
      <SectionTitle />

      {/* Enable/Disable Toggle */}
      <div className="py-[20px] px-[30px] border-b border-gray-200 mt-[60px] bg-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Enable Section</span>
          <button
            onClick={toggleSection}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              mdaEditData.enabledSections?.services ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mdaEditData.enabledSections?.services ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Services Style Picker */}
      <div className="px-[30px] pt-[20px]">
        <p className="font-semibold text-[14px] mb-3">Services Style</p>
        <div className="grid grid-cols-2 gap-2">
          {SERVICES_STYLE_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => setServicesStyle(option.value)}
              className={`flex flex-col gap-2 p-2 rounded-lg border-2 transition-colors text-left ${
                servicesStyle === option.value
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-[50px]">
                <ServicesStylePreview style={option.value} />
              </div>
              <span className="text-[11px] font-medium text-gray-700 leading-tight">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-[30px]">
        <div className="flex flex-col gap-6">
          {/* Information Section */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3 flex-col">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-amber-400 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-amber-800 mb-2">
                  Add Services to this MDA
                </h3>
                <p className="text-sm text-amber-700 mb-5">
                  To add services to this MDA, navigate to the services section from the sidebar to
                  add services.
                </p>
                <button
                  onClick={navigateToServices}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 transition-colors mb-2"
                >
                  <ArrowRight fontSize={10} />
                  Go to Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesEdit;
