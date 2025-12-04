import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Loader from '../../../../../components/loader/loader';
import { notify } from '../../../../../utils/toast';
import { authenticateToken, loginUser } from '../../../api/auth/auth';
import logo from '../../../custom/health/assets/lasg__logo.png';
import Dashboard from '../dashboard/Dashboard';
import './auth.css';

export default function Auth() {
  const [error, setError] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [loginPage, setLoginPage] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  let { pathname } = useLocation();

  let { mda } = useParams();

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
