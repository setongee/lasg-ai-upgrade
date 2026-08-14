import { isDarkBackground } from '../../shared/utils/backgroundContrast';
import Wrapper from '../../shared/Wrapper/Wrapper';

const DEFAULT_BACKGROUND = 'var(--theme-section-bg, #ffffff)';

const Statistics = ({
  data,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  const items = data?.items || [];

  if (!isEdit && items.length === 0) return null;

  const hasCustomBackground = !!data?.backgroundColor;
  const backgroundColor = data?.backgroundColor || DEFAULT_BACKGROUND;
  const onDark = hasCustomBackground ? isDarkBackground(backgroundColor) : null;

  return (
    <section
      style={{ backgroundColor }}
      className={`py-10 ${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'statistics' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('statistics') : null}
    >
      <Wrapper>
        <div className="flex flex-wrap justify-center gap-x-14 gap-y-6">
          {items.map((statistic, index) => (
            <div key={index} className="flex flex-col items-center text-center min-w-[140px]">
              <p
                className={`text-[26px] sm:text-[32px] font-bold ${
                  onDark === null ? '' : onDark ? 'text-white' : 'text-[#1C3F3A]'
                }`}
              >
                {statistic.value || 'Value'}
              </p>
              <div
                className={`text-[13px] mt-1 ${
                  onDark === null ? 'opacity-70' : onDark ? 'text-white/70' : 'text-gray-500'
                }`}
              >
                {statistic.label || 'Statistic Label'}
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
};

export default Statistics;
