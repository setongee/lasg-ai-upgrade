import { Bell, NavArrowDown, PlusCircle, ProfileCircle, Settings } from 'iconoir-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { updateAdminData } from '../../../../api/admin/content';
import { useThemeStore } from '../../../../stores/theme.store';
import ToggleSlider from '../../../toggleSlider/toggleSlider';
import './heading.css';
import { HeadingTitle } from './heading_title';

const Heading = () => {
  const [userDetails, setUserDetails] = useState({ firstname: '', lastname: '', role: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const mdaData = useThemeStore((state) => state.mdaData);

  // Initialize user details
  useEffect(() => {
    const user = window.localStorage.getItem('MDA__TOKEN');
    if (user) {
      const parser = JSON.parse(user);
      setUserDetails({
        firstname: parser.firstname || '',
        lastname: parser.lastname || '',
        role: parser.role || '',
      });
    }
  }, []);

  const setStatus = useCallback(
    async (newStatus) => {
      if (!mdaData?._id) return;

      try {
        setIsUpdating(true);
        await updateAdminData(mdaData._id, { isOffline: newStatus });
      } catch (error) {
        console.error('Failed to update status:', error);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [mdaData?._id]
  );

  const handleSignOut = () => {
    window.localStorage.removeItem('MDA__TOKEN');
    window.location.reload();
  };

  const { id } = useParams();

  return (
    <div className="headingAdmin">
      <div className="pageName font-semibold">{HeadingTitle[id]}</div>

      <div className="account">
        <div className="app_status flex gap-[10px] items-center">
          <p>Offline Mode</p>
          <ToggleSlider status={mdaData?.isOffline} changeStatus={setStatus} />
          <p>Online Mode</p>
        </div>
        <div className="header-navs flex gap-[14px]">
          <div className="nav-holder">
            {' '}
            <Bell />{' '}
          </div>
          <div className="nav-holder">
            {' '}
            <Settings />{' '}
          </div>

          <div className="nav-holder profile-part">
            {userDetails.firstname.toUpperCase().substring(0, 1)}{' '}
            {userDetails.lastname.toUpperCase().substring(0, 1)}
            <div className="arrowPulldown">
              <NavArrowDown />
            </div>
            <div className="profile-dropdown">
              <a href="">
                <p>
                  <ProfileCircle />
                </p>{' '}
                Profile Settings
              </a>
              <a href="">
                <p>
                  <PlusCircle />
                </p>{' '}
                Add Team Members
              </a>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heading;
