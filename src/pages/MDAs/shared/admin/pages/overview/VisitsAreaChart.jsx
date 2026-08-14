import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const SERIES = [
  { key: 'visits', label: 'Total Visits', color: '#568203' },
  { key: 'activeUsers', label: 'Active Users', color: '#eb6834' },
];

const CHART_HEIGHT = 280;
const GRID_COLOR = '#e5e7eb';
const AXIS_TEXT_COLOR = '#9ca3af';

const formatCompact = (value) => {
  if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  return `${value}`;
};

const formatDayLabel = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Merge two "by day" arrays (each [{ _id: 'YYYY-MM-DD', count }]) into one
// date-sorted series, filling missing days on either side with 0.
const mergeByDay = (visitsByDay = [], activeUsersByDay = []) => {
  const byDate = new Map();

  visitsByDay.forEach(({ _id, count }) => {
    byDate.set(_id, { date: _id, visits: count, activeUsers: 0 });
  });

  activeUsersByDay.forEach(({ _id, count }) => {
    const existing = byDate.get(_id);
    if (existing) {
      existing.activeUsers = count;
    } else {
      byDate.set(_id, { date: _id, visits: 0, activeUsers: count });
    }
  });

  return Array.from(byDate.values()).sort((a, b) => (a.date > b.date ? 1 : -1));
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white rounded-[6px] shadow-[0_2px_12px_rgba(0,0,0,0.12)] border border-gray-100 px-3 py-2">
      <div className="text-[11px] text-gray-500 mb-1.5">{formatDayLabel(label)}</div>
      {SERIES.map((series) => {
        const entry = payload.find((p) => p.dataKey === series.key);
        if (!entry) return null;
        return (
          <div key={series.key} className="flex items-center gap-2 text-[12px]">
            <span
              className="inline-block w-2.5 h-[2px] rounded-full"
              style={{ backgroundColor: series.color }}
            />
            <span className="font-semibold text-gray-900">{entry.value}</span>
            <span className="text-gray-500">{series.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const VisitsAreaChart = ({ visitsByDay, activeUsersByDay, isLoading }) => {
  const [showTable, setShowTable] = useState(false);

  const rawPoints = useMemo(
    () => mergeByDay(visitsByDay, activeUsersByDay),
    [visitsByDay, activeUsersByDay]
  );

  // Recharts can't draw an area/line through a single point, so pad a lone
  // day into a flat two-point series instead of falling back to a bare dot.
  const points = rawPoints.length === 1 ? [rawPoints[0], { ...rawPoints[0] }] : rawPoints;

  const n = rawPoints.length;

  return (
    <div className="bg-white rounded-[12px] p-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-800">Total Visits vs Active Users</h3>
          <p className="text-[13px] text-gray-500 mt-0.5">Daily traffic for the selected period</p>
        </div>

        <div className="flex items-center gap-5">
          {/* Legend */}
          <div className="flex items-center gap-4">
            {SERIES.map((series) => (
              <div key={series.key} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-[2px] rounded-full"
                  style={{ backgroundColor: series.color }}
                />
                <span className="text-[12px] text-gray-500">{series.label}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            className="text-[12px] font-medium text-gray-500 hover:text-gray-700 underline underline-offset-2"
          >
            {showTable ? 'View chart' : 'View as table'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[280px] flex items-center justify-center text-gray-400 text-[13px]">
          Loading chart…
        </div>
      ) : n === 0 ? (
        <div className="h-[280px] flex items-center justify-center text-gray-400 text-[13px]">
          No visit data for this period yet.
        </div>
      ) : showTable ? (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 pr-4 font-medium">Total Visits</th>
                <th className="py-2 pr-4 font-medium">Active Users</th>
              </tr>
            </thead>
            <tbody>
              {rawPoints.map((p) => (
                <tr key={p.date} className="border-b border-gray-50 last:border-0">
                  <td className="py-2 pr-4 text-gray-700">{formatDayLabel(p.date)}</td>
                  <td className="py-2 pr-4 text-gray-900 font-medium">{p.visits}</td>
                  <td className="py-2 pr-4 text-gray-900 font-medium">{p.activeUsers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-2">
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <AreaChart data={points} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
              <defs>
                {SERIES.map((series) => (
                  <linearGradient
                    key={series.key}
                    id={`visitsAreaChart-${series.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={series.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={series.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid stroke={GRID_COLOR} vertical={false} />

              <XAxis
                dataKey="date"
                tickFormatter={formatDayLabel}
                tick={{ fontSize: 11, fill: AXIS_TEXT_COLOR }}
                axisLine={{ stroke: GRID_COLOR }}
                tickLine={false}
                minTickGap={24}
              />

              <YAxis
                tickFormatter={formatCompact}
                tick={{ fontSize: 11, fill: AXIS_TEXT_COLOR }}
                axisLine={false}
                tickLine={false}
                width={40}
              />

              <Tooltip content={<ChartTooltip />} />

              {SERIES.map((series) => (
                <Area
                  key={series.key}
                  type="monotone"
                  dataKey={series.key}
                  name={series.label}
                  stroke={series.color}
                  strokeWidth={2}
                  fill={`url(#visitsAreaChart-${series.key})`}
                  fillOpacity={1}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
                  dot={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default VisitsAreaChart;
