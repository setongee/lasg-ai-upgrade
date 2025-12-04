import { useEffect, useState } from 'react';
import './photo_slider.scss';
import './searchBorderAnimation.scss';

import Container from '../../container/container';
import SearchQuery from '../../search/searchQuery';

// filters Background
import { ArrowDown, ArrowUp, ArrowUpRight, Language, NavArrowDown } from 'iconoir-react';
import grain from '../../../assets/background/filters/ grain.png';
import { useApp } from '../../../stores/app.store';
import LasgIllustrations from '../lasg_landingpage_illustrations';

import greenFilter from '../../../assets/background/filters/blur__gradient.png';
import orangeFilter from '../../../assets/background/filters/blur__gradient__orange.png';
import { useChatStore } from '../../../stores/chat.store';
import LanguageModal from '../../language/LanguageModal';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [openEmergency, setOpenEmergency] = useState(false);
  const setCheckIsChatOpen = useChatStore((state) => state.setCheckIsChatOpen);
  const setLanguagePreference = useChatStore((state) => state.setLanguagePreference);
  const languagePreference = useChatStore((state) => state.languagePreference);
  const addMessage = useChatStore((state) => state.addMessage);
  const [chatInput, setChatInput] = useState('');

  const [language, setLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const LANGUAGES = {
    en: { name: 'English', code: 'en' },
    yo: { name: 'Yorùbá', code: 'yo' },
    ig: { name: 'Igbo', code: 'ig' },
    ha: { name: 'Hausa', code: 'ha' },
  };

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

  const handleSendMessage = () => {
    if (chatInput === '') return;
    addMessage(chatInput);
    setCheckIsChatOpen(true);
    setChatInput('');
  };

  const handleClickSuggestion = (message) => {
    if (message === '') return;
    addMessage(message);
    setCheckIsChatOpen(true);
    setChatInput('');
  };

  useEffect(() => {
    console.log(languagePreference);
  }, [languagePreference]);

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

      <Container>
        <div className="photo_container">
          <div className="home__content">
            <div className={`text__area ${darkmode ? 'dark' : 'light'}`}>
              Smarter Access to Lagos Services for{' '}
              <span style={{ color: '#108a00' }}>Everyone</span>
            </div>
            {/* <p>Empowering citizens with easier access to state services and opportunities.</p> */}
          </div>
          <div className={`lasg-ai-chatbot ${darkmode ? 'dark' : 'light'}`}>
            <div className="chat-textarea">
              <div className="hero-type"></div>

              <textarea
                name="chatInput"
                id="chatInput"
                placeholder="Ask Eko Smart about Lagos State services..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              ></textarea>
              <button className="send-chat" onClick={() => handleSendMessage()}>
                <ArrowUp strokeWidth={2} />
              </button>
              <div
                className="language-preference flex items-center gap-[6px]"
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              >
                <div>
                  <Language className="text-[12px]" />
                </div>
                <p className="font-medium">{LANGUAGES[languagePreference].name}</p>
                <div>
                  <NavArrowDown className="text-[12px]" />
                </div>
              </div>

              {showLanguageMenu ? (
                <LanguageModal
                  closeModal={() => setShowLanguageMenu(false)}
                  language={languagePreference}
                  setLanguage={setLanguagePreference}
                  setShowLanguageMenu={setShowLanguageMenu}
                  LANGUAGES={LANGUAGES}
                />
              ) : null}
            </div>

            <div className="suggestions">
              {suggestions?.length > 0 &&
                suggestions?.map((item, index) => (
                  <div
                    className="suggestion"
                    key={index}
                    onClick={() => handleClickSuggestion(item)}
                  >
                    <p>{item}</p>
                    <div className="arrowDesign">
                      <ArrowUpRight />
                    </div>
                  </div>
                ))}
            </div>

            {/* <div className="quickSearches">

              <div className="arrow__nav abs1" onClick={() => scrollRight('left')}>
                {' '}
                <div className="abs">
                  <NavArrowLeft />
                </div>{' '}
              </div>

              <div className="pills__searches" id="scrollRecent">
                {suggestions?.length > 0 &&
                  suggestions?.map((item, index) => (
                    <p onClick={(e) => handleSearchTab(e)} key={index}>
                      {item}
                    </p>
                  ))}
              </div>

              <div className="arrow__nav abs2" onClick={() => scrollRight('right')}>
                {' '}
                <div className="abs">
                  <NavArrowRight />
                </div>{' '}
              </div>
            </div> */}
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
