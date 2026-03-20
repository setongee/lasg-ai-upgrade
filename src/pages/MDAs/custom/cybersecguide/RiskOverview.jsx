import { Check } from 'iconoir-react';
import { useEffect, useRef, useState } from 'react';

export default function CyberRiskOverview() {
  const [animatedStats, setAnimatedStats] = useState({
    '₦1.1Tr.': 0,
    '$4.45M': 0,
    '22M+': 0,
  });
  const [animatedProgress, setAnimatedProgress] = useState({
    'SME Readiness Gap': 0,
    'Enterprise Adoption': 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  const stats = [
    { val: '₦1.1Tr.', lbl: 'Lost 3 yrs', target: 1.1 },
    { val: '$4.45M', lbl: 'Per breach', target: 4.45 },
    { val: '22M+', lbl: 'Users at risk', target: 22 },
  ];

  const progress = [
    { label: 'SME Readiness Gap', pct: 72 },
    { label: 'Enterprise Adoption', pct: 48 },
  ];

  const checks = [
    { done: true, text: 'MFA enforcement recommended' },
    { done: true, text: '72-hour incident reporting' },
    { done: true, text: 'NDPA data protection aligned' },
    { done: false, text: 'Staff awareness training needed' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Animate stats
            stats.forEach((stat) => {
              const duration = 2000;
              const steps = 60;
              const increment = stat.target / steps;
              let current = 0;

              const timer = setInterval(() => {
                current += increment;
                if (current >= stat.target) {
                  current = stat.target;
                  clearInterval(timer);
                }

                setAnimatedStats((prev) => ({
                  ...prev,
                  [stat.val]: current,
                }));
              }, duration / steps);
            });

            // Animate progress bars
            progress.forEach((prog) => {
              const duration = 1500;
              const steps = 30;
              const increment = prog.pct / steps;
              let current = 0;

              const timer = setInterval(() => {
                current += increment;
                if (current >= prog.pct) {
                  current = prog.pct;
                  clearInterval(timer);
                }

                setAnimatedProgress((prev) => ({
                  ...prev,
                  [prog.label]: current,
                }));
              }, duration / steps);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasAnimated, stats, progress]);

  const formatStatValue = (val, target) => {
    if (val.includes('₦')) {
      return `₦${target.toFixed(1)}Tr.`;
    } else if (val.includes('$')) {
      return `$${target.toFixed(2)}M`;
    } else if (val.includes('M+')) {
      return `${Math.round(target)}M+`;
    }
    return val;
  };

  return (
    <div
      ref={containerRef}
      className="h-full border-[#e7e7e7] pl-20 flex items-center justify-center"
    >
      <div className="bg-white rounded-4xl p-9 w-[450px] h-content">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-slate-900 text-base font-bold m-0">Cyber Risk Overview</h3>
          <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-md border border-green-200 tracking-wide">
            Lagos 2026
          </span>
        </div>

        {/* Stat Row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {stats.map(({ val, lbl, target }) => (
            <div
              key={lbl}
              className="flex-1 bg-white rounded-xl p-3 text-center border border-slate-200"
            >
              <div className="text-gray-800 font-extrabold text-md mb-1">
                {formatStatValue(val, animatedStats[val] || 0)}
              </div>
              <div className="text-slate-500 text-xs">{lbl}</div>
            </div>
          ))}
        </div>

        {/* Progress Bars */}
        <div className="flex flex-col gap-6 mb-8">
          {progress.map(({ label, pct }) => (
            <div key={label}>
              <div className="flex justify-between mb-2">
                <span className="text-slate-600 font-medium text-xs">{label}</span>
                <span className="text-green-600 text-xs font-bold">
                  {Math.round(animatedProgress[label] || 0)}%
                </span>
              </div>
              <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-700 transition-all duration-300 ease-out"
                  style={{ width: `${animatedProgress[label] || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Checklist */}
        <div className="flex flex-col gap-4">
          {checks.map(({ done, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border
                ${
                  done
                    ? 'bg-green-50 border-green-500 text-green-600'
                    : 'bg-amber-50 border-amber-400 text-amber-600'
                }`}
              >
                {done ? <Check fontSize={9} strokeWidth={2} /> : '!'}
              </div>
              <span className="text-slate-700 text-sm">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
