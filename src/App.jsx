import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router';
import './App.css';
import Chatbot from './components/chatbot/Chatbot';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Loader from './components/loader/loader';
import Cookie from './cookie';
import { useVisitTracker } from './hooks/useVisitTracker';
import RouterClass from './routes/router';
import { useApp } from './stores/app.store';
import './styles/root.css';
import './styles/toast.css';
import { loadInitialSuggestions } from './utils/generateInitialSuggestions';
import { useRouteType } from './utils/routeUtils';
const TRACKING_ID = 'G-NB0QB4RDM7'; // LASG Main Site Tracking ID

function App() {
  const [cookies, setCookies] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const setSuggestions = useApp((state) => state.setSuggestions);
  const { pathname } = useLocation();
  const location = useLocation();
  const currentPage = location.pathname.replace('/', ''); // e.g. "health"
  const { isPublicRoute, isAdminRoute } = useRouteType();

  // MDA microsite pages log their own visits (with the real siteName) from
  // Page.jsx — this only covers the fixed routes on the main site.
  useVisitTracker(isPublicRoute ? 'main' : null, currentPage || 'home');

  // Block first paint until the initial page's chat suggestions are ready —
  // from a (localStorage, 60-min) cache if fresh, otherwise generated fresh.
  // Deliberately runs once on mount only, not on every route change: this is
  // about the first hard page load, not client-side navigation, and
  // loadInitialSuggestions never rejects (falls back to a fixed list on any
  // AI-provider failure), so this can never leave the site stuck loading.
  useEffect(() => {
    if (isAdminRoute) {
      setAppReady(true);
      return;
    }

    let cancelled = false;
    // Matches Chatbot.jsx's `safePage` normalization so both read/write the
    // same cache entry for a given page instead of missing each other.
    loadInitialSuggestions((currentPage || 'general').toLowerCase()).then((suggestions) => {
      if (cancelled) return;
      setSuggestions(suggestions);
      setAppReady(true);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cookieInfo = Cookies.get('lasgConsent');

    if (cookieInfo === undefined) {
      setCookies(false);

      if (pathname === '/privacy') setCookies(true);
    } else {
      const jsonRes = JSON.parse(cookieInfo);

      if (jsonRes.status === 'accept') {
        setCookies(true);
        ReactGA.initialize(TRACKING_ID);
      } else {
        setCookies(true);
      }
    }
  }, [cookies, pathname]);

  const setCookieStatus = (stat) => {
    setCookies(stat);
  };

  if (!appReady) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          zIndex: 999999,
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div className="App">
      {/* Application Header */}
      {isPublicRoute ? <Header /> : null}
      {/* Application Router */}
      <RouterClass />
      {/* Application Footer */}
      {isPublicRoute ? <Footer /> : null}
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        containerStyle={{
          top: '100px' /* Account for header height */,
          right: '0px',
        }}
        toastOptions={{
          style: {
            fontSize: '14px',
            padding: '12px 16px',
            borderRadius: '4px',
            zIndex: 1000000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        }}
      />

      {/* Chatbot */}
      {!isAdminRoute && <Chatbot pageContext={currentPage || 'general'} />}

      {/* Cookie Consent */}
      {!cookies && <Cookie cookieStatus={setCookieStatus} />}
    </div>
  );
}

export default App;
