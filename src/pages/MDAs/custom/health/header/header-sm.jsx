import { ArrowUpRight, Menu, Xmark } from 'iconoir-react';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import lasg__logo from '../assets/lasg__logo.png';

const HeaderSm = ({ customClass, fullname }) => {
  const { mda, page } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`w-full p-2 flex items-center justify-between ${customClass}`}>
      <div
        className={`flex justify-between items-center gap-4 relative z-50 h-[80px] w-full ${
          isMenuOpen ? 'bg-white border-b-[1px] border-[#eee]' : ''
        }`}
      >
        <div className="brandZone flex items-center gap-4">
          <div className="logo overflow-hidden w-12 h-12">
            <img src={lasg__logo} alt={`Lagos State ${fullname}`} />
          </div>
          <p className="text-[11px] uppercase tracking-[2px]">{fullname}</p>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {!isMenuOpen ? <Menu /> : <Xmark />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="flex flex-col gap-10 text-[13px] tracking-[4px] uppercase fixed top-[0px] bg-[#fff] left-0 w-full z-10 h-[100vh] px-[10%] py-[120px] border-t-[1px] border-[#eee] overflow-y-auto">
          <a
            className={
              page === '' || page === undefined ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'
            }
            href={`/${mda}`}
          >
            Home
          </a>
          <a
            className={page === 'about' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}
            href={`/${mda}/about`}
          >
            About
          </a>
          <a
            className={page === 'news' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}
            href={`/${mda}/news`}
          >
            Newsroom
          </a>
          <a
            className={page === 'resources' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}
            href={`/${mda}/resources`}
          >
            Resources
          </a>
          <a
            className={page === 'contact' ? '!text-[#2e7d32] font-bold' : '!text-[#2d2d2d]'}
            href={`/${mda}/contact`}
          >
            Contact
          </a>

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
