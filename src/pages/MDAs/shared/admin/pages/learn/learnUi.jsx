import { MediaVideo } from 'iconoir-react';

export const formatDuration = (seconds = 0) => {
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
};

export const formatLongDuration = (seconds = 0) => {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} hr ${m % 60} min`;
};

export const Thumbnail = ({ lesson, className = '' }) => (
  <div
    className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 overflow-hidden ${className}`}
  >
    {lesson.thumbnail ? (
      <img src={lesson.thumbnail} alt="" className="w-full h-full object-cover" />
    ) : (
      <MediaVideo width={28} height={28} />
    )}
  </div>
);

export const Bar = ({ percent, track = 'bg-black/[0.07]', fill = 'bg-[#27ae60]', className = '' }) => (
  <div className={`h-1.5 rounded-full overflow-hidden ${track} ${className}`}>
    <div className={`h-full rounded-full ${fill}`} style={{ width: `${percent}%` }} />
  </div>
);

// Circular progress, drawn as an SVG arc over a dotted track
export const Ring = ({ percent, size = 180, label = 'Completed' }) => {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray="1 9"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27ae60"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[38px] font-medium leading-none">{percent}%</span>
        <span className="text-[13px] text-gray-500 mt-1">{label}</span>
      </div>
    </div>
  );
};
