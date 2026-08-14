import { useQuery } from '@tanstack/react-query';
import { Globe, Group, NavArrowDown, PageEdit, Suitcase } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '../../../../../../middleware/middleware';
import { getSubsciptionsByMda } from '../../../../../../api/read/subscribers.req';
import { getAllServicesCategory } from '../../../../../../api/read/services.req';
import { getDashboardData } from '../../../../api/admin/dashboard';
import { formattedName } from '../../../../api/admin/logic';
import { useThemeStore } from '../../../../stores/theme.store';
import Loader from '../../../loader/loader';
import ActivitySection from './ActivitySection';
import ChartDown from './chart-down.svg';
import ChartUp from './chart-up.svg';
import VisitsAreaChart from './VisitsAreaChart';

const QUICK_ACTION_THEMES = {
  blue: 'from-blue-500 to-blue-700',
  green: 'from-emerald-500 to-emerald-700',
  yellow: 'from-yellow-500 to-yellow-600',
  purple: 'from-purple-500 to-purple-700',
};

const QuickActionCard = ({ icon: Icon, title, description, theme, onClick }) => (
  <div
    onClick={onClick}
    className={`relative overflow-hidden rounded-[6px] p-6 cursor-pointer bg-gradient-to-br ${QUICK_ACTION_THEMES[theme]} hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 min-h-[100px] flex flex-col justify-between`}
  >
    <Icon className="absolute -right-6 -bottom-6 text-white/15 w-36 h-36 rotate-[-8deg] pointer-events-none" />

    {/* <div className="relative z-[1] w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0">
      <Icon className="text-white w-5 h-5" />
    </div> */}

    <div className="relative z-[1]">
      <h3 className="text-white font-semibold text-[15px] leading-tight mb-2 break-words">
        {title}
      </h3>
      <p className="text-white/73 text-[13px] leading-[1.5]">{description}</p>
    </div>
  </div>
);

