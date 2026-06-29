import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authenticateToken, loginUser, refreshToken, requestOtp, verifyOtp } from '../../../api/auth/auth';
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

  // Forgot password flow: 'login' | 'forgot-email' | 'forgot-otp' | 'forgot-success'
  const [view, setView] = useState('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError] = useState('');
  const [fpSuccess, setFpSuccess] = useState('');

  const mdaData = useThemeStore((state) => state.mdaData);

  const navigate = useNavigate();
  const { mda } = useParams();

  const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000;

  const logout = useCallback(() => {
    localStorage.removeItem('MDA__TOKEN');
    setIsAuthenticated(false);
    setError('');
  }, []);

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

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setFpError('');
    setFpSuccess('');

    if (!forgotEmail) {
      setFpError('Please enter your email address');
      return;
    }

    setFpLoading(true);
    try {
      const res = await requestOtp(forgotEmail);
      if (res.status === 'ok') {
        setFpSuccess(res.message);
        setView('forgot-otp');
      } else {
        setFpError(res.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setFpError('Something went wrong. Please try again.');
    } finally {
      setFpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setFpError('');

    if (!otpValue || otpValue.length !== 4) {
      setFpError('Please enter the 4-digit code');
      return;
    }

    setFpLoading(true);
    try {
      const res = await verifyOtp(forgotEmail, otpValue);
      if (res.status === 'ok') {
        setView('forgot-success');
      } else {
        setFpError(res.message || 'Invalid code. Please try again.');
      }
    } catch (err) {
      setFpError('Something went wrong. Please try again.');
    } finally {
      setFpLoading(false);
    }
  };

  const resetForgotFlow = () => {
    setView('login');
    setForgotEmail('');
    setOtpValue('');
    setFpError('');
    setFpSuccess('');
  };

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

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(refreshTokenPeriodically, TOKEN_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [isAuthenticated, refreshTokenPeriodically]);

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

            {/* ── LOGIN VIEW ── */}
            {view === 'login' && (
              <>
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

                  {error && <div className="errorZone bad">{error}</div>}

                  <button type="submit" className="submitBtn">
                    Log into dashboard
                  </button>

                  <button
                    type="button"
                    className="forgotBtn"
                    onClick={() => { setView('forgot-email'); setFpError(''); setFpSuccess(''); }}
                  >
                    Forgot password?
                  </button>
                </form>
              </>
            )}

            {/* ── FORGOT PASSWORD: EMAIL STEP ── */}
            {view === 'forgot-email' && (
              <>
                <div className="topicTitle">
                  Reset Password <br />
                  <span>Enter your email to receive a verification code</span>
                </div>

                <form className="form" onSubmit={handleRequestOtp}>
                  <div className="auth__form">
                    <label htmlFor="forgotEmail">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      id="forgotEmail"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>

                  {fpError && <div className="errorZone bad">{fpError}</div>}

                  <button type="submit" className="submitBtn" disabled={fpLoading}>
                    {fpLoading ? 'Sending code...' : 'Send verification code'}
                  </button>

                  <button type="button" className="forgotBtn" onClick={resetForgotFlow}>
                    Back to login
                  </button>
                </form>
              </>
            )}

            {/* ── FORGOT PASSWORD: OTP STEP ── */}
            {view === 'forgot-otp' && (
              <>
                <div className="topicTitle">
                  Enter Code <br />
                  <span>A 4-digit code was sent to {forgotEmail}</span>
                </div>

                <form className="form" onSubmit={handleVerifyOtp}>
                  <div className="auth__form">
                    <label htmlFor="otp">Verification Code</label>
                    <input
                      type="text"
                      placeholder="Enter 4-digit code"
                      id="otp"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      inputMode="numeric"
                      style={{ letterSpacing: '8px', fontSize: '24px', textAlign: 'center' }}
                    />
                  </div>

                  {fpError && <div className="errorZone bad">{fpError}</div>}

                  <button type="submit" className="submitBtn" disabled={fpLoading}>
                    {fpLoading ? 'Verifying...' : 'Verify code'}
                  </button>

                  <button
                    type="button"
                    className="forgotBtn"
                    onClick={() => { setView('forgot-email'); setOtpValue(''); setFpError(''); }}
                  >
                    Resend code
                  </button>
                </form>
              </>
            )}

            {/* ── FORGOT PASSWORD: SUCCESS ── */}
            {view === 'forgot-success' && (
              <div className="form" style={{ marginTop: '30px', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>✓</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#00484d', marginBottom: '12px' }}>
                  Request Received
                </div>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '24px' }}>
                  We have informed the super admin to reset your password. You will receive new credentials in your email shortly.
                </p>
                <button className="submitBtn" onClick={resetForgotFlow}>
                  Back to login
                </button>
              </div>
            )}

          </div>

          <p className="foot">Powered by Ministry of Innovation, Science &amp; Technology</p>
        </div>
      </div>
    );
  }

  if (mdaData && !mdaData?.isVerified) return <Onboarding />;

  return <Dashboard />;
}
