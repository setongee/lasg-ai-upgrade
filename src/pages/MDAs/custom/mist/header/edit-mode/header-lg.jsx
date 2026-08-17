import { ArrowUpRight } from 'iconoir-react';
import { useParams } from 'react-router';
import { useThemeStore } from '../../../../stores/theme.store';
import lasg__logo from '../../assets/lasg__logo.png';

const HeaderLg = ({ customClass, fullname }) => {
  const { page } = useParams();
  const mdaData = useThemeStore((state) => state.mdaData);

  return (
    <div className={`w-full p-2 flex items-center justify-between ${customClass}`}>
      <div className="flex items-center gap-4">
        <div className="logo overflow-hidden w-12 h-12">
          <img src={lasg__logo} alt="Lagos State Ministry of Health" />
        </div>
        <p className="text-[11px] uppercase tracking-[2px] w-[250px] !text-[#131313]">{fullname}</p>
      </div>

      <div className="flex items-center gap-7 text-[11px] tracking-[2px] uppercase">
        <div
          className={
            page === '' || page === undefined ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'
          }
        >
          Home
        </div>
        <div className={page === 'about' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}>
          About
        </div>
        <div className={page === 'news' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}>
          Newsroom
        </div>
        {mdaData?.resources?.length > 0 && (
          <div className={page === 'resources' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}>
            Resources
          </div>
        )}
        <div className={page === 'contact' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}>
          Contact
        </div>
      </div>

      <div className="!text-[#008435] font-bold flex gap-1.5 items-center text-[11px] tracking-[2px] uppercase">
        Back to LASG
        <ArrowUpRight />
      </div>
    </div>
  );
};

export default HeaderLg;
