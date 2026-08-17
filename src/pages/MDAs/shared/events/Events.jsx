import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar } from 'iconoir-react';
import { useParams } from 'react-router';
import { getEventsForMda, getSingleEvents } from '../../../../api/read/events.req';
import Loader from '../../../../components/loader/loader';
import { convertToTitleCase, formatDate2 } from '../../../../middleware/middleware';
import RichTextContent from '../richText/RichTextContent';
import Wrapper from '../Wrapper/Wrapper';
import EventRsvp from './EventRsvp';

const EventDetail = ({ event, mda }) => (
  <Wrapper>
    <a
      href={`/${mda}/events`}
      className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-[var(--theme-accent,#15803d)] mb-8"
    >
      <ArrowLeft width={16} /> Back to Events
    </a>

    <div className="max-w-[820px] mx-auto flex flex-col gap-6 pb-20">
      <div className="flex items-center gap-2 text-[13px] text-[var(--theme-accent,#15803d)] font-semibold uppercase tracking-[1.5px]">
        <Calendar width={16} /> {formatDate2(event.date)}
      </div>

      <h1 className="text-[32px] sm:text-[40px] font-bold leading-tight">
        {convertToTitleCase(event.title)}
      </h1>

      {event.photo && (
        <img
          src={event.photo}
          alt=""
          className="w-full h-[320px] sm:h-[420px] object-cover rounded-2xl"
        />
      )}

      <RichTextContent html={event.content} className="text-[16px] leading-[1.8]" />

      <EventRsvp eventId={event._id} />
    </div>
  </Wrapper>
);

const EventsList = ({ events, mda }) => (
  <Wrapper>
    <div className=" pt-16 pb-0 sm:py-16 sm:mt-20 mt-12 min-h-[40vh]">
      <h1 className="text-[18px] sm:text-[24px] font-bold mb-0">Events</h1>

      {events?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <a
              key={event._id}
              href={`/${mda}/events/${event._id}`}
              className="flex flex-col rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="h-[180px] w-full bg-gray-100">
                {event.photo && (
                  <img src={event.photo} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-5 flex flex-col gap-2">
                <div className="text-[12px] text-[var(--theme-accent,#15803d)] font-semibold uppercase tracking-[1.5px]">
                  {formatDate2(event.date)}
                </div>
                <h3 className="text-[17px] font-semibold leading-snug line-clamp-2">
                  {convertToTitleCase(event.title)}
                </h3>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-gray-800 text-[15px] text-center bg-gray-100/90 sm:min-h-[40vh] min-h-[20vh] mt-6 flex items-center justify-center">
          No events have been posted yet.
        </div>
      )}
    </div>
  </Wrapper>
);

export default function Events() {
  const { mda, id } = useParams();

  const eventsQuery = useQuery({
    queryKey: ['events', mda],
    queryFn: () => getEventsForMda(mda),
    enabled: !!mda && !id,
  });

  const singleEventQuery = useQuery({
    queryKey: ['event', id],
    queryFn: () => getSingleEvents(id),
    enabled: !!id,
  });

  const isLoading = id ? singleEventQuery.isLoading : eventsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="loaderPage">
        <Loader />
      </div>
    );
  }

  if (id) {
    return <EventDetail event={singleEventQuery.data?.data} mda={mda} />;
  }

  return <EventsList events={eventsQuery.data?.data} mda={mda} />;
}
