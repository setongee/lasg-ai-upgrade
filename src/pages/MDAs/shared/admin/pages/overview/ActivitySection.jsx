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
    <div className="hidden fixed top-20 right-0 z-[1] h-[calc(100vh-80px)] w-[400px] overflow-y-auto overflow-x-hidden bg-white py-5">
      <h2 className="fixed top-[60px] z-[999999] mt-5 flex h-[60px] w-full items-center justify-center gap-2 border-b border-[#eee] bg-white px-5 text-[10px] font-semibold uppercase tracking-[2px]">
        <StatsUpSquareSolid fontSize={12} /> Activity Log
        <Search className="ml-auto text-[13px]" />
      </h2>
      {isLoading ? <Loader customClass="" /> : null}
      <div className="mt-[55px]">
        {data?.data?.map(({ activity, createdAt }, index) => (
          <div
            key={createdAt}
            className={`flex flex-col gap-1 p-5 pr-[50px] text-[15px] font-medium break-words leading-[1.5] ${index % 2 === 1 ? 'bg-[#f9fbfc]' : ''}`}
          >
            <p className="flex items-center gap-2 text-sm font-medium capitalize text-[#777]">
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
