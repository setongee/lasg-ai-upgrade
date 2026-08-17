import { ArrowUpRight } from 'iconoir-react';
import { useParams } from 'react-router';
import lasg__logo from '../../assets/lasg__logo.png';

const HeaderLg = ({ customClass, fullname }) => {
  const { page } = useParams();

  return (
    <div className={`w-full p-2 flex items-center justify-between ${customClass}`}>
      <div className="flex items-center gap-4">
        <div className="logo overflow-hidden w-12 h-12">
          <img src={lasg__logo} alt={`Lagos State ${fullname}`} />
        </div>
        <p className="text-[11px] uppercase tracking-[2px] !text-[#131313]">{fullname}</p>
      </div>

      <div className="flex items-center gap-7 text-[11px] tracking-[2px] uppercase">
        <a className={page === '' || page === undefined ? '!text-[#108a00] font-bold' : '!text-[#2d2d2d]'}>
          Home
        </a>
        <a className={page === 'about' ? '!text-[#108a00] font-bold' : '!text-[#2d2d2d]'}>About</a>
        <a className={page === 'news' ? '!text-[#108a00] font-bold' : '!text-[#2d2d2d]'}>
          Newsroom
        </a>
        <a className={page === 'resources' ? '!text-[#108a00] font-bold' : '!text-[#2d2d2d]'}>
          Financial Statements
        </a>
        <a className={page === 'contact' ? '!text-[#108a00] font-bold' : '!text-[#2d2d2d]'}>
          Contact
        </a>

        <a className="!text-[#008435] font-bold flex gap-1.5 items-center">
          Back to LASG
          <ArrowUpRight />
        </a>
      </div>
    </div>
  );
};

export default HeaderLg;
