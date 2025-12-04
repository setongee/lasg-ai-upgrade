import { ArrowDown, ArrowUp } from 'iconoir-react';
import React, { useRef, useState } from 'react';
import Button from '../../button/Button';
import Wrapper from '../../Wrapper/Wrapper';
import ServiceCard from './card';

const ServicesComponent = ({ data, icon }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleServices = showAll ? data : data?.slice(0, 9);
  const sectionRef = useRef(null);

  return (
    <Wrapper>
      <div className="flex flex-col items-center">
        <div
          className="font-semibold w-[100%] text-center flex flex-col items-center gap-[20px]"
          ref={sectionRef}
        >
          <p className="text-[24px] sm:text-[32px] md:text-[40px] md:w-[600px] text-center leading-9 md:leading-13">
            Discover and Access Ministry of Health Online Services
          </p>
          <span className="text-[#666] text-base font-normal w-full !leading-[150%] ">
            Explore our offerings and choose the service that best meets your needs.
          </span>
        </div>
        <div className="w-full flex flex-wrap gap-5 justify-center my-10">
          {visibleServices?.length > 0 &&
            visibleServices?.map((service, index) => (
              <ServiceCard key={service.id || index} data={service} logo={icon} />
            ))}
        </div>

        {!showAll && data?.length > 9 ? (
          <Button
            customClass="bg-[#108a00] uppercase tracking-[2px] text-white rounded-[5px] flex gap-2 text-[11px]"
            action={() => setShowAll(true)}
          >
            Load More <ArrowDown />
          </Button>
        ) : (
          <Button
            customClass="bg-[#131313] uppercase tracking-[2px] text-white rounded-[5px] flex gap-2 text-[11px]"
            action={() => {
              setShowAll(false);
              sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Show Less <ArrowUp />
          </Button>
        )}
      </div>
    </Wrapper>
  );
};

export default ServicesComponent;
