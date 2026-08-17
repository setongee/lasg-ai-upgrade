import { ArrowUpRight, Menu, NavArrowDown, Xmark } from 'iconoir-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import lasg__logo from '../../assets/lasg__logo.png';

const NAV_ITEMS = [
  { key: '', path: '', label: 'Home' },
  { key: 'about', path: 'about', label: 'About' },
  { key: 'news', path: 'news?page=1', label: 'Newsroom' },
  {
    key: 'media',
    label: 'Media',
    children: [
      { key: 'events', path: 'events', label: 'Events' },
      { key: 'gallery', path: 'gallery', label: 'Gallery' },
    ],
  },
  { key: 'resources', path: 'resources', label: 'Resources' },
];

const TabStripHeaderSm = ({ customClass, fullname, mdaData, isEdit = false }) => {
  const { mda, page } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const logo = mdaData?.logo;
  const isMdaTypeService = mdaData?.type === 'service';

  const items = NAV_ITEMS.filter(
    (item) => item.key !== 'resources' || mdaData?.resources?.length > 0
  );

  const go = (path) => {
    setOpen(false);
    if (isEdit) return;
    navigate(path ? `/${mda}/${path}` : `/${mda}`);
  };

  return (
    <div className={`w-full flex items-center justify-between relative ${customClass}`}>
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => go('')}>
        <div className="w-9 h-9 overflow-hidden shrink-0">
          <img
            src={logo ? logo : lasg__logo}
            alt={`Lagos State ${fullname}`}
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-[10px] uppercase tracking-[1.5px] max-w-[140px] leading-[1.3] !text-[#131313]">
          {fullname}
        </p>
      </div>

      {!isMdaTypeService && (
        <button type="button" onClick={() => setOpen(!open)} className="p-2">
          {open ? <Xmark /> : <Menu />}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 top-[90px] bg-white z-40 flex flex-col overflow-y-auto">
          {items.map((item) =>
            item.children ? (
              <div key={item.key} className="border-b border-[#eee]">
                <div
                  className={`px-6 py-4 text-[13px] uppercase tracking-[2px] flex items-center justify-between ${
                    item.children.some((child) => child.key === page)
                      ? 'text-[#108a00] font-bold'
                      : ''
                  }`}
                  onClick={() => setOpenGroup(openGroup === item.key ? null : item.key)}
                >
                  {item.label}
                  <NavArrowDown
                    width={14}
                    className={`transition-transform ${openGroup === item.key ? 'rotate-180' : ''}`}
                  />
                </div>
                {openGroup === item.key && (
                  <div className="flex flex-col bg-[#fafafa]">
                    {item.children.map((child) => (
                      <div
                        key={child.key}
                        className={`px-10 py-3 text-[12px] uppercase tracking-[2px] ${
                          page === child.key ? 'text-[#108a00] font-bold' : ''
                        }`}
                        onClick={() => go(child.path)}
                      >
                        {child.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                key={item.key}
                className={`px-6 py-4 border-b border-[#eee] text-[13px] uppercase tracking-[2px] ${
                  (item.key === '' ? page === '' || page === undefined : page === item.key)
                    ? 'text-[#108a00] font-bold'
                    : ''
                }`}
                onClick={() => go(item.path)}
              >
                {item.label}
              </div>
            )
          )}
          <div
            className="mx-6 mt-4 px-5 py-3 bg-[var(--theme-accent,#108a00)] text-[var(--theme-accent-text,#ffffff)] text-[12px] uppercase tracking-[2px] flex items-center justify-center gap-1.5 rounded"
            onClick={() => go('contact')}
          >
            Contact <ArrowUpRight width={14} />
          </div>
          <a
            className="mx-6 mt-4 !text-[#008435] font-bold flex gap-1.5 items-center text-[12px] tracking-[2px] uppercase"
            href={isEdit ? undefined : '/'}
          >
            Back to LASG
            <ArrowUpRight width={14} />
          </a>
        </div>
      )}
    </div>
  );
};

export default TabStripHeaderSm;
