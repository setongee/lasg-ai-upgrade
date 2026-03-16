import { ArrowUpRight } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { frontend_url } from '../../../../../api/read/environment';

const Summary = ({ nextStep, data }) => {
  const [userDetails, setUserDetails] = useState({ firstname: '', lastname: '', role: '' });

  useEffect(() => {
    const user = window.localStorage.getItem('MDA__TOKEN');
    if (user) {
      const parser = JSON.parse(user);
      setUserDetails({
        firstname: parser.firstname || '',
        lastname: parser.lastname || '',
        role: parser.role || '',
      });
    }
  }, []);

  return (
    <div className="w-[600px] p-[40px] bg-white rounded-[16px] mt-10">
      <p className="text-[11px] uppercase tracking-[2px] text-gray-500 font-medium mb-5">
        Step 1 - Summary
      </p>
      <div className="text-[26px] w-[90%] leading-[130%] tracking-[-0.3px] font-semibold mb-4">
        Welcome on board{' '}
        <span className="text-green-700">
          {userDetails.firstname} {userDetails.lastname}
        </span>
        , <div className="!font-normal">Let's get you started</div>
      </div>
      <div className="text-gray-500">Time to build your agency's digital presence.</div>

      {/* details */}
      <div className="flex flex-col gap-3 mt-10">
        <div className="p-5 bg-gray-50 rounded-[8px]">
          <label className="uppercase text-[11px] tracking-[2px] font-semibold text-gray-500">
            MDA Fullname
          </label>
          <p className="font-medium">{data?.fullname}</p>
        </div>
        <div className="p-5 bg-gray-50 rounded-[8px]">
          <label className="uppercase text-[11px] tracking-[2px] font-semibold text-gray-500">
            Slug (lasg page URL)
          </label>
          <div className="flex justify-between">
            <p className="font-medium">{`${frontend_url}/${data?.slug}`}</p>
            <a
              href={`${frontend_url}/${data?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="!text-green-700 cursor-pointer text-[14px] font-medium flex items-center gap-1"
            >
              <ArrowUpRight fontSize={11} /> View Page
            </a>
          </div>
        </div>
        {/* button */}
        <div>
          <button
            className="w-full bg-green-700 text-white px-6 py-[12px] rounded-[5px] text-[15px] font-semibold mt-7 cursor-pointer hover:bg-green-800 transition-colors"
            onClick={nextStep}
          >
            Continue Setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
