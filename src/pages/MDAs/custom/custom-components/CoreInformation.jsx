import { ArrowUpRight, Check } from 'iconoir-react';
import { useState } from 'react';
import { isDarkBackground } from '../../shared/utils/backgroundContrast';
import Modal from '../../shared/modal/Modal';
import Wrapper from '../../shared/Wrapper/Wrapper';

const DEFAULT_BACKGROUND = 'var(--theme-section-bg, #ffffff)';

const CoreInformation = ({
  data,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  if (!data) return null;

  const hasCustomBackground = !!data?.backgroundColor;
  const backgroundColor = data?.backgroundColor || DEFAULT_BACKGROUND;
  const onDark = hasCustomBackground ? isDarkBackground(backgroundColor) : null;

  const activeCard = activeCardIndex !== null ? data?.cards?.[activeCardIndex] : null;

  return (
    <section
      style={{ backgroundColor }}
      className={`lg:py-[30px] mb-[80px] py-[0px] coreInformationSection ${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'coreInformation' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('coreInformation') : null}
    >
      <Wrapper>
        <div
          className={`topic__hand text-[24px] sm:text-[28px] md:text-[35px] leading-[140%] font-semibold text-center mb-[50px] leading-[130%] w-full mx-auto sm:w-[70%] md:w-[600px] ${
            onDark === null ? '' : onDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {data?.title || 'You can type in your preferred title for the core information section'}
        </div>
        <div className="cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.cards?.map((card, index) => {
            const hasLink = !!card.link;

            return (
              <div
                key={index}
                className="card__blaze bg-gray-50 p-6 rounded-[8px] flex flex-col gap-8"
              >
                <div className="text__container flex flex-col flex-1">
                  <div className="w-[80%] text-[16px] font-semibold mb-3">{card.title}</div>
                  <p className="text-[15px] leading-[170%] mb-8 line-clamp-3 h-[78px] overflow-hidden text-gray-500">
                    {card.description}
                  </p>

                  <div className="mt-auto flex flex-col gap-2">
                    {hasLink ? (
                      <>
                        <button
                          className="text-[13px] font-medium underline text-[#1C3F3A] hover:text-[#00B44E] transition-colors text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCardIndex(index);
                          }}
                        >
                          Read More
                        </button>
                        <button
                          className="bg-green-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-[4px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity uppercase text-[10px] sm:text-[11px] tracking-[2px] w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(card.link, '_blank');
                          }}
                        >
                          Learn More
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-green-700 text-white px-4 sm:px-4 py-2.5 sm:py-2 rounded-[4px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-[10px] sm:text-[13px] font-medium w-max"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCardIndex(index);
                        }}
                      >
                        Read More
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Wrapper>

      <Modal
        open={activeCardIndex !== null}
        onClose={() => setActiveCardIndex(null)}
        contentStyling="max-w-2xl mx-auto mt-20 bg-white rounded-[8px] p-8 max-h-[75vh] overflow-y-auto"
      >
        {activeCard && (
          <div>
            <div className="text-[18px] font-semibold mb-4 pr-8">{activeCard.title}</div>
            <p className="text-[15px] leading-[170%] mb-6 text-left">{activeCard.description}</p>
            {activeCard.keyPoints?.some((point) => point) && (
              <div className="checklist flex flex-col gap-3">
                {activeCard.keyPoints.map(
                  (point, pointIndex) =>
                    point && (
                      <div
                        key={pointIndex}
                        className="itemInfo flex items-center gap-2 text-[14px]"
                      >
                        <Check className="w-4 h-4 text-[#00B44E] shrink-0" /> {point}
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
};

export default CoreInformation;
