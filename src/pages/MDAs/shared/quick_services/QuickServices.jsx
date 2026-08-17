import { ArrowLeft, ArrowRight, ArrowUpRight } from 'iconoir-react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useEditModeStore } from '../../stores/editMode.store';
import Wrapper from '../Wrapper/Wrapper';
import './quick_services.css';

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

const QuickServices = ({ data, style, ctaTitle }) => {
  const servicesRef = useRef(null);
  const { mda } = useParams();

  // check is edit mode is on
  const viewMode = useEditModeStore((state) => state.viewMode);
  const isEditing = viewMode === 'edit';

  const handleScrollX = (direction) => {
    const scrollAmount = 500;
    if (!servicesRef.current) return;
    servicesRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (style === 'imageCards') {
    const services = data || [];

    return (
      <div className="w-full flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <a
          href={isEditing ? undefined : `/${mda}/services`}
          className="flex-none w-[38vw] min-w-[300px] max-w-[480px] h-[46vw] min-h-[380px] max-h-[520px] bg-[var(--theme-accent,#108a00)] text-[var(--theme-accent-text,#ffffff)] p-8 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start gap-3">
            <p className="text-[28px] font-semibold leading-[1.25]">
              {ctaTitle || 'Check out our citizens services'}
            </p>
            <div className="w-10 h-10 bg-white text-[var(--theme-accent,#108a00)] flex items-center justify-center shrink-0">
              <ArrowUpRight width={18} />
            </div>
          </div>
          <span className="text-[11px] uppercase tracking-[1.5px] opacity-80">
            View all services ({services.length})
          </span>
        </a>

        {services.map((service, index) => {
          const CardTag = isEditing ? 'div' : 'a';
          return (
            <CardTag
              key={index}
              href={isEditing ? undefined : getFormattedLink(service?.link, service?.linkType)}
              className="group relative flex-none w-[38vw] min-w-[300px] max-w-[480px] h-[46vw] min-h-[380px] max-h-[520px] overflow-hidden bg-gray-800"
            >
              {service.image && (
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-[20px] font-semibold leading-[1.3]">{service.title}</p>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                  <div className="overflow-hidden">
                    {service.description && (
                      <p className="text-[13px] opacity-90 leading-[1.5] mt-2 mb-4">
                        {service.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 bg-[var(--theme-accent,#108a00)] text-[var(--theme-accent-text,#ffffff)] text-[11px] font-medium uppercase tracking-[1.5px] px-4 py-2.5">
                      Get Started Now
                    </span>
                  </div>
                </div>
              </div>
            </CardTag>
          );
        })}
      </div>
    );
  }

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
