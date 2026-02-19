import { ArrowLeft, ArrowRight } from 'iconoir-react';
import { useRef } from 'react';
import { useEditModeStore } from '../../stores/editMode.store';
import Wrapper from '../Wrapper/Wrapper';
import './quick_services.css';

const QuickServices = ({ data }) => {
  const servicesRef = useRef(null);

  // check is edit mode is on
  const viewMode = useEditModeStore((state) => state.viewMode);

  const handleScrollX = (direction) => {
    const scrollAmount = 500;
    if (!servicesRef.current) return;
    servicesRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const getFormattedLink = (link, linkType) => {
    if (!link) return '';

    switch (linkType) {
      case 'phone':
        return `tel:${link.replace(/[^0-9+]/g, '')}`;
      case 'email':
        return `mailto:${link}`;
      default:
        return link;
    }
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
        {data?.map((service, index) =>
          viewMode === 'edit' ? (
            <a key={index} className="services_card">
              <img src={service.image} alt={service.title} />
            </a>
          ) : (
            <a
              key={index}
              href={getFormattedLink(service?.link, service?.linkType)}
              className="services_card"
            >
              <img src={service.image} alt={service.title} />
            </a>
          )
        )}
      </div>
    </Wrapper>
  );
};

export default QuickServices;
