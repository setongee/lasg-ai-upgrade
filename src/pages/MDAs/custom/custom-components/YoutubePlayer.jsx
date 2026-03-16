import Divider from '../../shared/divider/Divider';
import Wrapper from '../../shared/Wrapper/Wrapper';
import YoutubeSocials from '../../shared/youtubePlayer/YoutubeSocials';

const YoutubePlayer = ({
  data,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  if (!data) return null;

  return (
    <section
      className={`${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'youtubePlayer' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('youtubePlayer') : null}
    >
      <Wrapper>
        <Divider customClass="sm:mb-[80px] mb-[40px]" />
        <YoutubeSocials id={data?.id} viewMode={viewMode} />
      </Wrapper>
    </section>
  );
};

export default YoutubePlayer;
