import { useState } from 'react';
import { updateAdminData } from '../../../../../api/admin/content';
import { useThemeStore } from '../../../../../stores/theme.store';
import ThemeColorPicker from '../../../../colorPicker/ThemeColorPicker';
import { deriveThemeVars } from '../../../../utils/colorTheme';

const Appearance = () => {
  const mdaData = useThemeStore((state) => state.mdaData);
  const refetchData = useThemeStore((state) => state.refetchData);

  const [colorTheme, setColorTheme] = useState(
    mdaData?.colorTheme?.color
      ? mdaData.colorTheme
      : { mode: 'preset', color: '', gradientEnd: '', appearance: 'light' }
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const vars = deriveThemeVars(colorTheme);

  const handleChange = (next) => {
    setColorTheme(next);
    setIsDirty(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    updateAdminData(mdaData._id, { colorTheme }, 'updated the site color theme')
      .then(() => {
        setIsDirty(false);
        refetchData?.();
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="max-w-[900px] mx-auto py-10 px-6">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-gray-900">Site Theme</h1>
        <p className="text-[14px] text-gray-500 mt-1">
          Pick a color and an appearance for your site. In Light mode, backgrounds stay light with
          dark text; in Dark mode, backgrounds go dark with light text — except sections where
          you've manually set a background color. Buttons, CTAs, the newsletter box, and the
          footer greeting will use the color itself.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[10px] border border-gray-100 p-6">
          <ThemeColorPicker value={colorTheme} onChange={handleChange} />
        </div>

        <div
          className="rounded-[10px] border border-gray-100 p-6"
          style={{ backgroundColor: vars.pageBg }}
        >
          <span className="text-[13px] font-medium block mb-3" style={{ color: vars.pageText }}>
            Preview
          </span>

          <div
            className="rounded-[10px] p-6 flex flex-col gap-4"
            style={{ background: vars.gradientCss || vars.sectionBg }}
          >
            <div>
              <div className="text-[15px] font-semibold" style={{ color: vars.pageText }}>
                Section heading
              </div>
              <p className="text-[13px] mt-1 opacity-70" style={{ color: vars.pageText }}>
                This is what a section background looks like with your chosen color and
                appearance.
              </p>
            </div>

            <button
              type="button"
              className="self-start px-4 py-2 rounded-[5px] text-[13px] font-medium uppercase tracking-[1px]"
              style={{ backgroundColor: vars.accent, color: vars.accentText }}
            >
              Call to Action
            </button>
          </div>

          <div
            className="rounded-[10px] p-5 mt-4 flex items-center justify-between gap-4"
            style={{ backgroundColor: vars.accent }}
          >
            <span className="text-[13px] font-medium" style={{ color: vars.accentText }}>
              Subscribe to our newsletter
            </span>
            <button
              type="button"
              className="px-4 py-2 rounded-[5px] text-[12px] font-medium text-white shrink-0"
              style={{ backgroundColor: vars.shade }}
            >
              Subscribe
            </button>
          </div>

          <div className="mt-4 text-[13px] opacity-70" style={{ color: vars.pageText }}>
            Lagos, <span style={{ color: vars.accent, fontWeight: 600 }}>good afternoon</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className={`px-6 py-3 rounded-[5px] text-[13px] font-medium uppercase tracking-[1px] text-white ${
            !isDirty || isSaving ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Theme'}
        </button>
      </div>
    </div>
  );
};

export default Appearance;
