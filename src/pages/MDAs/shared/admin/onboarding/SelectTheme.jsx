import { ArrowLeft, CartPlus, Check, Eye } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { frontend_url } from '../../../../../api/read/environment';
import { updateAdminData } from '../../../api/admin/content';
import { useThemeStore } from '../../../stores/theme.store';
import { templates as templateData } from './template-library';

const SelectTheme = ({ nextStep, prevStep, data, setSelectedTheme, selectedTheme }) => {
  const { mda } = useParams();
  const mdaTheme = useThemeStore((s) => s.mdaData)?.theme;
  const [currentTheme, setCurrentTheme] = useState(selectedTheme || mdaTheme);

  // Get the current template data based on theme
  const currentTemplate = templateData.find((template) => template.theme === currentTheme);

  useEffect(() => {
    // Update current theme when mdaTheme changes (for returning users)
    if (mdaTheme && !selectedTheme) {
      setCurrentTheme(mdaTheme);
    }
  }, [mdaTheme, selectedTheme]);

  const selectTheme = async (template) => {
    await updateAdminData(
      data._id,
      { theme: template.theme },
      `updated theme to - ${template.name}`
    ).then(() => {
      setSelectedTheme(template.theme);
      setCurrentTheme(template.theme);
      nextStep();
    });
  };

  useEffect(() => {}, []);

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-16 relative">
        <div onClick={prevStep} className="cursor-pointer">
          <ArrowLeft />
        </div>
        <h1 className="text-[21px] font-semibold absolute left-1/2 -translate-x-1/2 mt-[2px]">
          Select preffered Theme
        </h1>
      </div>

      <div className="templates-grid flex flex-wrap gap-10 justify-center w-[1220px] mt-10">
        {templateData.length > 0
          ? templateData.map((template) => (
              // templates ui card
              <div
                key={template.name}
                className={`w-[380px] bg-white rounded-md overflow-hidden shadow-md shadow-gray-50 cursor-pointer transition-all ${
                  currentTheme === template.theme ? 'ring-2 ring-green-500 shadow-lg' : ''
                }`}
              >
                <div className="h-[202.4px] overflow-hidden bg-gray-300 relative">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="hover:scale-108 transition-all w-full h-full object-cover"
                  />
                  {currentTheme === template.theme && (
                    <div className="absolute flex top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-[13px] items-center gap-1 font-semibold">
                      <Check fontSize={12} /> Selected
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <h3 className="font-semibold text-[16px] flex items-center gap-2">
                    {template.name}{' '}
                    <p className="text-[12px] bg-green-500 px-1.5 py-[2px] rounded text-white">
                      New
                    </p>
                  </h3>
                  <p className="text-[15px] text-gray-500 leading-6">{template.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {currentTheme === template.theme ? (
                      <button
                        className="text-white text-[13px] cursor-pointer pr-5 px-4 py-2 rounded h-[100%] flex items-center gap-2 border border-green-600 bg-green-600 font-semibold"
                        onClick={() => nextStep()}
                      >
                        <Check fontSize={12} /> Continue with this Theme
                      </button>
                    ) : template.theme === 'coming' ? (
                      <div className="text-gray-500 text-[13px] px-4 py-2 rounded border border-gray-300 bg-gray-50 font-medium">
                        Coming Soon
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => selectTheme(template)}
                          className="text-white text-[13px] cursor-pointer pr-5 px-4 py-2 rounded h-[100%] flex items-center gap-2 border border-transparent bg-gray-800 hover:bg-gray-700"
                        >
                          <CartPlus fontSize={12} /> Use Template
                        </button>
                        <a
                          href={`${frontend_url}/${template.preview_link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 text-[13px] cursor-pointer pr-5 px-4 py-2 rounded h-[100%] flex items-center gap-2 border border-gray-300 hover:bg-gray-50 transition-colors text-gray-500!"
                        >
                          <Eye /> Preview
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default SelectTheme;
