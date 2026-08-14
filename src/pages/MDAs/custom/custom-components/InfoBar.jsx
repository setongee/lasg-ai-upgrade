import Wrapper from '../../shared/Wrapper/Wrapper';

const SEPARATOR = '   •   ';
const MIN_DURATION_S = 10;
const SECONDS_PER_CHAR = 0.12;

const InfoBar = ({
  data,
  fullname,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  const messages = data?.messages?.length ? data.messages : [`Welcome to ${fullname || 'us'}`];
  const sliderEnabled = data?.sliderEnabled && messages.length > 1;

  if (data?.enabled === false) return null;

  const joined = messages.join(SEPARATOR);
  const duration = Math.max(MIN_DURATION_S, joined.length * SECONDS_PER_CHAR);

  return (
    <div
      className={`info-banner flex justify-center bg-[var(--theme-accent,#1c3f3a)] ${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'infoBar' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('infoBar') : null}
    >
      <Wrapper customClass="uppercase text-[11px] tracking-[2px] text-[var(--theme-accent-text,#f0ead2)] overflow-hidden relative h-[32px]">
        {sliderEnabled ? (
          <div
            className="info-bar-marquee-track flex whitespace-nowrap absolute top-1/2 left-0 font-medium"
            style={{ animationDuration: `${duration}s` }}
          >
            <span className="pr-[60px]">{joined}</span>
            <span className="pr-[60px]" aria-hidden="true">
              {joined}
            </span>
          </div>
        ) : (
          <p className="absolute top-1/2 -translate-y-1/2 left-0 right-0 text-center font-medium">
            {messages[0]}
          </p>
        )}
      </Wrapper>

      {sliderEnabled && (
        <style>{`
          @keyframes info-bar-marquee {
            from { transform: translateY(-50%) translateX(0); }
            to { transform: translateY(-50%) translateX(-50%); }
          }
          .info-bar-marquee-track {
            animation-name: info-bar-marquee;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
        `}</style>
      )}
    </div>
  );
};

export default InfoBar;
