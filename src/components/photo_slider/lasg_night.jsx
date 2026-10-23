import './lasg_night.scss';

// Seeded so the sky is identical on every render and between sessions.
const seeded = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const rand = seeded(2026);
const STARS = Array.from({ length: 110 }, () => ({
  left: rand() * 100,
  top: rand() * 82,
  size: 1 + rand() * 1.8,
  delay: rand() * 6,
  duration: 2.5 + rand() * 4,
  warm: rand() > 0.82,
}));

// Pole spacing along the road, as % of the scene width.
const LAMPS = [4, 19, 34, 49, 64, 79, 94];

export function NightSky() {
  return (
    <div className="night__sky" aria-hidden="true">
      <div className="night__stars">
        {STARS.map((s, i) => (
          <i
            key={i}
            className={s.warm ? 'warm' : ''}
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="night__cloud c1" />
      <div className="night__cloud c2" />
      <div className="night__shoot s1" />
      <div className="night__shoot s2" />


      <div className="night__horizon" />
    </div>
  );
}

// Lamp posts, theatre searchlights and water reflections. Lives inside `.lasg__illustration`
// so everything stays anchored to the artwork at any width.
export function NightStreet() {
  return (
    <div className="night__street" aria-hidden="true">
      <div className="night__beam b1" />
      <div className="night__beam b2" />

      <div className="night__reflect" />

      {LAMPS.map((left, i) => (
        <div key={left} className={`night__lamp ${i % 3 === 1 ? 'flicker' : ''}`} style={{ left: `${left}%` }}>
          <span className="cone" />
          <span className="pole" />
          <span className="head" />
          <span className="pool" />
        </div>
      ))}
    </div>
  );
}
