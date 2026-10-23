import { useEffect, useRef, useState } from 'react';
import './photo_slider.scss';
import './searchBorderAnimation.scss';

import Container from '../../container/container';
import SearchQuery from '../../search/searchQuery';

// filters Background
import { ArrowDown, ArrowUp, ArrowUpRight, NavArrowLeft, NavArrowRight } from 'iconoir-react';
import grain from '../../../assets/background/filters/ grain.png';
import { useApp } from '../../../stores/app.store';
import LasgIllustrations from '../lasg_landingpage_illustrations';

import greenFilter from '../../../assets/background/filters/blur__gradient.png';
import orangeFilter from '../../../assets/background/filters/blur__gradient__orange.png';
import { startChat } from '../../ai-search/chatEngine';
import HeroAsk from '../../ai-search/HeroAsk';
import HeroGreeting from '../../ai-search/HeroGreeting';
import { useChatStore } from '../../../stores/chat.store';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [openEmergency, setOpenEmergency] = useState(false);
  const languagePreference = useChatStore((state) => state.languagePreference);

  const darkmode = useApp((state) => state.darkmode);

  const closeSearchModal = () => {
    setShowSearchModal(false);
    setSearchQuery('');
    document.body.style.overflowY = 'visible';
  };

  const checkKey = (e) => {
    if (e.key === 'Enter') {
      handleSearchQuery();
    }
  };

  const handleSearchQuery = () => {
    if (searchQuery !== '' && searchQuery.split('').length >= 3) {
      setShowSearchModal(true);
      document.body.style.overflowY = 'hidden';
    }
  };

  const handleFocus = (e) => {
    document.querySelector('.input__body').style.borderColor = '#108a00';
  };

  const handleBlur = (e) => {
    document.querySelector('.input__body').style.borderColor = '#c5c5c5';
  };

  const handleSearchTab = (e) => {
    setSearchQuery(e.target.innerText.toLowerCase());
    setShowSearchModal(true);
  };

  const handleScroll = (id) => {
    window.scrollTo({
      top:
        document.querySelector(`#${id}`).getBoundingClientRect().top -
        document.body.getBoundingClientRect().top -
        100,
    });
  };

  const handleEmergency = () => {
    document.body.style.overflowY = 'hidden';
    setOpenEmergency(true);
  };

  const closeEmergency = () => {
    document.body.style.overflowY = 'visible';
    setOpenEmergency(false);
  };

  const scrollRight = (type) => {
    const rt = document.getElementById('scrollRecent');
    if (type === 'right') {
      rt.scrollLeft += 150;
    } else {
      rt.scrollLeft -= 150;
    }
  };

  const suggestions = useApp((state) => state.initialSuggestions);

  // ── Suggestions scroll fade + arrows ─────────────────────────────────────
  // Fade whichever edge still has scrollable content, and only show an arrow
  // on that side — both driven by actual scroll position, recomputed on
  // scroll, on resize, and whenever the suggestion list itself changes.
  const suggestionsScrollRef = useRef(null);
  const [canScrollSuggestionsLeft, setCanScrollSuggestionsLeft] = useState(false);
  const [canScrollSuggestionsRight, setCanScrollSuggestionsRight] = useState(false);

  const updateSuggestionsScrollState = () => {
    const el = suggestionsScrollRef.current;
    if (!el) return;
    setCanScrollSuggestionsLeft(el.scrollLeft > 4);
    setCanScrollSuggestionsRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateSuggestionsScrollState();
    const el = suggestionsScrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateSuggestionsScrollState);
    window.addEventListener('resize', updateSuggestionsScrollState);
    return () => {
      el.removeEventListener('scroll', updateSuggestionsScrollState);
      window.removeEventListener('resize', updateSuggestionsScrollState);
    };
  }, [suggestions]);

  const scrollSuggestionsBy = (direction) => {
    suggestionsScrollRef.current?.scrollBy({
      left: direction === 'right' ? 200 : -200,
      behavior: 'smooth',
    });
  };

  const handleClickSuggestion = (message) => {
    if (message === '') return;
    startChat({ text: message, language: languagePreference });
  };

  return (
    <div className={`slider home ${darkmode ? 'dark' : 'light'}`}>
      <div className="filters background__filters">
        <img src={greenFilter} alt="" />
      </div>
      <div className="filters orange__part">
        <img src={orangeFilter} alt="" />
      </div>
      <div className="grain">
        {' '}
        <img src={grain} alt="" />{' '}
      </div>

      {/* Open Space Search */}

      {showSearchModal ? <SearchQuery query={searchQuery} closeModal={closeSearchModal} /> : null}

      <Container customStyle="">
        <div className="photo_container">
          <div className="home__content">
            <HeroGreeting />
          </div>
          <div className={`lasg-ai-chatbot`}>
            <HeroAsk />

            {suggestions?.length > 0 && (
              <div className="suggestions-wrapper">
                <div
                  className={`arrow__nav abs1 ${!canScrollSuggestionsLeft ? 'is-disabled' : ''}`}
                  onClick={() => canScrollSuggestionsLeft && scrollSuggestionsBy('left')}
                  aria-label="Scroll suggestions left"
                >
                  <div className="abs">
                    <NavArrowLeft />
                  </div>
                </div>

                <div className="suggestions" ref={suggestionsScrollRef}>
                  {suggestions.map((item, index) => (
                    <div
                      className="suggestion bg-green-950"
                      key={index}
                      onClick={() => handleClickSuggestion(item)}
                    >
                      <p className="flex items-center gap-2">
                        {item}{' '}
                        <ArrowUpRight fontSize={9} className="text-yellow-200" strokeWidth={2} />
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className={`arrow__nav abs2 ${!canScrollSuggestionsRight ? 'is-disabled' : ''}`}
                  onClick={() => canScrollSuggestionsRight && scrollSuggestionsBy('right')}
                  aria-label="Scroll suggestions right"
                >
                  <div className="abs">
                    <NavArrowRight />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          onClick={() => handleScroll('quickCheck')}
          className="trigger"
          style={{ color: darkmode ? '#fff' : '' }}
        >
          Get Started,{' '}
          <span>
            Scroll down{' '}
            <div className="icon">
              <ArrowDown strokeWidth={2.5} />
            </div>
          </span>
        </div>
      </Container>
      <LasgIllustrations />
    </div>
  );
}
