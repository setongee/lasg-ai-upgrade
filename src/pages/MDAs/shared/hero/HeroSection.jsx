import { ArrowUpRight } from 'iconoir-react';
import { useEffect, useState } from 'react';
import defaultLasgImage from '../assets/lasg__logo.png';
import Button from '../button/Button';
import Wrapper from '../Wrapper/Wrapper';
import { getGradientCss } from './heroGradients';

const HERO_STYLES = [
  'fullBleed',
  'boxedOverlay',
  'splitPhoto',
  'splitTextImageBelow',
  'centeredTextImageBelow',
  'fullBleedCentered',
  'colorBackground',
  'groundedSplit',
  'splitCircleFloating',
];

const BUTTON_CLASS =
  'mt-[10px] bg-[var(--theme-accent,#108a00)] text-[var(--theme-accent-text,#ffffff)] rounded-[5px] transition-opacity duration-200 hover:opacity-90 uppercase tracking-[2px] text-[11px] flex items-center gap-2';

const SLIDE_INTERVAL_MS = 5000;

const HeroImage = ({ images, slideshowEnabled }) => {
  const list = (images || []).filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const showSlider = slideshowEnabled && list.length > 1;

  useEffect(() => {
    if (!showSlider) return;
    setActiveIndex(0);
    const id = setInterval(() => {
      setActiveIndex((current) => (current + 1) % list.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [showSlider, list.length]);

  if (list.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#00484d]">
        <img
          src={defaultLasgImage}
          alt="Lagos State Government"
          className="w-[35%] max-w-[160px] object-contain opacity-90"
        />
      </div>
    );
  }

  if (showSlider) {
    return (
      <div className="relative w-full h-full">
        {list.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt=""
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-[2]">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(i);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === activeIndex ? 'bg-white' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return <img src={list[0]} alt="" draggable={false} className="w-full h-full object-cover" />;
};

const HeroSection = ({
  style,
  title,
  subtitle,
  buttonText,
  buttonLink,
  images,
  legacyImage,
  secondaryImage,
  slideshowEnabled,
  bgType,
  bgColor,
  bgGradient,
  isEdit,
  viewMode,
  isSelected,
  onSelect,
}) => {
  const resolvedStyle = HERO_STYLES.includes(style) ? style : 'splitPhoto';
  const imageList = images?.length ? images : legacyImage ? [legacyImage] : [];

  const handleButtonClick = () => {
    if (!buttonLink) return;
    if (buttonLink.startsWith('#')) {
      document.querySelector(buttonLink)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(buttonLink, '_blank');
    }
  };

  const editableClass =
    isEdit && viewMode === 'edit'
      ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
      : '';
  const activeClass = isSelected ? '!border-green-500 active_component' : '';
  const handleClick = () => {
    if (isEdit && viewMode === 'edit') onSelect?.();
  };

  const cta = buttonText && (
    <Button customClass={BUTTON_CLASS} action={handleButtonClick}>
      {buttonText} <ArrowUpRight width={16} />
    </Button>
  );

  //fullBleed
  if (resolvedStyle === 'fullBleed') {
    return (
      <div
        className={`relative flex items-center min-h-[600px] md:h-[60vh] overflow-clip ${editableClass} ${activeClass}`}
        onClick={handleClick}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
          <HeroImage images={imageList} slideshowEnabled={slideshowEnabled} />
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.55)_45%,rgba(0,0,0,0.35)_100%)]" />
        </div>
        <Wrapper>
          <div className="relative z-[1] max-w-[800px] py-[60px] max-[500px]:py-[40px] text-white">
            <h1 className="font-[650] tracking-[-0.5px] leading-[1.15] text-[clamp(32px,5vw,54px)] mb-5">
              {title}
            </h1>
            <p className="leading-[1.6] text-[clamp(15px,1.6vw,17px)] max-w-[600px] mb-5 text-[#f1f1f1]">
              {subtitle}
            </p>
            {cta}
          </div>
        </Wrapper>
      </div>
    );
  }

  // full-screen solid color or gradient background, no image
  if (resolvedStyle === 'colorBackground') {
    const background = bgType === 'solid' ? bgColor || '#0f9b6c' : getGradientCss(bgGradient);
    return (
      <div
        className={`relative flex items-center py-10 sm:py-20 overflow-clip ${editableClass} ${activeClass}`}
        style={{ background }}
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-black/15" />
        <Wrapper>
          <div className="relative z-[1] max-w-[800px] mx-auto py-[60px] max-[500px]:py-[40px] text-white text-center flex flex-col items-center">
            <h1 className="font-[650] tracking-[-0.5px] leading-[1.15] text-[clamp(32px,5vw,54px)] mb-5">
              {title}
            </h1>
            <p className="leading-[1.6] text-[clamp(15px,1.6vw,17px)] max-w-[600px] mb-5 text-[#f1f1f1]">
              {subtitle}
            </p>
            {cta}
          </div>
        </Wrapper>
      </div>
    );
  }

  // fullBleed, centered content
  if (resolvedStyle === 'fullBleedCentered') {
    return (
      <div
        className={`relative flex items-center min-h-[600px] md:h-[60vh] overflow-clip ${editableClass} ${activeClass}`}
        onClick={handleClick}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
          <HeroImage images={imageList} slideshowEnabled={slideshowEnabled} />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <Wrapper>
          <div className="relative z-[1] max-w-[800px] mx-auto py-[60px] max-[500px]:py-[40px] text-white text-center flex flex-col items-center">
            <h1 className="font-[650] tracking-[-0.5px] leading-[1.15] text-[clamp(32px,5vw,54px)] mb-5">
              {title}
            </h1>
            <p className="leading-[1.6] text-[clamp(15px,1.6vw,17px)] max-w-[600px] mb-5 text-[#f1f1f1]">
              {subtitle}
            </p>
            {cta}
          </div>
        </Wrapper>
      </div>
    );
  }

  // boxed overlay
  if (resolvedStyle === 'boxedOverlay') {
    return (
      <div className={`${editableClass} ${activeClass}`} onClick={handleClick}>
        <Wrapper>
          <div
            className={`relative w-full flex flex-col sm:block gap-6 ${isEdit ? 'sm:mt-10' : 'sm:mt-[120px] lg:mt-[160px]'} sm:mb-[42px] mt-[105px] sm:h-[500px] md:h-[600px]`}
          >
            {/* Text: stacked above the image on mobile, overlaid on top of it from sm up */}
            <div className="sm:absolute sm:inset-0 sm:z-[1] flex flex-col justify-center sm:py-[6%] sm:px-[7%] sm:max-w-[100%] md:max-w-[80%] lg:max-w-[60%] text-[#131313] sm:text-white">
              <h1 className="font-[650] tracking-[-0.5px] leading-[1.1] text-[32px] sm:text-[40px] lg:text-[54px] mb-4 sm:mb-6">
                {title}
              </h1>
              <p className="leading-[1.6] text-[14px] md:text-[15px] lg:text-base mb-6 sm:mb-6 text-[#666] sm:text-[#f1f1f1] sm:max-w-[500px]">
                {subtitle}
              </p>
              {cta}
            </div>

            {/* Image */}
            <div className="relative w-full h-[200px] sm:aspect-auto sm:h-full rounded-[16px] sm:rounded-[40px] overflow-hidden bg-black">
              <HeroImage images={imageList} slideshowEnabled={slideshowEnabled} />
              <div className="hidden sm:block absolute inset-0 bg-[linear-gradient(100deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.5)_70%,rgba(0,0,0,0)_85%)]" />
            </div>
          </div>
        </Wrapper>
      </div>
    );
  }

  // split text, image below
  if (resolvedStyle === 'splitTextImageBelow') {
    return (
      <div className={`${editableClass} ${activeClass}`} onClick={handleClick}>
        <Wrapper>
          <div className={`flex flex-col ${isEdit ? 'mt-10' : 'mt-[50px] lg:mt-[140px]'}`}>
            <div className="flex justify-between gap-10 items-start pb-10 max-[900px]:flex-col max-[900px]:items-center max-[900px]:text-center max-[900px]:gap-6 max-[900px]:pb-6 my-10 mt-20">
              <h1 className="flex-1 min-w-0 max-w-[600px] font-[650] tracking-[-0.5px] leading-[1.24] text-[44px] max-[900px]:text-[32px] max-[500px]:text-[28px]">
                {title}
              </h1>
              <div className="flex-1 min-w-0 max-w-[480px] flex flex-col gap-5 max-[900px]:items-center">
                <p className="leading-[1.6] text-[15px] sm:text-base text-[#666]">{subtitle}</p>
                {cta}
              </div>
            </div>
            <div className="relative w-full h-[280px] sm:h-[420px] lg:h-[520px] rounded-[24px] overflow-hidden mb-15">
              <HeroImage images={imageList} slideshowEnabled={slideshowEnabled} />
            </div>
          </div>
        </Wrapper>
      </div>
    );
  }

  // centered text, image below
  if (resolvedStyle === 'centeredTextImageBelow') {
    return (
      <div className={`${editableClass} ${activeClass}`} onClick={handleClick}>
        <Wrapper>
          <div
            className={`flex flex-col items-center text-center gap-5 pb-10 max-[900px]:pb-6 ${isEdit ? 'mt-10' : 'mt-[70px] lg:mt-[140px]'}`}
          >
            <h1 className="max-w-[900px] font-[650] tracking-[-0.5px] leading-[1.25] text-[44px] max-[900px]:text-[36px] max-[500px]:text-[28px] mt-12 ">
              {title}
            </h1>
            <p className="max-w-[700px] leading-[1.6] text-[15px] sm:text-base text-[#666]">
              {subtitle}
            </p>
            {cta}
            <div className="relative w-full h-[280px] sm:h-[420px] lg:h-[520px] rounded-[24px] overflow-hidden mt-6">
              <HeroImage images={imageList} slideshowEnabled={slideshowEnabled} />
            </div>
          </div>
        </Wrapper>
      </div>
    );
  }

  // bottom-aligned split, underlined heading, image keeps its own footing (sto-inspired)
  if (resolvedStyle === 'groundedSplit') {
    return (
      <Wrapper>
        <div
          className={`flex justify-between items-center gap-10 py-[0px] min-h-[400px] md:h-max lg:min-h-[550px] 2xl:min-h-[650px] max-[900px]:flex-col max-[900px]:items-center max-[900px]:text-center max-[900px]:py-10 max-[900px]:gap-6 max-[900px]:min-h-0 ${editableClass} ${activeClass}`}
          onClick={handleClick}
        >
          <div className="flex flex-col flex-1 min-w-0 max-w-[700px] gap-6 max-[900px]:max-w-full max-[900px]:items-center">
            <h1 className="font-[650] tracking-[-0.5px] md:leading-[1.45] leading-[1.45] text-[54px] underline decoration-2 underline-offset-[10px] max-[900px]:text-[38px] max-[500px]:text-[30px]">
              {title}
            </h1>
            <p className="leading-[1.6] text-[clamp(15px,1.3vw,17px)] max-w-[80%] mt-8 max-[900px]:max-w-full max-[900px]:mt-0 text-[#666]">
              {subtitle}
            </p>
            {cta && <div className="max-[900px]:mx-auto">{cta}</div>}
          </div>
          <div className=" lg:w-120 max-[1250px]:hidden  2xl:w-150 absolute right-0 rounded-none h-full overflow-hidden">
            <HeroImage images={imageList} slideshowEnabled={slideshowEnabled} />
          </div>
        </div>
      </Wrapper>
    );
  }

  // text left, two arched/overlapping photos right (mot-inspired)
  if (resolvedStyle === 'splitCircleFloating') {
    return (
      <Wrapper>
        <div
          className={`flex justify-between items-center gap-10 max-[1200px]:min-h-[100%] max-[1200px]:py-16 max-[500px]:py-14 max-[500px]:pb-8 min-h-[800px] max-[900px]:flex-col max-[900px]:text-center max-[900px]:gap-8 ${editableClass} ${activeClass}`}
          onClick={handleClick}
        >
          <div className="flex flex-col flex-1 min-w-0 max-w-[640px] gap-6 justify-center max-[900px]:max-w-full max-[900px]:items-center">
            <h1 className="font-[650] tracking-[-0.5px] leading-[1.15] text-[52px] max-[900px]:text-[38px] max-[500px]:text-[30px]">
              {title}
            </h1>
            <p className="leading-[1.6] text-[clamp(15px,1.3vw,17px)] max-w-[75%] max-[900px]:max-w-full text-[#666]">
              {subtitle}
            </p>
            {cta && <div className="max-[900px]:mx-auto">{cta}</div>}
          </div>
          <div className="relative overflow-hidden max-[600px]:mt-4">
            <div className="max-[600px]:w-[calc(100%-100px)] max-[600px]:mx-auto overflow-hidden">
              <div className="max-[1200px]:hidden max-[600px]:block max-[600px]:w-[250px] max-[600px]:h-[270px] 2xl:w-[400px] lg:w-[350px] mr-[175px] h-[420px] bg-gray-100 rounded-tr-[45%] overflow-hidden z-[1]">
                <HeroImage images={imageList} slideshowEnabled={slideshowEnabled} />
              </div>
              <div className="max-[1200px]:hidden max-[600px]:block max-[600px]:w-[250px] relative max-[600px]:h-[270px] 2xl:w-[400px] lg:w-[350px] bg-gray-100 max-[600px]:mr-[0px] -mt-50 h-[420px] rounded-tl-[45%] max-[600px]:border-[10px] border-[15px] border-white overflow-hidden z-[2] float-right">
                <HeroImage
                  images={secondaryImage ? [secondaryImage] : []}
                  slideshowEnabled={false}
                />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  // splitPhoto
  return (
    <Wrapper>
      <div
        className={`flex justify-between items-center gap-10 py-[60px] max-[900px]:flex-col max-[900px]:text-center max-[900px]:py-10 max-[900px]:gap-6 ${editableClass} ${activeClass}`}
        onClick={handleClick}
      >
        <div className="flex flex-col flex-1 min-w-0 max-w-[740px] gap-6 justify-center max-[900px]:max-w-full max-[900px]:items-center">
          <h1 className="font-[650] tracking-[-0.5px] leading-[1.15] text-[54px] max-[900px]:text-[42px] max-[500px]:text-[32px]">
            {title}
          </h1>
          <p className="leading-[1.6] text-[clamp(15px,1.3vw,17px)] max-w-[80%] max-[900px]:max-w-full text-[#666]">
            {subtitle}
          </p>
          {cta && <div className="max-[900px]:mx-auto">{cta}</div>}
        </div>
        <div className="flex-none w-[clamp(280px,40vw,550px)] h-[clamp(320px,42vw,600px)] rounded-xl overflow-hidden max-[900px]:w-full max-[900px]:max-w-[500px] max-[900px]:h-auto max-[900px]:aspect-[4/3]">
          <HeroImage images={imageList} slideshowEnabled={slideshowEnabled} />
        </div>
      </div>
    </Wrapper>
  );
};

export default HeroSection;
