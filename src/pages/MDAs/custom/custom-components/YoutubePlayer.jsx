import { isDarkBackground, resolveCustomBackground } from '../../shared/utils/backgroundContrast';
import { useThemeStore } from '../../stores/theme.store';
import Divider from '../../shared/divider/Divider';
import Wrapper from '../../shared/Wrapper/Wrapper';
import YoutubeSocials from '../../shared/youtubePlayer/YoutubeSocials';

const DEFAULT_BACKGROUND = 'var(--theme-section-bg, #ffffff)';

const YoutubePlayer = ({
  data,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  if (!data) return null;

  const customBackground = resolveCustomBackground(data?.backgroundColor, isDarkMode);
  const hasCustomBackground = !!customBackground;
  const backgroundColor = customBackground || DEFAULT_BACKGROUND;
  const onDark = hasCustomBackground ? isDarkBackground(backgroundColor) : null;
  const textClass = onDark === null ? '' : onDark ? 'text-white' : 'text-[#111827]';

  return (
    <section
      style={{ backgroundColor }}
      className={`${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'youtubePlayer' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('youtubePlayer') : null}
    >
      <Wrapper>
        <Divider customClass="sm:mb-[80px] mb-[40px]" />
        <YoutubeSocials id={data?.id} viewMode={viewMode} textClass={textClass} />
      </Wrapper>
    </section>
  );
};

export default YoutubePlayer;
