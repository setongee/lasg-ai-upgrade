import React, { useEffect, useState } from 'react';

//------------Start of styles -------------

import '../../../styles/components/header.scss';
import '../../../styles/global.scss';

//----------- End of styles -----------------

import { ArrowUpRight, IconoirProvider, NavArrowDown, Search } from 'iconoir-react';
import lasgLogo from '../../../assets/navBar/lasg__logo.png';

import { useLocation, useNavigate } from 'react-router';
import SearchQuery from '../../search/searchQuery';
import MobileView from './mobileView';

// analytics
import ReactGA from 'react-ga';
import Container from '../../container/container';

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

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
    setShowSearch(true);
    document.body.style.overflowY = 'hidden';
  };

  const path = (url, page) => {
    setTarget({ url, page });
  };

  useEffect(() => {
    window.scroll(0, 0);
    setIsMobileOpen(false);
    document.body.style.overflowY = 'visible';

    navigate(target.url);
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

          {/* <StripLines />
          <Top__header /> */}

          {/* main navigation links */}

          <div className="navigation">
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

                <div className="seth_nav">
                  <div onClick={() => path('/', 'home')} className="parentName current" name="home">
                    {' '}
                    Home <ArrowUpRight />{' '}
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
                    Services <ArrowUpRight />{' '}
                  </div>

                  <div
                    onClick={() => path('/news/all/1', 'news')}
                    className="parentName"
                    name="news"
                  >
                    {' '}
                    Newsroom <ArrowUpRight />{' '}
                  </div>

                  <div
                    onClick={() => path('/events/all/1', 'events')}
                    className="parentName"
                    name="events"
                  >
                    Events <ArrowUpRight />{' '}
                  </div>

                  <div
                    onClick={() => path('/connect', 'connect')}
                    className="parentName"
                    name="connect"
                  >
                    {' '}
                    Connect <ArrowUpRight />{' '}
                  </div>
                </div>

                {/* <div className="button__search"><div className="parentName searching" onClick={ () => openModal() } > <Search height={17} width={17} strokeWidth={2.4}/> Search </div></div> */}

                <div className="button__search">
                  <div className="parentName searching" onClick={() => openModal()}>
                    {' '}
                    <Search height={20} width={20} strokeWidth={2.7} />{' '}
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
