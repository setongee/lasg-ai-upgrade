import { ArrowUpRight, Check } from 'iconoir-react';
import Wrapper from '../../shared/Wrapper/Wrapper';

const CoreInformation = ({
  data,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  if (!data) return null;

  return (
    <section
      className={`bg-[#fff] lg:py-[30px] mb-[80px] py-[0px] coreInformationSection ${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'coreInformation' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('coreInformation') : null}
    >
      <Wrapper>
        <div className="topic__hand text-[24px] sm:text-[28px] md:text-[35px] leading-[140%] font-semibold text-center mb-[50px] leading-[130%] w-full mx-auto sm:w-[70%] md:w-[600px]">
          {data?.title || 'You can type in your preferred title for the core information section'}
        </div>
        <div className="cards flex flex-col lg:flex-row gap-[30px] justify-center">
          {data?.cards?.map((card, index) => (
            <div
              key={index}
              className="card__blaze bg-[#F9F9FB] p-8 rounded-[4px] flex flex-col gap-5 w-full lg:w-1/3"
            >
              <div className="text__container">
                <div className="card__title text-[20px] font-semibold mb-3 w-[240px] h-[110px] underline">
                  {card.title}
                </div>
                <p className="text-[15px] leading-[170%] mb-5">{card.description}</p>
                <div className="checklist flex flex-col gap-3 my-12 ">
                  {card.keyPoints?.map((point, pointIndex) => (
                    <div key={pointIndex} className="itemInfo flex items-center gap-2 text-[14px]">
                      <Check className="w-4 h-4 text-[#00B44E]" /> {point}
                    </div>
                  ))}
                </div>
                <button
                  className="bg-gradient-to-r from-[#1C3F3A] to-[#00B44E] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-[4px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity uppercase text-[10px] sm:text-[11px] tracking-[2px] w-full"
                  onClick={() => card.link && window.open(card.link, '_blank')}
                >
                  Learn More
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
};

export default CoreInformation;
