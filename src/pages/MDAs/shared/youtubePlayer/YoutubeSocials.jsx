import YouTube from 'react-youtube';
import facebook from './icons/facebook.png';
import instagram from './icons/instagram.png';
import twitter from './icons/twitter.png';
import youtube from './icons/youtube.png';

export default function YoutubeSocials() {
  const opts = {
    playerVars: { autoplay: 0 },
    width: '100%',
  };

  const socials = {
    twitter: 'https://twitter.com/LSMOH',
    facebook: 'https://web.facebook.com/lsmoh',
    youtube: 'https://www.youtube.com/channel/UCZzZf_6m2Wm60fBNKp0-l3w',
    instagram: 'https://www.instagram.com/lagoshealth/',
  };

  return (
    <div className="flex flex-col items-center w-full gap-[60px] px-4 sm:px-6 md:px-8">
      {/* Section title */}
      <div className="text-[24px] sm:text-[32px] md:text-[40px] font-semibold max-w-[90%] md:w-[700px] text-center capitalize leading-[130%]">
        Stay informed. Follow our social channels for updates.
      </div>

      {/* YouTube video */}
      <div className="w-full md:w-[90%]">
        <YouTube
          videoId="rbQvA0LHh2k"
          iframeClassName="w-full h-[220px] sm:h-[350px] md:h-[450px] lg:h-[550px] rounded-[10px] bg-[#eee]"
          opts={opts}
          className="w-full"
        />
      </div>

      {/* Other socials */}
      <div className="flex flex-col items-center mt-[20px] gap-[24px] md:gap-[30px]">
        <div className="font-semibold text-[11px] sm:text-[12px] md:text-[13px] uppercase tracking-[2px] text-center">
          Visit some of our social media profiles
        </div>

        <div className="flex flex-wrap justify-center gap-[30px] sm:gap-[40px] md:gap-[50px]">
          <a
            href={socials.twitter}
            target="_blank"
            rel="noreferrer"
            className="h-[45px] w-[45px] sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110"
          >
            <img src={twitter} alt="Twitter" className="w-full" />
          </a>

          <a
            href={socials.facebook}
            target="_blank"
            rel="noreferrer"
            className="h-[45px] w-[45px] sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110"
          >
            <img src={facebook} alt="Facebook" className="w-full" />
          </a>

          <a
            href={socials.youtube}
            target="_blank"
            rel="noreferrer"
            className="h-[45px] w-[45px] sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110"
          >
            <img src={youtube} alt="YouTube" className="w-full" />
          </a>

          <a
            href={socials.instagram}
            target="_blank"
            rel="noreferrer"
            className="h-[45px] w-[45px] sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110"
          >
            <img src={instagram} alt="Instagram" className="w-full" />
          </a>
        </div>
      </div>
    </div>
  );
}
