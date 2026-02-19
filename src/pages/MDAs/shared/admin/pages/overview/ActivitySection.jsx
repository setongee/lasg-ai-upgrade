import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Search, StatsUpSquareSolid } from 'iconoir-react';
import { getLoggingData } from '../../../../api/logger/logger';
import Loader from '../../../../shared/loader/loader';

const ActivitySection = ({ siteName }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['activity-log', siteName],
    queryFn: () => getLoggingData(siteName),
  });

  dayjs.extend(relativeTime);

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="activity-panel">
      <h2 className="header-activity flex gap-2 items-center uppercase tracking-[2px] text-[11px] mt-5 font-semibold px-[20px]">
        <StatsUpSquareSolid fontSize={14} /> Activity Log
        <Search className="search-activity" />
      </h2>
      {isLoading ? <Loader customClass="" /> : null}
      <div className="logger-items">
        {data?.data?.map(({ activity, createdAt }) => (
          <div className="loggerItem">
            <p className="flex items-center gap-2">
              {dayjs().to(dayjs(createdAt)) === 'a day ago'
                ? 'Yesterday'
                : dayjs().to(dayjs(createdAt))}{' '}
              {/* <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div> {formatDate3(createdAt)} */}
            </p>
            <h2>{activity}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitySection;
