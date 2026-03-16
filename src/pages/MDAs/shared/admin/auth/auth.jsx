import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authenticateToken, loginUser, refreshToken } from '../../../api/auth/auth';
import logo from '../../../custom/health/assets/lasg__logo.png';
import { useThemeStore } from '../../../stores/theme.store';
import Dashboard from '../dashboard/Dashboard';
import Onboarding from '../onboarding/Onboarding';
import './auth.css';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mdaData = useThemeStore((state) => state.mdaData);

  const navigate = useNavigate();
  const { mda } = useParams();

  // Token refresh interval (every 50 minutes)
  const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000;

  // Simple logout function
  const logout = useCallback(() => {
    localStorage.removeItem('MDA__TOKEN');
    setIsAuthenticated(false);
    setError('');
  }, []);

  // Verify and refresh token
  const verifyToken = useCallback(
    async (token) => {
      try {
        const res = await authenticateToken(token, mda);
        if (res.status === 'ok' && res.data.mda === mda) {
          localStorage.setItem(
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
          setIsAuthenticated(true);
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    },
    [mda]
  );

  // Refresh token periodically
  const refreshTokenPeriodically = useCallback(async () => {
    const stored = localStorage.getItem('MDA__TOKEN');
    if (!stored) return;

    try {
      const parser = JSON.parse(stored);
      const res = await refreshToken(parser.token, mda);

      if (res.status === 'ok') {
        localStorage.setItem(
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
        logout();
      }
    } catch (err) {
      logout();
    }
  }, [mda, logout]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const res = await loginUser(email, password);
      if (res.status === 'ok') {
        const isValid = await verifyToken(res.token);
        if (!isValid) {
          setError('Invalid credentials');
        }
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  // Check for existing token on mount
  useEffect(() => {
    const checkExistingToken = async () => {
      const stored = localStorage.getItem('MDA__TOKEN');

      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        const parser = JSON.parse(stored);
        if (parser.mda === mda) {
          const isValid = await verifyToken(parser.token);
          if (!isValid) {
            logout();
          }
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkExistingToken();
  }, [mda, verifyToken, logout]);

  // Set up token refresh interval
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(refreshTokenPeriodically, TOKEN_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [isAuthenticated, refreshTokenPeriodically]);

  // Hide admin header
  useEffect(() => {
    const header = document.querySelector('.currentPage_admin');
    if (header) header.style.display = 'none';
  }, []);

  if (loading) {
    return <div className="w-full h-[100vh] flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
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

            <form className="form" onSubmit={handleLogin}>
              <div className="auth__form">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth__form">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="errorZone">{error}</div>}

              <button type="submit" className="submitBtn">
                Log into dashboard
              </button>
            </form>
          </div>

          <p className="foot">Powered by Ministry of Innovation, Science &amp; Technology</p>
        </div>
      </div>
    );
  }

  if (mdaData && !mdaData?.isVerified) return <Onboarding />;

  return <Dashboard />;
}
