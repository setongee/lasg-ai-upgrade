import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'iconoir-react';
import { useParams } from 'react-router';
import { getEventsForMda } from '../../../../api/read/events.req';
import { convertToTitleCase, formatDate2 } from '../../../../middleware/middleware';
import { isDarkBackground } from '../../shared/utils/backgroundContrast';
import Wrapper from '../../shared/Wrapper/Wrapper';

const DEFAULT_BACKGROUND = 'var(--theme-section-bg, #ffffff)';

const UpcomingEvents = ({
  backgroundColor,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  const { mda } = useParams();

  const { data } = useQuery({
    queryKey: ['events-preview', mda],
    queryFn: () => getEventsForMda(mda),
    enabled: !!mda,
  });

  const events = (data?.data || []).slice(0, 3);
  const resolvedBackground = backgroundColor || DEFAULT_BACKGROUND;
  const onDark = backgroundColor ? isDarkBackground(resolvedBackground) : null;

  if (!isEdit && events.length === 0) return null;

  return (
    <section
      style={{ backgroundColor: resolvedBackground }}
      className={`py-160 ${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'upcomingEvents' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('upcomingEvents') : null}
    >
      <Wrapper>
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-[28px] sm:text-[34px] font-bold ${onDark ? 'text-white' : ''}`}>
            Events
          </h2>
          <a
            href={`/${mda}/events`}
            className="text-[13px] font-semibold text-green-700 uppercase tracking-[1.5px]"
          >
            View All
          </a>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {events.map((event) => (
              <a
                key={event._id}
                href={`/${mda}/events/${event._id}`}
                className="flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100"
              >
                <div className="h-[150px] w-full bg-gray-100">
                  {event.photo && (
                    <img src={event.photo} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-[12px] text-green-700 font-semibold uppercase tracking-[1.5px]">
                    <Calendar width={14} /> {formatDate2(event.date)}
                  </div>
                  <h3 className="text-[15px] font-semibold leading-snug line-clamp-2">
                    {convertToTitleCase(event.title)}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-[14px]">
            No events yet — this section will appear once an event is created.
          </div>
        )}
      </Wrapper>
    </section>
  );
};

export default UpcomingEvents;
