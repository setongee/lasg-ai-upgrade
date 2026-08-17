import { isDarkBackground } from '../../shared/utils/backgroundContrast';
import Wrapper from '../../shared/Wrapper/Wrapper';

const DEFAULT_BACKGROUND = 'var(--theme-section-bg, #ffffff)';
const STATISTICS_STYLES = ['style1', 'style2'];

const Statistics = ({
  data,
  style,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  const items = data?.items || [];
  const resolvedStyle = STATISTICS_STYLES.includes(style) ? style : 'style1';

  if (!isEdit && items.length === 0) return null;

  const hasCustomBackground = !!data?.backgroundColor;
  const backgroundColor = data?.backgroundColor || DEFAULT_BACKGROUND;
  const onDark = hasCustomBackground ? isDarkBackground(backgroundColor) : null;

  const valueClass = `font-bold ${onDark === null ? '' : onDark ? 'text-white' : 'text-[#1C3F3A]'}`;
  const labelClass = `${onDark === null ? 'opacity-70' : onDark ? 'text-white/70' : 'text-gray-500'}`;

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
        {resolvedStyle === 'style2' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
            {items.map((statistic, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-black/5"
              >
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {statistic.icon ? (
                    <img src={statistic.icon} alt="" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[var(--theme-accent,#108a00)]/30" />
                  )}
                </div>
                <p className={`text-[20px] sm:text-[22px] ${valueClass}`}>
                  {statistic.value || 'Value'}
                </p>
                <div className={`text-[12px] ${labelClass}`}>{statistic.label || 'Statistic Label'}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-x-14 gap-y-6">
            {items.map((statistic, index) => (
              <div key={index} className="flex flex-col items-center text-center min-w-[140px]">
                <p className={`text-[26px] sm:text-[32px] ${valueClass}`}>
                  {statistic.value || 'Value'}
                </p>
                <div className={`text-[13px] mt-1 ${labelClass}`}>
                  {statistic.label || 'Statistic Label'}
                </div>
              </div>
            ))}
          </div>
        )}
      </Wrapper>
    </section>
  );
};

export default Statistics;
