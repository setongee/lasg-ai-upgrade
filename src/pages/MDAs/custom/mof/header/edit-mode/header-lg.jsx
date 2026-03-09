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
        <p className="text-[11px] uppercase tracking-[2px] w-[250px]">{fullname}</p>
      </div>

      <div className="flex items-center gap-7 text-[11px] tracking-[2px] uppercase text-white">
        <div
          className={
            page === '' || page === undefined ? '!text-[#fbbf24] font-bold' : '!text-white'
          }
        >
          Home
        </div>
        <div className={page === 'about' ? '!text-[#fbbf24] font-bold' : '!text-white'}>About</div>
        <div className={page === 'news' ? '!text-[#fbbf24] font-bold' : '!text-white'}>
          Newsroom
        </div>
        {mdaData?.resources?.length > 0 && (
          <div className={page === 'resources' ? '!text-[#fbbf24] font-bold' : '!text-white'}>
            Resources
          </div>
        )}
        <div className={page === 'contact' ? '!text-[#fbbf24] font-bold' : '!text-white'}>
          Contact
        </div>
      </div>

      <div className="!text-[#ffb700] font-bold flex gap-1.5 items-center text-[11px] tracking-[2px] uppercase">
        Back to LASG
        <ArrowUpRight />
      </div>
    </div>
  );
};

export default HeaderLg;
