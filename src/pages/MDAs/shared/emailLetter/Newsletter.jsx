import React from 'react';
import bgb from '../../custom/health/assets/bgb.jpg';
import Button from '../button/Button';

const Newsletter = () => {
  return (
    <div className="flex justify-center items-center bg-[#2e7d32] rounded-[10px] p-[30px] md:p-[50px] lg:p-[80px] my-[70px] md:my-[100px] mb-[50px] overflow-hidden relative">
      <img src={bgb} alt="" className="w-full h-full object-cover absolute top-0 left-0" />
      <div className="flex flex-col lg:flex-row items-center justify-between w-full text-white gap-[30px]">
        {/* Left section - Title */}
        <div className="text-[22px] sm:text-[24px] lg:text-[28px] font-semibold leading-[125%] md:w-[300px] lg:w-[550px] text-center lg:text-left relative z-[1]">
          Subscribe to our newsletter to get updates to your inbox 📨
        </div>

        {/* Right section - Input + Button */}
        <div className="flex items-center justify-center gap-[10px] rounded-[5px] backdrop-blur-sm p-[2px] flex-wrap md:flex-nowrap ">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full md:w-[320px] p-[14px] rounded-[5px] outline-none text-white glass-card h-[55px] md:h-[60px]"
          />
          <Button customClass="bg-[#1c3f3a] text-white flex items-center justify-center gap-2 rounded-[5px] px-[20px] py-[12px] !w-full md:max-w-max h-[55px] md:h-[60px]">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