const Overview = () => {
  const [userDetails, setUserDetails] = useState({ firstname: '', lastname: '', role: '' });
  const [period, setPeriod] = useState('week');
  const [showDropdown, setShowDropdown] = useState(false);
  const siteName = useParams().mda;
  const mdaData = useThemeStore((state) => state.mdaData);
  const navigate = useNavigate();

  const periodcontent = {
    today: 'Today',
    week: 'Last 7 days',
    month: 'Last 30 days',
    year: 'Last 365 days',
  };

  useEffect(() => {
    const user = window.localStorage.getItem('MDA__TOKEN');
    const parser = JSON.parse(user);

    setUserDetails({ firstname: parser.firstname, lastname: parser.lastname, role: parser.role });
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', siteName, period],
    queryFn: () => getDashboardData(siteName, period),
  });

  const { data: subscribersData, isLoading: subscribersLoading } = useQuery({
    queryKey: ['subscribers-count', mdaData?._id],
    queryFn: () => getSubsciptionsByMda(mdaData?._id),
    enabled: !!mdaData?._id,
  });

  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['services-count', mdaData?.fullname],
    queryFn: () => getAllServicesCategory(formattedName(mdaData?.fullname)),
    enabled: !!mdaData?.fullname,
  });

  const subscribersCount = subscribersData?.data?.length ?? 0;
  const servicesCount = servicesData?.data?.length ?? 0;

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return <Loader />;
  }

  const changePeriod = (period) => {
    setPeriod(period);
    setShowDropdown(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const liveUrl = `${window.location.origin}/${siteName}`;
  const liveUrlDisplay = liveUrl.replace(/^https?:\/\//, '');

  const quickActions = [
    {
      theme: 'yellow',
      icon: Globe,
      title: 'View Your Application',
      description: 'See exactly what residents see on your live site in real time.',
      onClick: () => window.open(liveUrl, '_blank'),
    },
    {
      theme: 'blue',
      icon: Suitcase,
      title: 'Add a New Service',
      description: 'Publish a new service so residents can access it.',
      onClick: () => navigate(`/${siteName}/admin/services`),
    },
    {
      theme: 'green',
      icon: PageEdit,
      title: 'Build a New Form',
      description: 'Design a form to collect requests, feedback, or applications.',
      onClick: () => navigate(`/${siteName}/admin/forms`),
    },
    {
      theme: 'purple',
      icon: Group,
      title: 'View Subscribers',
      description: "See everyone currently subscribed to your MDA's updates list.",
      onClick: () => navigate(`/${siteName}/admin/subscribers`),
    },
  ];

  return (
    <>
      <div>
        {/* activity panel */}
        <ActivitySection siteName={siteName} />

        {/* body area */}
        <div className="w-full">
          <div className="relative mb-4 mt-4 flex items-center justify-between">
            <div>
              <p className="text-[21px] font-semibold">
                Hello, {userDetails.firstname} {userDetails.lastname}
              </p>
              <span className="text-[15px] font-medium text-gray-500">
                {' '}
                Good {getGreeting()} - Here is your detailed overview for the {period}{' '}
              </span>
            </div>

            <div
              className="relative z-[999999] flex w-max items-center gap-[5px] rounded-lg border border-[#eee] bg-white px-[14px] py-[10px] text-[14px] cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {periodcontent[period]} <NavArrowDown style={{ marginTop: '3px', fontSize: 12 }} />
            </div>
            {showDropdown && (
              <div className="absolute top-[30px] -right-[10px] z-[999999] w-[180px] rounded-lg border border-[#eee] bg-white shadow-[1px_3px_20px_rgba(0,0,0,0.04)]">
                <li
                  className="list-none px-[14px] py-[6px] text-[14px] font-medium cursor-pointer hover:bg-[#f9fbfc]"
                  onClick={() => changePeriod('today')}
                >
                  Today
                </li>
                <li
                  className="list-none px-[14px] py-[6px] text-[14px] font-medium cursor-pointer hover:bg-[#f9fbfc]"
                  onClick={() => changePeriod('week')}
                >
                  Last 7 days
                </li>
                <li
                  className="list-none px-[14px] py-[6px] text-[14px] font-medium cursor-pointer hover:bg-[#f9fbfc]"
                  onClick={() => changePeriod('month')}
                >
                  Last 30 days
                </li>
                <li
                  className="list-none px-[14px] py-[6px] text-[14px] font-medium cursor-pointer hover:bg-[#f9fbfc]"
                  onClick={() => changePeriod('year')}
                >
                  Last 365 days
                </li>
              </div>
            )}
          </div>

          <div className="grid gap-5">
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3 mt-6">
                {quickActions.map((action) => (
                  <QuickActionCard key={action.title} {...action} />
                ))}
              </div>
              {/* Stat area */}
              <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-5 gap-[14px]">
                <div className="relative h-[150px] rounded-lg bg-white p-[25px]">
                  <div className="absolute top-1/2 right-[25px] flex h-[100px] w-[100px] -translate-y-1/2 items-center justify-center">
                    <img className="w-full" src={ChartUp} alt="" />
                  </div>
                  <div className="text-[10.5px] font-medium uppercase tracking-[2px]">
                    Total Visits
                  </div>
                  <div className="mt-4 text-2xl font-[550]"> {data?.stats?.totalVisits} </div>
                  <div className="mt-[3px] text-[15px] font-light text-[#777]">25% increase</div>
                  <div className="hidden w-[80%] text-sm">
                    Overall number of user visits across all pages.
                  </div>
                </div>

                <div className="relative h-[150px] rounded-lg bg-white p-[25px]">
                  <div className="absolute top-1/2 right-[25px] flex h-[100px] w-[100px] -translate-y-1/2 items-center justify-center">
                    <img className="w-full" src={ChartUp} alt="" />
                  </div>
                  <div className="text-[10.5px] font-medium uppercase tracking-[2px]">
                    Total Users
                  </div>
                  <div className="mt-4 text-2xl font-[550]">{data?.stats?.uniqueSessions}</div>
                  <div className="mt-[3px] text-[15px] font-light text-[#777]">19% increase</div>
                  <div className="hidden w-[80%] text-sm">
                    Users who engaged with the platform within the active period.
                  </div>
                </div>

                <div className="relative h-[150px] rounded-lg bg-white p-[25px]">
                  <div className="absolute top-1/2 right-[25px] flex h-[100px] w-[100px] -translate-y-1/2 items-center justify-center">
                    <img className="w-full" src={ChartUp} alt="" />
                  </div>
                  <div className="text-[10.5px] font-medium uppercase tracking-[2px]">
                    Total Active Users
                  </div>
                  <div className="mt-4 text-2xl font-[550]">{data?.stats?.uniqueUsers}</div>
                  <div className="mt-[3px] text-[15px] font-light text-[#777]">25% increase</div>
                  <div className="hidden w-[80%] text-sm">
                    Users who engaged with the platform within the active period.
                  </div>
                </div>

                <div className="relative h-[150px] rounded-lg bg-white p-[25px]">
                  <div className="absolute top-1/2 right-[25px] flex h-[100px] w-[100px] -translate-y-1/2 items-center justify-center">
                    <img className="w-full" src={ChartDown} alt="" />
                  </div>
                  <div className="text-[10.5px] font-medium uppercase tracking-[2px]">
                    Most Visited Page
                  </div>
                  <div className="mt-4 text-2xl font-[550]">
                    {' '}
                    {data?.stats?.topPages[0]?._id || 'None'}{' '}
                  </div>
                  <div className="mt-[3px] text-[15px] font-light text-[#777]">
                    {data?.stats?.topPages[0]?.count} Page Visits
                  </div>
                  <div className="hidden w-[80%] text-sm">
                    The page with the highest user traffic and engagement.
                  </div>
                </div>

                <div className="relative h-[150px] rounded-lg bg-white p-[25px]">
                  <div className="absolute top-1/2 right-[25px] flex h-[100px] w-[100px] -translate-y-1/2 items-center justify-center">
                    <img className="w-full" src={ChartUp} alt="" />
                  </div>
                  <div className="text-[10.5px] font-medium uppercase tracking-[2px]">
                    Total Services
                  </div>
                  <div className="mt-4 text-2xl font-[550]">
                    {servicesLoading ? '...' : servicesCount}
                  </div>
                  <div className="mt-[3px] text-[15px] font-light text-[#777]">
                    Currently listed
                  </div>
                  <div className="hidden w-[80%] text-sm">
                    Number of government services available on the platform.
                  </div>
                </div>
              </div>

              {/* chart */}
              <VisitsAreaChart
                visitsByDay={data?.stats?.visitsByDay}
                activeUsersByDay={data?.stats?.activeUsersByDay}
                isLoading={isLoading}
              />
              {/* end chart */}
            </div>

            {/* Page visit stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-white p-[25px]">
                <div className="mb-5 text-[11px] font-semibold uppercase tracking-[2px]">
                  Top 5 Visited Pages
                </div>
                <div>
                  {data?.stats?.topPages?.slice(0, 5)?.map((page, index) => (
                    <div
                      key={page._id}
                      className={`flex gap-[10px] p-[10px] pl-0 ${index % 2 === 1 ? 'bg-[#f9f9f9]' : ''}`}
                    >
                      <div>{index + 1}.</div>
                      <div className="text-[15px]">{page._id}</div>
                      <div className="ml-auto font-medium">{page.count}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-white p-[25px]">
                <div className="text-[11px] font-semibold uppercase tracking-[2px] mb-5">
                  Visits Per day
                </div>
                <div>
                  {data?.stats?.visitsByDay
                    ?.slice(0, 5)
                    ?.reverse()
                    ?.map((page, index) => (
                      <div
                        key={page._id}
                        className={`flex gap-[10px] p-[10px] pl-0 ${index % 2 === 1 ? 'bg-[#f9f9f9]' : ''}`}
                      >
                        <div>{index + 1}.</div>
                        <div className="text-[15px]">{formatDate(page._id)}</div>
                        <div className="ml-auto font-medium">{page.count}</div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="rounded-lg bg-white p-[25px]">
                <div className="text-[11px] font-semibold uppercase tracking-[2px] mb-5">
                  Device Breakdown
                </div>
                <div>
                  {[...(data?.stats?.deviceBreakdown || [])]
                    ?.sort((a, b) => b.count - a.count)
                    ?.map((device, index) => (
                      <div
                        key={device._id}
                        className={`flex gap-[10px] p-[10px] pl-0 ${index % 2 === 1 ? 'bg-[#f9f9f9]' : ''}`}
                      >
                        <div>{index + 1}.</div>
                        <div className="text-[15px] capitalize">{device._id || 'Unknown'}</div>
                        <div className="ml-auto font-medium">{device.count}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
