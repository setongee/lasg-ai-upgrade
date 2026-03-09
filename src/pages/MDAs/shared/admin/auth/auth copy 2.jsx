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
const POLL_INTERVAL = 60 * 1000; // Check every 1 minute

export default function Auth() {
  const [error, setError] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [loginPage, setLoginPage] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { mda } = useParams();

  const inactivityTimerRef = useRef(null);
  const refreshTimerRef = useRef(null);

  // Track the last time a token was issued or refreshed
  // so we don't accidentally refresh immediately after a fresh login/remount
  const lastRefreshRef = useRef(Date.now());

  // ─── Logout helper ────────────────────────────────────────────────────────
  const logOut = useCallback((message, type = 'info') => {
    window.localStorage.removeItem('MDA__TOKEN');
    setIsValidated(false);
    setLoginPage(true);
    if (message) {
      type === 'error' ? notify.error(message) : notify.info(message);
    }
  }, []);

  // ─── Inactivity timer ─────────────────────────────────────────────────────
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      logOut('Session expired due to inactivity');
    }, INACTIVITY_TIMEOUT);
  }, [logOut]);

  // ─── Token refresh (time-based, not interval-restart-based) ───────────────
  const setupTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    // Poll every minute but only actually refresh once 50 mins have elapsed
    // since the last refresh/login. This prevents an immediate refresh call
    // when the component remounts (e.g. toggling online/offline mode).
    refreshTimerRef.current = setInterval(() => {
      const now = Date.now();
      if (now - lastRefreshRef.current < TOKEN_REFRESH_INTERVAL) return;

      const stored = window.localStorage.getItem('MDA__TOKEN');
      if (!stored) return;

      const parser = JSON.parse(stored);

      refreshToken(parser.token, mda)
        .then((res) => {
          if (res.status === 'ok') {
            // Update the timestamp so we don't refresh again for another 50 min
            lastRefreshRef.current = Date.now();
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
            logOut('Session expired. Please login again.', 'error');
          }
        })
        .catch(() => {
          logOut('Session expired. Please login again.', 'error');
        });
    }, POLL_INTERVAL);
  }, [mda, logOut]);

  // ─── Activity tracking + timer setup ──────────────────────────────────────
  useEffect(() => {
    if (!isValidated) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => document.addEventListener(event, resetInactivityTimer));

    resetInactivityTimer();
    setupTokenRefresh();

    return () => {
      events.forEach((event) => document.removeEventListener(event, resetInactivityTimer));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [isValidated, resetInactivityTimer, setupTokenRefresh]);

  // ─── Hide admin header when on admin route ────────────────────────────────
  useEffect(() => {
    if (pathname.split('/')[1] === 'admin') {
      const header = document.querySelector('.currentPage_admin');
      if (header) header.style.display = 'none';
    }
  }, [pathname]);

  // ─── Token verification ───────────────────────────────────────────────────
  const handleVerification = useCallback(
    (token) => {
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
          // Mark the time we last received a valid token so the refresh
          // interval doesn't fire immediately on next mount
          lastRefreshRef.current = Date.now();
          setIsValidated(true);
          setLoginPage(false);
          setEmail('');
          setPassword('');
        } else {
          setIsValidated(false);
          setLoginPage(true);
          if (res.data?.mda !== mda) {
            notify.error('You are not authorized to access this page');
            setEmail('');
            setPassword('');
          }
        }
      });
    },
    [mda]
  );

  // ─── On mount: check for existing session ─────────────────────────────────
  useEffect(() => {
    const stored = window.localStorage.getItem('MDA__TOKEN');

    if (!stored) {
      setIsValidated(false);
      setLoginPage(true);
      return;
    }

    const parser = JSON.parse(stored);

    if (parser.mda !== mda) {
      setIsValidated(false);
      setLoginPage(true);
      return;
    }

    handleVerification(parser.token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // ^ Intentionally empty — we only want this to run once on mount

  // ─── Login handler ────────────────────────────────────────────────────────
  const handleLogin = (email, password) => {
    if (!email || !password) {
      notify.error('All fields are required!');
      return;
    }

    loginUser(email, password, mda).then((res) => {
      if (res.status === 'ok') {
        handleVerification(res.token);
      } else {
        notify.error(res.message);
      }
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loginPage) {
    return (
      <div className="appHome">
        <div className="authPage">
          <div className="image__scoop">
            <img src={logo} alt="LASG Logo" />
          </div>

          <div className="loginPart">
            <div className="topicTitle">
              Hello There! <br />
              <span>Welcome to LASG MIST admin platform</span>
            </div>

            <div className="form">
              <div className="auth__form">
                <label htmlFor="access">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  id="access"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="auth__form">
                <label htmlFor="access_main">Password</label>
                {/* Fixed: was type="text", now type="password" */}
                <input
                  type="password"
                  placeholder="Enter password"
                  id="access_main"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin(email, password)}
                />
              </div>

              <div className="submitBtn" onClick={() => handleLogin(email, password)}>
                Log into dashboard
              </div>
            </div>

            <div className="errorZone" id="error">
              {error}
            </div>
          </div>

          <p className="foot">Powered by Ministry of Innovation, Science &amp; Technology</p>
        </div>
      </div>
    );
  }

  if (!isValidated) {
    return <Loader customClass="w-full h-[100vh] flex items-center justify-center" />;
  }

  return <Dashboard />;
}
