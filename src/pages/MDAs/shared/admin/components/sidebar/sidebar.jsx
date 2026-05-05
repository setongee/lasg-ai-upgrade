import { useEffect, useState } from 'react';
import logo from '../../../assets/lasg__logo.png';
import './sidebar.scss';

import { IconoirProvider } from 'iconoir-react';

import { useParams } from 'react-router-dom';
import { useThemeStore } from '../../../../stores/theme.store';
import Admin from './admin';
import Comms from './comms';

export default function Sidebar() {
  const { mda, page } = useParams();
  const [role, setRole] = useState('');
  const data = useThemeStore((state) => state.mdaData);

  const mda_logo = data?.logo;

  useEffect(() => {
    const user = window.localStorage.getItem('MDA__TOKEN');
    const parser = JSON.parse(user);
    setRole(parser.role);
  }, []);

  const baseurl = `/${mda}/admin`;

  const mdaType = useThemeStore((state) => state.mdaData)?.type;

  return (
    <div className="sidebar">
      <IconoirProvider
        iconProps={{
          strokeWidth: 2,
        }}
      >
        <div className="mainMenu">
          <div className="menu__heading">
            <div className="menu__controller flex justify-between items-center flex-wrap gap-4!">
              <div className="logo-mda w-15! h-15!">
                <img src={mda_logo || logo} alt={`Lagos State ${data?.fullname} Logo`} />
              </div>{' '}
              <p>{data?.fullname} Admin Portal</p>
            </div>
          </div>

          {/* Menu Links */}

          {role === 'admin' ? (
            <Admin baseurl={baseurl} mdaType={mdaType} />
          ) : (
            <Comms baseurl={baseurl} mdaType={mdaType} />
          )}
        </div>
      </IconoirProvider>
    </div>
  );
}
