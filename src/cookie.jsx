import Cookies from 'js-cookie';
import { useLocation } from 'react-router';
import './cookie.scss';

export default function Cookie({ cookieStatus }) {
  var { pathname } = useLocation();

  const setCookie = () => {
    Cookies.set('lasgConsent', JSON.stringify({ name: 'LASG CONSENT', status: 'accept' }), {
      expires: 30,
    });
    cookieStatus(true);
  };

  const DenyCookie = () => {
    Cookies.set('lasgConsent', JSON.stringify({ name: 'LASG CONSENT', status: 'denied' }), {
      expires: 1,
    });
    cookieStatus(true);
  };

  return (
    <div className="cookieBanner">
      <div className="overt"></div>

      <div className="banner flex">
        <div className="para">
          <span>We value your privacy!</span>

          {<br></br>}

          <div className="poi">
            We use cookies to enhance your browsing experience, content, and analyze our traffic. By
            clicking "Accept All", you consent to our use of cookies.{' '}
            <a href="/privacy"> View our data privacy policy </a>
          </div>
        </div>

        <div className="consent flex">
          <div className="consent__buttons accept" onClick={() => setCookie()}>
            {' '}
            Accept All{' '}
          </div>
          <div className="consent__buttons deny" onClick={() => DenyCookie()}>
            {' '}
            Reject All{' '}
          </div>
        </div>
      </div>
    </div>
  );
}
