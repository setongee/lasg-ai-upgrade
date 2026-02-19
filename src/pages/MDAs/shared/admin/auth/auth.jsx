import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../../../components/loader/loader';
import { notify } from '../../../../../utils/toast';
import { authenticateToken, loginUser, refreshToken } from '../../../api/auth/auth';
import logo from '../../../custom/health/assets/lasg__logo.png';
import Dashboard from '../dashboard/Dashboard';
import './auth.css';

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // Refresh token every 50 minutes

export default function Auth() {
  const [error, setError] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [loginPage, setLoginPage] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  let { pathname } = useLocation();
  const navigate = useNavigate();
  let { mda } = useParams();

  const inactivityTimerRef = useRef(null);
  const refreshTimerRef = useRef(null);

  // Reset inactivity timer on user activity
  const resetInactivityTimer = useCallback(() => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Set new timer
    inactivityTimerRef.current = setTimeout(() => {
      // Log out user after inactivity
      window.localStorage.removeItem('MDA__TOKEN');
      setIsValidated(false);
      setLoginPage(true);
      notify.info('Session expired due to inactivity');
    }, INACTIVITY_TIMEOUT);
  }, []);

  // Refresh token periodically while user is active
  const setupTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    refreshTimerRef.current = setInterval(() => {
      const user = window.localStorage.getItem('MDA__TOKEN');
      if (user) {
        const parser = JSON.parse(user);

        // Call your backend to refresh the token
        refreshToken(parser.token, mda)
          .then((res) => {
            if (res.status === 'ok') {
              window.localStorage.setItem(
                'MDA__TOKEN',
                JSON.stringify({
                  token: res.token,
                  id: parser.id,
                  mda: parser.mda,
                  role: parser.role,
                  firstname: parser.firstname,
                  lastname: parser.lastname,
                })
              );
            } else {
              // Token refresh failed, log out
              window.localStorage.removeItem('MDA__TOKEN');
              setIsValidated(false);
              setLoginPage(true);
              notify.error('Session expired. Please login again.');
            }
          })
          .catch(() => {
            window.localStorage.removeItem('MDA__TOKEN');
            setIsValidated(false);
            setLoginPage(true);
          });
      }
    }, TOKEN_REFRESH_INTERVAL);
  }, [mda]);

  // Track user activity
  useEffect(() => {
    if (isValidated) {
      // Activity events to track
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

      // Reset timer on any activity
      events.forEach((event) => {
        document.addEventListener(event, resetInactivityTimer);
      });

      // Initialize timers
      resetInactivityTimer();
      setupTokenRefresh();

      // Cleanup
      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, resetInactivityTimer);
        });
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
      };
    }
  }, [isValidated, resetInactivityTimer, setupTokenRefresh]);

  useEffect(() => {
    const header = document.querySelector('.currentPage_admin');

    if (pathname.split('/')[1] === 'admin') {
      if (header !== null) {
        header.style.display = 'none';
      }
    }
  }, []);

  const handleVerification = (token) => {
    authenticateToken(token, mda).then((res) => {
      if (res.status === 'ok' && res.data.mda === mda) {
        window.localStorage.setItem(
          'MDA__TOKEN',
          JSON.stringify({
            token,
            id: res.data.id,
            mda: res.data.mda,
            role: res.data.role,
            firstname: res.data.firstName,
            lastname: res.data.lastName,
          })
        );
        setIsValidated(true);
        setLoginPage(false);
        setEmail('');
        setPassword('');
      } else {
        setIsValidated(false);
        setLoginPage(true);

        if (res.data.mda !== mda) {
          notify.error('You are not authorized to access this page');
          setEmail('');
          setPassword('');
        }
      }
    });
  };

  useEffect(() => {
    const user = window.localStorage.getItem('MDA__TOKEN');

    if (!user) {
      setIsValidated(false);
      setLoginPage(true);
    } else {
      const parser = JSON.parse(user);

      // check if user is valid for the mda
      if (parser.mda !== mda) {
        setIsValidated(false);
        setLoginPage(true);
        return;
      }
      handleVerification(parser.token);
    }
  }, []);

  const handleLogin = (email, password) => {
    if (email === '' || password === '') {
      notify.error('All fields are required!');
    } else {
      loginUser(email, password, mda).then((res) => {
        if (res.status === 'ok') {
          handleVerification(res.token);
        } else {
          notify.error(res.message);
        }
      });
    }
  };

  if (loginPage)
    return (
      <div className="appHome">
        <div className="authPage">
          <div className="image__scoop">
            <img src={logo} alt="" />
          </div>

          <div className="loginPart">
            <div className="topicTitle">
              {' '}
              Hello There! {<br></br>} <span>Welcome to LASG MIST admin platform</span>{' '}
            </div>

            <div className="form">
              <div className="auth__form">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email id"
                  id="access"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="auth__form">
                <label>Password</label>
                <input
                  type="text"
                  placeholder="Enter password"
                  id="access_main"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="submitBtn" onClick={() => handleLogin(email, password)}>
                {' '}
                Log into dashboard{' '}
              </div>
            </div>

            <div className="errorZone" id="error">
              {' '}
              {error}{' '}
            </div>
          </div>

          <p className="foot">Powered by Ministry of Innovation, Science & Technology</p>
        </div>
      </div>
    );

  if (!isValidated)
    return <Loader customClass="w-full h-[100vh] flex items-center justify-center" />;

  return <Dashboard />;
}
