import { ArrowLeft, ArrowRight } from 'iconoir-react';
import React, { useRef } from 'react';
import Wrapper from '../Wrapper/Wrapper';
import './quick_services.css';

const QuickServices = ({ data }) => {
  const servicesRef = useRef(null);

  const handleScrollX = (direction) => {
    const scrollAmount = 500;
    if (!servicesRef.current) return;
    servicesRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <Wrapper id="services-theme-health">
      <div className="controls-slider w-full absolute top-[50%] translate-y-[-50%] flex justify-between">
        <button className="control-btns prev-btn" onClick={() => handleScrollX('left')}>
          <ArrowLeft />
        </button>
        <button className="control-btns next-btn" onClick={() => handleScrollX('right')}>
          <ArrowRight />
        </button>
      </div>
      <div ref={servicesRef} className="services_parent_card flex gap-5">
        {data?.map((service, index) => (
          <a key={index} href={service.link} className="services_card">
            <img src={service.image} alt={service.title} />
          </a>
        ))}
      </div>
    </Wrapper>
  );
};

export default QuickServices;
