import { ArrowUpRight, NavArrowDown } from 'iconoir-react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import lasg__logo from '../../assets/lasg__logo.png';

const NAV_LINK_CLASS =
  'h-full flex items-center px-8 border-l border-[#e7e7e7] text-[11px] uppercase tracking-[2px] transition-colors hover:bg-[#eee] cursor-pointer';

const TabStripHeaderLg = ({ customClass, fullname, mdaData, isEdit = false }) => {
  const { mda, page } = useParams();
  const navigate = useNavigate();
  const isMdaTypeService = mdaData?.type === 'service';
  const logo = mdaData?.logo;

  const go = (path) => {
    if (isEdit) return;
    navigate(path ? `/${mda}/${path}` : `/${mda}`);
  };

  const isActive = (key) => (key === '' ? page === '' || page === undefined : page === key);

  return (
    <div className={`w-full flex items-center justify-between ${customClass}`}>
      <div className="flex items-center gap-3 pr-5 cursor-pointer" onClick={() => go('')}>
        <div className="w-14 h-14 overflow-hidden shrink-0">
          <img
            src={logo ? logo : lasg__logo}
            alt={`Lagos State ${fullname}`}
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-[11px] uppercase tracking-[2px] max-w-[180px] leading-[1.5] !text-[#131313]">
          {fullname}
        </p>
      </div>

      {!isMdaTypeService && (
        <div className="h-full flex items-center flex-1 justify-end">
          <div
            className={`${NAV_LINK_CLASS} ${isActive('') ? 'text-[#108a00] font-bold' : ''}`}
            onClick={() => go('')}
          >
            Home
          </div>
          <div
            className={`${NAV_LINK_CLASS} ${isActive('about') ? 'text-[#108a00] font-bold' : ''}`}
            onClick={() => go('about')}
          >
            About
          </div>
          <div
            className={`${NAV_LINK_CLASS} ${isActive('news') ? 'text-[#108a00] font-bold' : ''}`}
            onClick={() => go('news?page=1')}
          >
            Newsroom
          </div>
          <div className="relative group h-full">
            <div
              className={`${NAV_LINK_CLASS} gap-1.5 ${
                isActive('events') || isActive('gallery') ? 'text-[#108a00] font-bold' : ''
              }`}
            >
              Media
              <NavArrowDown width={12} className="transition-transform group-hover:rotate-180" />
            </div>
            <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-white border border-[#e7e7e7] shadow-lg min-w-[160px] z-50">
              <div
                className={`px-5 py-3 text-[11px] uppercase tracking-[2px] hover:bg-[#eee] cursor-pointer ${
                  isActive('events') ? 'text-[#108a00] font-bold' : ''
                }`}
                onClick={() => go('events')}
              >
                Events
              </div>
              <div
                className={`px-5 py-3 text-[11px] uppercase tracking-[2px] hover:bg-[#eee] cursor-pointer ${
                  isActive('gallery') ? 'text-[#108a00] font-bold' : ''
                }`}
                onClick={() => go('gallery')}
              >
                Gallery
              </div>
            </div>
          </div>
          {mdaData?.resources?.length > 0 && (
            <div
              className={`${NAV_LINK_CLASS} ${isActive('resources') ? 'text-[#108a00] font-bold' : ''}`}
              onClick={() => go('resources')}
            >
              Resources
            </div>
          )}
          <div
            className="h-full flex items-center px-6 bg-[var(--theme-accent,#108a00)] text-[var(--theme-accent-text,#ffffff)] text-[11px] uppercase tracking-[2px] gap-1.5 cursor-pointer hover:opacity-90 shrink-0"
            onClick={() => go('contact')}
          >
            Contact <ArrowUpRight width={14} />
          </div>
        </div>
      )}

      <a
        className="ml-5 !text-[#008435] font-bold flex gap-1.5 items-center text-[11px] tracking-[2px] uppercase shrink-0"
        href={isEdit ? undefined : '/'}
      >
        Back to LASG
        <ArrowUpRight />
      </a>
    </div>
  );
};

export default TabStripHeaderLg;
