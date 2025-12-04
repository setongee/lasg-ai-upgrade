import { Search, StatsUpSquareSolid } from 'iconoir-react';

const ActivitySection = () => {
  return (
    <div className="activity-panel">
      <h2 className="header-activity flex gap-2 items-center uppercase tracking-[2px] text-[11px] mt-5 font-semibold px-[20px]">
        <StatsUpSquareSolid fontSize={14} /> Activity Log
        <Search className="search-activity" />
      </h2>
      <div className="logger-items">
        <div className="loggerItem">
          <p>Yesterday, 6:34pm</p>
          <h2>Admin changed published theme to sunset-drive-merit-government-2025</h2>
        </div>
      </div>
    </div>
  );
};

export default ActivitySection;
