import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router';
import './App.css';
import Chatbot from './components/chatbot/Chatbot';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Cookie from './cookie';
import RouterClass from './routes/router';
import './styles/root.css';
const TRACKING_ID = 'G-NB0QB4RDM7'; // LASG Main Site Tracking ID

function App() {
  const [cookies, setCookies] = useState(false);
  const { pathname } = useLocation();
  const location = useLocation();
  const currentPage = location.pathname.replace('/', ''); // e.g. "health"

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

  return (
    <div className="App">
      {/* Application Header */}
      <Header />
      {/* Application Router */}
      <RouterClass />
      {/* Application Footer */}
      <Footer />
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '14px',
            padding: '10px 16px',
            borderRadius: '4px',
          },
        }}
      />

      {/* Chatbot */}
      <Chatbot pageContext={currentPage || 'general'} />
      {!cookies && <Cookie cookieStatus={setCookieStatus} />}
    </div>
  );
}

export default App;
