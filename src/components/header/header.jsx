import { useEffect, useState } from 'react';

//------------Start of styles -------------

import '../../styles/components/header.scss';
import '../../styles/global.scss';
import '../../utils/glassmorphism.css';

//----------- End of styles -----------------

import { ArrowUpRight, IconoirProvider, NavArrowDown } from 'iconoir-react';
import lasgLogo from '../../assets/navBar/lasg__logo.png';
import Container from '../container/container';

import { useLocation, useNavigate } from 'react-router';
import SearchQuery from '../search/searchQuery';
import MobileView from './mobileView';
import StripLines from './StripLines';
import Top__header from './top__header';

import night from './mode/night-mode.png';
import day from './mode/sun.png';

// analytics
import ReactGA from 'react-ga';
import { useApp } from '../../stores/app.store';

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isTextDark, setIsTextDark] = useState(true); // Default to dark text (black)
  const darkmode = useApp((state) => state.darkmode);
  const setDarkmode = useApp((state) => state.setDarkmode);

  const { pathname } = useLocation();
  let navigate = useNavigate();

  const [target, setTarget] = useState({
    url: pathname,
    page: `${pathname.split('/')[1] === '' ? 'home' : pathname.split('/')[1]}`,
  });

  //--- States Management - The problem of dynamic animated nests lolz ---

  const closeModal = () => {
    setShowSearch(false);
    document.body.style.overflowY = 'visible';
  };

  const openModal = () => {
    setDarkmode(!darkmode);
  };

  const path = (url, page) => {
    setTarget({ url, page });
  };

  useEffect(() => {
    window.scroll(0, 0);
    setIsMobileOpen(false);
    document.body.style.overflowY = 'visible';

    // 👇 Preserve search params if they exist
    const search = window.location.search;
    navigate(`${target.url}${search}`);
    setActiveState(target.page);
  }, [target]);

  useEffect(() => {
    ReactGA.pageview(pathname);
  }, []);

  const setActiveState = (page) => {
    document.querySelector('.current')?.classList.remove('current');
    const addCurrent = document.querySelector(`.seth_nav [name=${page}]`);

    if (addCurrent !== null) addCurrent.classList.add('current');
  };

  const openMobileMenu = () => {
    setIsMobileOpen(true);
    document.body.style.overflowY = 'hidden';
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    document.body.style.overflowY = 'visible';
  };

  // Dynamic text color adjustment based on background
  // useEffect(() => {
  //   const adjustHeaderTextColor = () => {
  //     const appHeader = document.querySelector('.appHeader');
  //     if (!appHeader) return;

  //     const headerRect = appHeader.getBoundingClientRect();

  //     // Sample point well below the header to account for scroll padding
  //     const sampleY = headerRect.bottom + 120; // Increased to account for 100px scroll padding
  //     const sampleX = window.innerWidth / 2;

  //     // Get the element below the header
  //     appHeader.style.pointerEvents = 'none';
  //     const elementBelow = document.elementFromPoint(sampleX, sampleY);
  //     appHeader.style.pointerEvents = 'auto';

  //     if (elementBelow && elementBelow !== appHeader) {
  //       const bgColor = window.getComputedStyle(elementBelow).backgroundColor;

  //       // Try to get background from parent if current element is transparent
  //       let currentElement = elementBelow;
  //       let computedBg = bgColor;
  //       let attempts = 0;

  //       while (
  //         attempts < 10 &&
  //         (computedBg === 'rgba(0, 0, 0, 0)' ||
  //           computedBg === 'transparent' ||
  //           !computedBg.match(/\d+/g))
  //       ) {
  //         currentElement = currentElement.parentElement;
  //         if (!currentElement || currentElement === document.body) {
  //           // Default to body background if we reach the top
  //           computedBg = window.getComputedStyle(document.body).backgroundColor;
  //           break;
  //         }
  //         computedBg = window.getComputedStyle(currentElement).backgroundColor;
  //         attempts++;
  //       }

  //       const rgb = computedBg.match(/\d+/g);

  //       if (rgb && rgb.length >= 3) {
  //         const r = parseInt(rgb[0]);
  //         const g = parseInt(rgb[1]);
  //         const b = parseInt(rgb[2]);
  //         const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  //         console.log(
  //           'Background color:',
  //           computedBg,
  //           'Luminance:',
  //           luminance,
  //           'Element:',
  //           elementBelow
  //         );
  //         setIsTextDark(luminance > 0.5); // Light background = dark text
  //       } else {
  //         // Fallback to dark text (black) if color detection fails
  //         console.log('Color detection failed, using default dark text (black)');
  //         setIsTextDark(true);
  //       }
  //     } else {
  //       // Fallback to dark text (black) if no element found
  //       console.log('No element found below header, using default dark text (black)');
  //       setIsTextDark(true);
  //     }
  //   };

  //   // Run immediately and after short delays to catch content loading
  //   adjustHeaderTextColor();
  //   const initialTimeout = setTimeout(adjustHeaderTextColor, 100);
  //   const secondTimeout = setTimeout(adjustHeaderTextColor, 500);

  //   let timeoutId;
  //   const debouncedAdjust = () => {
  //     clearTimeout(timeoutId);
  //     timeoutId = setTimeout(adjustHeaderTextColor, 50);
  //   };

  //   window.addEventListener('scroll', debouncedAdjust);
  //   window.addEventListener('resize', debouncedAdjust);
  //   window.addEventListener('load', adjustHeaderTextColor);

  //   return () => {
  //     window.removeEventListener('scroll', debouncedAdjust);
  //     window.removeEventListener('resize', debouncedAdjust);
  //     window.removeEventListener('load', adjustHeaderTextColor);
  //     clearTimeout(timeoutId);
  //     clearTimeout(initialTimeout);
  //     clearTimeout(secondTimeout);
  //   };
  // }, [pathname]); // Re-run when page changes

  //-------------------- End of Nested States Management ---------------------

  return (
    <div id="header">
      {showSearch ? <SearchQuery query="" closeModal={closeModal} /> : null}

      <div className="emergency">
        <div className="emergency__body">
          <div className="longCards">
            <div className="first"></div>
          </div>
        </div>
      </div>

      <IconoirProvider
        iconProps={{
          strokeWidth: 3,
          width: 12,
          height: 12,
        }}
      >
        <div className="appHeader">
          {isMobileOpen ? <MobileView closeModal={closeMobileMenu} /> : null}

          <StripLines />

          <Top__header />

          {/* main navigation links */}

          <div
            className={`navigation glass ${isTextDark ? 'text-dark' : 'text-light'} ${
              darkmode ? 'dark' : 'light'
            }`}
          >
            <Container>
              <div className="menuForm">
                {/* Site Branding Information */}

                <div className="siteBranding">
                  <a href="/" className="logo">
                    {' '}
                    <img src={lasgLogo} alt="Lagos State Official Digital Logo" />{' '}
                  </a>

                  <div className="mobileBurger mobileBurger2" onClick={() => openMobileMenu()}>
                    <div className="men">
                      <div className="bar"></div>
                      <div className="bar"></div>
                    </div>
                    Menu
                  </div>
                </div>

                {/* Main Navigation Links */}

                <div className={`seth_nav ${darkmode ? 'dark' : 'light'}`}>
                  <div onClick={() => path('/', 'home')} className="parentName current" name="home">
                    {' '}
                    Home{' '}
                  </div>

                  <div className="parentName" name="government">
                    Government <NavArrowDown />
                    <div className="hovering">
                      <div className="title">
                        Explore the Lagos State Government, Officials and Parastatals.
                      </div>

                      <a href="/government/elected_officials" className="hover">
                        <p>
                          Members of the State Executive Council <ArrowUpRight />
                        </p>
                        <span>View all the officers elected by lagosians this tenure.</span>
                      </a>

                      <a href="/government/mdas/all" className="hover">
                        <p>
                          Explore Ministries and Departments <ArrowUpRight />{' '}
                        </p>
                        <span>
                          A-Z index of Lagos Government Ministries, Departments & Agencies
                        </span>
                      </a>

                      <a
                        target="_blank"
                        href="https://lagoshouseofassembly.gov.ng/home/our-team/"
                        className="hover"
                      >
                        <p>
                          Legislative Officers <ArrowUpRight />
                        </p>
                        <span>
                          View all the Legislative Officers elected by lagosians this tenure.
                        </span>
                      </a>

                      <a
                        target="_blank"
                        href="https://lagosjudiciary.gov.ng/directories.html#directories"
                        className="hover"
                      >
                        <p>
                          Judiciary Officers <ArrowUpRight />
                        </p>
                        <span>View all the Judiciary Officers appointed for this tenure.</span>
                      </a>
                    </div>
                  </div>

                  <div
                    onClick={() => path('/services', 'services')}
                    className="parentName"
                    name="services"
                  >
                    {' '}
                    Services{' '}
                  </div>

                  <div
                    onClick={() => path('/news/all/1', 'news')}
                    className="parentName"
                    name="news"
                  >
                    {' '}
                    Newsroom{' '}
                  </div>

                  <div
                    onClick={() => path('/events/all/1', 'events')}
                    className="parentName"
                    name="events"
                  >
                    Events{' '}
                  </div>

                  <div
                    onClick={() => path('/connect', 'connect')}
                    className="parentName"
                    name="connect"
                  >
                    {' '}
                    Connect{' '}
                  </div>
                </div>

                {/* <div className="button__search"><div className="parentName searching" onClick={ () => openModal() } > <Search height={17} width={17} strokeWidth={2.4}/> Search </div></div> */}

                <div className="button__search">
                  <div className="parentName searching" onClick={() => openModal()}>
                    {' '}
                    <div className={darkmode ? 'mode darkmode' : 'mode'}>
                      {darkmode ? <img src={day} alt="" /> : <img src={night} alt="" />}
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </IconoirProvider>
    </div>
  );
}
