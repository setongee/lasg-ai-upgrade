import { ArrowUpRight, Menu, Xmark } from 'iconoir-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import lasg__logo from '../assets/lasg__logo.png';

const HeaderSm = ({ customClass, fullname, mdaData }) => {
  const { mda, page } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMdaTypeService = mdaData?.type === 'service';
  const logo = mdaData?.logo;

  return (
    <div className={`w-full p-2 flex items-center justify-between ${customClass}`}>
      <div
        className={`flex justify-between items-center gap-4 relative z-50 h-[80px] w-full ${
          isMenuOpen ? 'bg-white border-b-[1px] border-[#eee]' : ''
        }`}
      >
        <div className="brandZone flex items-center gap-4">
          <div className="logo overflow-hidden w-12 h-12">
            <img src={logo ? logo : lasg__logo} alt={`Lagos State ${fullname}`} />
          </div>
          <p className="text-[11px] uppercase tracking-[2px] !text-[#131313]">{fullname}</p>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {!isMenuOpen ? <Menu /> : <Xmark />}
        </button>
      </div>

      {isMenuOpen && (
        <div
          className={`${isMdaTypeService ? 'hidden!' : ''} flex flex-col gap-10 text-[13px] tracking-[4px] uppercase fixed top-[0px] bg-[#fff] left-0 w-full z-10 h-[100vh] px-[10%] py-[120px] border-t-[1px] border-[#eee] overflow-y-auto`}
        >
          <div
            className={
              page === '' || page === undefined ? '!text-[#108a00] font-bold' : '!text-[#2d2d2d]'
            }
            onClick={() => navigate(`/${mda}`)}
          >
            Home
          </div>
          <div
            className={page === 'about' ? '!text-[#108a00] font-bold' : '!text-[#2d2d2d]'}
            onClick={() => navigate(`/${mda}/about`)}
          >
            About
          </div>
          <div
            className={page === 'news' ? '!text-[#108a00] font-bold' : '!text-[#2d2d2d]'}
            onClick={() => navigate(`/${mda}/news`)}
          >
            Newsroom
          </div>
          <div
            className={page === 'events' ? '!text-[#108a00] font-bold' : '!text-[#2d2d2d]'}
            onClick={() => navigate(`/${mda}/events`)}
          >
            Events
          </div>
          <div
            className={page === 'gallery' ? '!text-[#108a00] font-bold' : '!text-[#2d2d2d]'}
            onClick={() => navigate(`/${mda}/gallery`)}
          >
            Gallery
          </div>
          <div
            className={page === 'resources' ? '!text-[#108a00] font-bold' : '!text-[#2d2d2d]'}
            onClick={() => navigate(`/${mda}/resources`)}
          >
            Resources
          </div>
          <div
            className={page === 'contact' ? '!text-[#108a00] font-bold' : '!text-[#2d2d2d]'}
            onClick={() => navigate(`/${mda}/contact`)}
          >
            Contact
          </div>

          <a className="!text-[#008435] font-bold flex gap-1.5 items-center" href="/">
            Back to LASG
            <ArrowUpRight />
          </a>
        </div>
      )}
    </div>
  );
};

export default HeaderSm;
