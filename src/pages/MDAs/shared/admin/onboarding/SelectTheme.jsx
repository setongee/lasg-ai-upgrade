import { ArrowLeft, CartPlus, Check, Eye } from 'iconoir-react';
import { useParams } from 'react-router';
import { updateAdminData } from '../../../api/admin/content';
import { templates as templateData } from './template-library';

const SelectTheme = ({ nextStep, prevStep, data, setSelectedTheme, selectedTheme }) => {
  const { mda } = useParams();

  const selectTheme = async (template) => {
    await updateAdminData(
      data._id,
      { theme: template.theme },
      `updated theme to - ${template.name}`
    ).then(() => {
      setSelectedTheme(template.theme);
      nextStep();
    });
  };

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
                className="w-[380px] bg-white rounded-md overflow-hidden shadow-md shadow-gray-50 cursor-pointer"
              >
                <div className="h-[202.4px] overflow-hidden bg-gray-300">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="hover:scale-108 transition-all"
                  />
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
                    {selectedTheme === template.preview_link ? (
                      <button
                        className="text-gray-500 text-[13px] cursor-pointer pr-5 px-4 py-2 rounded h-[100%] flex items-center gap-2 border border-transparent bg-green-700 text-white font-semibold"
                        onClick={() => selectTheme(template)}
                      >
                        <Check fontSize={12} /> Selected Theme
                      </button>
                    ) : (
                      <button
                        onClick={() => selectTheme(template)}
                        className="text-gray-500 text-[13px] cursor-pointer pr-5 px-4 py-2 rounded h-[100%] flex items-center gap-2 border border-transparent bg-gray-800 text-white"
                      >
                        <CartPlus fontSize={12} /> Use Template
                      </button>
                    )}

                    <button className="text-gray-500 text-[13px] cursor-pointer pr-5 px-4 py-2 rounded h-[100%] flex items-center gap-2 border border-gray-300">
                      <Eye /> Preview
                    </button>
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
