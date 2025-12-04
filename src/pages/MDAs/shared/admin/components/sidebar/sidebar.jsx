import React, { useEffect, useState } from 'react';
import logo from '../../../assets/lasg__logo.png';
import './sidebar.scss';

import { IconoirProvider } from 'iconoir-react';

import { useParams } from 'react-router-dom';
import { useThemeStore } from '../../../../stores/theme.store';
import Admin from './admin';
import Comms from './comms';

export default function Sidebar() {
  const { mda } = useParams();
  const [role, setRole] = useState('');
  const data = useThemeStore((state) => state.mdaData);

  useEffect(() => {
    const user = window.localStorage.getItem('MDA__TOKEN');
    const parser = JSON.parse(user);
    setRole(parser.role);
  }, []);

  const baseurl = `/${mda}/admin`;

  return (
    <div className="sidebar ">
      <IconoirProvider
        iconProps={{
          strokeWidth: 2,
        }}
      >
        <div className="mainMenu">
          <div className="menu__heading">
            <div className="menu__controller flex justify-between items-center">
              <div className="logo-mda">
                <img src={logo} alt="Lagos State MIST Logo" />
              </div>{' '}
              <p>{data?.fullname} Admin Portal</p>
            </div>
          </div>

          {/* Menu Links */}

          {role === 'admin' ? <Admin baseurl={baseurl} /> : <Comms baseurl={baseurl} />}
        </div>
      </IconoirProvider>
    </div>
  );
}
