import { ArrowUpRight, NavArrowRight } from 'iconoir-react';
import Wrapper from '../../Wrapper/Wrapper';

const ServicesComponent = ({ data, name, viewAllLink, totalCount }) => {
  const services = data || [];
  const CtaTag = viewAllLink ? 'a' : 'div';

  return (
    <Wrapper>
      <div className="flex flex-col items-center text-gray-900">
        <div className="font-semibold w-full text-center flex flex-col items-center gap-5">
          <p className="text-[24px] sm:text-[32px] md:text-[35px] md:w-[700px] text-center leading-9 md:leading-[140%] text-gray-900">
            Discover and Access {name} Online Services
          </p>
          <span className="text-[#666] text-base font-normal w-full !leading-[150%]">
            Explore our offerings and choose the service that best meets your needs.
          </span>
        </div>

        <div className="w-full flex gap-5 overflow-x-auto pb-4 mt-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <CtaTag
            href={viewAllLink || undefined}
            className="flex-none w-[280px] h-[320px] rounded-2xl bg-[var(--theme-accent,#108a00)] text-[var(--theme-accent-text,#ffffff)] p-8 flex flex-col justify-between"
          >
            <p className="text-[22px] font-semibold leading-[1.3]">Explore all {name} services</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                View all services ({totalCount ?? services.length})
              </span>
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <ArrowUpRight width={18} />
              </div>
            </div>
          </CtaTag>

          {services.map((service, index) => (
            <div
              key={service.id || index}
              className="group flex-none w-[280px] h-[320px] rounded-2xl bg-gray-100 p-8 flex flex-col justify-between hover:bg-gray-900 transition-colors duration-300"
            >
              <p className="text-[18px] font-semibold leading-[1.3] text-gray-900 group-hover:text-white">
                {service.name}
              </p>
              <p className="text-sm text-gray-500 line-clamp-3 group-hover:text-gray-300">
                {service.short}
              </p>
              <a
                href={service.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-[var(--theme-accent,#108a00)] group-hover:text-white"
              >
                {service.cta || 'Learn more'} <NavArrowRight width={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default ServicesComponent;
