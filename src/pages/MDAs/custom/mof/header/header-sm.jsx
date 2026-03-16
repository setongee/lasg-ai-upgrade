import { ArrowUpRight, Menu, Xmark } from 'iconoir-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../../stores/theme.store';
import lasg__logo from '../assets/lasg__logo.png';

const HeaderSm = ({ customClass, fullname }) => {
  const { mda, page } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const mdaData = useThemeStore((state) => state.mdaData);
  const isMdaTypeService = mdaData?.type === 'service';

  return (
    <div className={`w-full p-2 flex items-center justify-between ${customClass}`}>
      <div
        className={`flex justify-between items-center gap-4 relative z-50 h-[80px] w-full ${
          isMenuOpen ? 'bg-green-700 border-b-[1px] border-[#eeeeee6b]' : ''
        }`}
      >
        <div className="brandZone flex items-center gap-4">
          <div className="logo overflow-hidden w-10 h-10 flex-shrink-0 sm:w-12 sm:h-12">
            <img src={lasg__logo} alt={`Lagos State ${fullname}`} />
          </div>
          <p className="text-[11px] uppercase tracking-[2px]">{fullname}</p>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {!isMenuOpen ? <Menu /> : <Xmark />}
        </button>
      </div>

      {isMenuOpen && (
        <div
          className={`${isMdaTypeService ? 'hidden!' : ''} flex flex-col gap-10 text-[13px] tracking-[4px] uppercase fixed top-[0px] bg-green-700 left-0 w-full z-10 h-[100vh] px-[10%] py-[120px] overflow-y-auto`}
        >
          <div
            className={
              page === '' || page === undefined ? '!text-[#fbbf24] font-bold' : '!text-white'
            }
            onClick={() => navigate(`/${mda}`)}
          >
            Home
          </div>
          <div
            className={page === 'about' ? '!text-[#fbbf24] font-bold' : '!text-white'}
            onClick={() => navigate(`/${mda}/about`)}
          >
            About
          </div>
          <div
            className={page === 'news' ? '!text-[#fbbf24] font-bold' : '!text-white'}
            onClick={() => navigate(`/${mda}/news`)}
          >
            Newsroom
          </div>
          {mdaData?.resources?.length > 0 && (
            <div
              className={page === 'resources' ? '!text-[#fbbf24] font-bold' : '!text-white'}
              onClick={() => navigate(`/${mda}/resources`)}
            >
              Resources
            </div>
          )}
          <div
            className={page === 'contact' ? '!text-[#fbbf24] font-bold' : '!text-white'}
            onClick={() => navigate(`/${mda}/contact`)}
          >
            Contact
          </div>

          <a className="!text-[#ffb700] font-bold flex gap-1.5 items-center" href="/">
            Back to LASG
            <ArrowUpRight />
          </a>
        </div>
      )}
    </div>
  );
};

export default HeaderSm;
