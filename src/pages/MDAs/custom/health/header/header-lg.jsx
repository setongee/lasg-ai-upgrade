import { ArrowUpRight } from 'iconoir-react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import lasg__logo from '../assets/lasg__logo.png';

const HeaderLg = ({ customClass, fullname, mdaData }) => {
  const { mda, page } = useParams();
  const navigate = useNavigate();
  const isMdaTypeService = mdaData?.type === 'service';
  const logo = mdaData?.logo;

  return (
    <div className={`w-full p-2 flex items-center justify-between ${customClass}`}>
      <div className="flex items-center gap-4">
        <div className="logo overflow-hidden w-12 h-12">
          <img src={logo ? logo : lasg__logo} alt={`Lagos State ${fullname}`} />
        </div>
        <p className="text-[11px] uppercase tracking-[2px] !text-[#131313]">{fullname}</p>
      </div>

      <div
        className={`${isMdaTypeService ? 'hidden!' : ''} flex items-center gap-7 text-[11px] tracking-[2px] uppercase`}
      >
        <div
          className={
            page === '' || page === undefined ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'
          }
          onClick={() => navigate(`/${mda}`)}
        >
          Home
        </div>
        <div
          className={page === 'about' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}
          onClick={() => navigate(`/${mda}/about`)}
        >
          About
        </div>
        <div
          className={page === 'news' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}
          onClick={() => navigate(`/${mda}/news?page=1`)}
        >
          Newsroom
        </div>
        <div
          className={page === 'events' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}
          onClick={() => navigate(`/${mda}/events`)}
        >
          Events
        </div>
        <div
          className={page === 'gallery' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}
          onClick={() => navigate(`/${mda}/gallery`)}
        >
          Gallery
        </div>
        {mdaData?.resources?.length > 0 && (
          <div
            className={page === 'resources' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}
            onClick={() => navigate(`/${mda}/resources`)}
          >
            Resources
          </div>
        )}
        <div
          className={page === 'contact' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}
          onClick={() => navigate(`/${mda}/contact`)}
        >
          Contact
        </div>
      </div>
      <a
        className="!text-[#008435] font-bold flex gap-1.5 items-center text-[11px] tracking-[2px] uppercase"
        href="/"
      >
        Back to LASG
        <ArrowUpRight />
      </a>
    </div>
  );
};

export default HeaderLg;
