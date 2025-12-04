import { useQuery } from '@tanstack/react-query';
import { NavArrowDown } from 'iconoir-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDate } from '../../../../../../middleware/middleware';
import { getDashboardData } from '../../../../api/admin/dashboard';
import ActivitySection from './ActivitySection';
import ChartDown from './chart-down.svg';
import ChartUp from './chart-up.svg';
import './overview.scss';

const Overview = () => {
  const [userDetails, setUserDetails] = useState({ firstname: '', lastname: '', role: '' });
  const [period, setPeriod] = useState('today');
  const [showDropdown, setShowDropdown] = useState(false);
  const siteName = useParams().mda;

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

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const changePeriod = (period) => {
    setPeriod(period);
    setShowDropdown(false);
  };

  return (
    <>
      <div className="admin-overview">
        {/* activity panel */}
        <ActivitySection />

        {/* body area */}
        <div className="overview-body">
          <div className="analytics-title flex items-center justify-between">
            <p>
              Hello, {userDetails.firstname} {userDetails.lastname}
            </p>
            <div
              className="filterStat flex items-center gap-[5px] text-[14px] cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {periodcontent[period]} <NavArrowDown style={{ marginTop: '3px', fontSize: 12 }} />
            </div>
            {showDropdown && (
              <div className="filter-dropdown">
                <li onClick={() => changePeriod('today')}>Today</li>
                <li onClick={() => changePeriod('week')}>Last 7 days</li>
                <li onClick={() => changePeriod('month')}>Last 30 days</li>
                <li onClick={() => changePeriod('year')}>Last 365 days</li>
              </div>
            )}
          </div>
          {/* Stat area */}
          <div className="admin-statistics">
            <div className="stat-card">
              <div className="stat-icon">
                <img src={ChartUp} alt="" />
              </div>
              <div className="stat-text">Total Visits</div>
              <div className="stat-number"> {data?.stats?.totalVisits} </div>
              <div className="stat-track">25% increase</div>
              <div className="stat-description">
                Overall number of user visits across all pages.
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <img src={ChartUp} alt="" />
              </div>
              <div className="stat-text">Total Users</div>
              <div className="stat-number">{data?.stats?.uniqueSessions}</div>
              <div className="stat-track">19% increase</div>
              <div className="stat-description">
                Users who engaged with the platform within the active period.
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <img src={ChartUp} alt="" />
              </div>
              <div className="stat-text">Total Active Users</div>
              <div className="stat-number">{data?.stats?.uniqueUsers}</div>
              <div className="stat-track">25% increase</div>
              <div className="stat-description">
                Users who engaged with the platform within the active period.
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <img src={ChartDown} alt="" />
              </div>
              <div className="stat-text">Most Visited Page</div>
              <div className="stat-number"> {data?.stats?.topPages[0]?._id || 'None'} </div>
              <div className="stat-track">{data?.stats?.topPages[0]?.count} Page Visits</div>
              <div className="stat-description">
                The page with the highest user traffic and engagement.
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <img src={ChartUp} alt="" />
              </div>
              <div className="stat-text">Total Subscribers</div>
              <div className="stat-number">500+</div>
              <div className="stat-track">25% increase</div>
              <div className="stat-description">
                Total users currently subscribed to updates or newsletters.
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <img src={ChartUp} alt="" />
              </div>
              <div className="stat-text">Total Services</div>
              <div className="stat-number">35</div>
              <div className="stat-track">Updated Today</div>
              <div className="stat-description">
                Number of government services available on the platform.
              </div>
            </div>
          </div>
          {/* Page visit stats */}
          <div className="visit-full flex gap-[10px]">
            <div className="stat-section">
              <div className="stat-title">Top 5 Visited Pages</div>
              <div className="vis">
                {data?.stats?.topPages?.slice(0, 5)?.map((page, index) => (
                  <div className="page-visit">
                    <div className="page-visit__number">{index + 1}.</div>
                    <div className="page-visit__name">{page._id}</div>
                    <div className="page-visit__count">{page.count}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="stat-section">
              <div className="stat-title">Visits Per day</div>
              <div className="vis">
                {data?.stats?.visitsByDay
                  ?.slice(0, 5)
                  ?.reverse()
                  ?.map((page, index) => (
                    <div className="page-visit">
                      <div className="page-visit__number">{index + 1}.</div>
                      <div className="page-visit__name">{formatDate(page._id)}</div>
                      <div className="page-visit__count">{page.count}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
