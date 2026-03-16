import { useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { useThemeStore } from '../../stores/theme.store';
import facebook from './icons/facebook.png';
import instagram from './icons/instagram.png';
import twitter from './icons/twitter.png';
import youtube from './icons/youtube.png';
import './youtube.scss';

export default function YoutubeSocials({ id, viewMode }) {
  const playerRef = useRef(null);
  const socials = useThemeStore((state) => state.mdaData)?.contact?.socials;

  const defaultSocials = {
    x: '#',
    facebook: '#',
    youtube: '#',
    instagram: '#',
  };

  const activeSocials = socials || defaultSocials;

  const opts = {
    playerVars: { autoplay: 0 },
    width: '100%',
  };

  useEffect(() => {
    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.warn('YouTube player cleanup failed:', error.message);
        }
      }
    };
  }, []);

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  viewMode;

  return (
    <div className="social-section flex flex-col items-center w-full gap-[60px] px-4 sm:px-6 md:px-8">
      {/* Section title */}
      <div className="social-section-title text-[24px] sm:text-[32px] md:text-[40px] font-semibold max-w-[90%] md:w-[700px] text-center capitalize leading-[130%]">
        Stay informed. Follow our social channels for updates.
      </div>

      {/* YouTube video */}
      <div className="social-video w-full md:w-[90%]">
        <YouTube
          key={id || 'empty'}
          videoId={id}
          iframeClassName="w-full h-[220px] sm:h-[350px] md:h-[450px] lg:h-[550px] rounded-[10px] bg-[#eee]"
          opts={opts}
          onReady={onReady}
          className={`w-full ${viewMode === 'edit' ? 'pointer-events-none' : ''}`}
        />
      </div>

      {/* Other socials */}
      <div className="flex flex-col items-center mt-[20px] gap-[24px] md:gap-[30px]">
        <div className="social-label font-semibold text-[11px] sm:text-[12px] md:text-[13px] uppercase tracking-[2px] text-center">
          Visit some of our social media profiles
        </div>

        <div className="social-icons flex flex-wrap justify-center gap-[30px] sm:gap-[40px] md:gap-[50px]">
          {activeSocials.x && (
            <a
              href={activeSocials.x}
              target="_blank"
              rel="noreferrer"
              className="social-icon h-[45px] w-[45px] sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110"
            >
              <img src={twitter} alt="Twitter" className="w-full" />
            </a>
          )}

          {activeSocials.facebook && (
            <a
              href={activeSocials.facebook}
              target="_blank"
              rel="noreferrer"
              className="social-icon h-[45px] w-[45px] sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110"
            >
              <img src={facebook} alt="Facebook" className="w-full" />
            </a>
          )}

          {activeSocials.youtube && (
            <a
              href={activeSocials.youtube}
              target="_blank"
              rel="noreferrer"
              className="social-icon h-[45px] w-[45px] sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110"
            >
              <img src={youtube} alt="YouTube" className="w-full" />
            </a>
          )}

          {activeSocials.instagram && (
            <a
              href={activeSocials.instagram}
              target="_blank"
              rel="noreferrer"
              className="social-icon h-[45px] w-[45px] sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110"
            >
              <img src={instagram} alt="Instagram" className="w-full" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
