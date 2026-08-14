import { IconoirProvider, NavArrowDown, PlusCircle, ProfileCircle } from 'iconoir-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../../../assets/lasg__logo.png';
import { useThemeStore } from '../../../../stores/theme.store';
import { HeadingTitle } from '../header/heading_title';
import { getAdminNavSections, getCommsNavLinks, NAV_SECTION_LABELS } from './navSections';
import './topbar.scss';

const useClickOutside = (onOutsideClick) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onOutsideClick]);

  return ref;
};

const NavLink = ({ item, activeId, onNavigate }) => (
  <button
    type="button"
    className={`nav-item ${item.id === activeId ? 'active' : ''}`}
    onClick={() => onNavigate(item.href)}
  >
    {item.name}
  </button>
);

const NavSection = ({ label, items, activeId, onNavigate }) => {
  const [open, setOpen] = useState(false);

  const containerRef = useClickOutside(() => setOpen(false));

  if (items.length === 1) {
    return <NavLink item={items[0]} activeId={activeId} onNavigate={onNavigate} />;
  }

  const isSectionActive = items.some((item) => item.id === activeId);

  return (
    <div className="nav-dropdown" ref={containerRef}>
      <button
        type="button"
        className={`nav-item ${isSectionActive ? 'active' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {label}
        <NavArrowDown className="nav-caret" />
      </button>

      {open && (
        <div className="nav-dropdown-menu">
          {items.map((item) => (
            <div
              key={item.id}
              className={`nav-dropdown-link ${item.id === activeId ? 'active' : ''}`}
              onClick={() => {
                onNavigate(item.href);
                setOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Topbar() {
  const { mda, id } = useParams();
  const navigate = useNavigate();
  const mdaData = useThemeStore((state) => state.mdaData);
  const [role, setRole] = useState('');
  const [userDetails, setUserDetails] = useState({ firstname: '', lastname: '' });
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useClickOutside(() => setProfileOpen(false));

  useEffect(() => {
    const user = window.localStorage.getItem('MDA__TOKEN');
    if (!user) return;
    const parsed = JSON.parse(user);
    setRole(parsed.role || '');
    setUserDetails({ firstname: parsed.firstname || '', lastname: parsed.lastname || '' });
  }, []);

  const baseurl = `/${mda}/admin`;
  const activeId = `${id}-admin`;
  const isAdmin = role === 'admin';

  const navSections = isAdmin ? getAdminNavSections(baseurl, mdaData?.type) : null;
  const commsLinks = !isAdmin ? getCommsNavLinks(baseurl) : null;

  const handleSignOut = () => {
    window.localStorage.removeItem('MDA__TOKEN');
    window.location.reload();
  };

  return (
    <IconoirProvider iconProps={{ strokeWidth: 2 }}>
      <div className="topbar">
        <div className="topbar-brand" onClick={() => navigate(`${baseurl}/dashboard`)}>
          <img
            src={mdaData?.logo || logo}
            alt={`Lagos State ${mdaData?.fullname} Logo`}
            className="topbar-logo"
          />
          <p className="topbar-mda-name">{mdaData?.fullname}</p>
        </div>

        <nav className="topbar-nav">
          {isAdmin
            ? Object.entries(navSections).map(([key, items]) => (
                <NavSection
                  key={key}
                  label={NAV_SECTION_LABELS[key] || key}
                  items={items}
                  activeId={activeId}
                  onNavigate={navigate}
                />
              ))
            : commsLinks.map((item) => (
                <NavLink key={item.id} item={item} activeId={activeId} onNavigate={navigate} />
              ))}
        </nav>

        <div className="topbar-profile" ref={profileRef}>
          <button
            type="button"
            className="profile-trigger"
            onClick={() => setProfileOpen((prev) => !prev)}
          >
            {userDetails.firstname.toUpperCase().substring(0, 1)}
            {userDetails.lastname.toUpperCase().substring(0, 1)}
            <NavArrowDown className="nav-caret" />
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <button
                type="button"
                className="flex items-center gap-2.5 text-[14px] text-black cursor-pointer bg-transparent border-none p-0 font-normal text-left"
                onClick={() => {
                  setProfileOpen(false);
                  navigate(`${baseurl}/settings`);
                }}
              >
                <ProfileCircle /> Profile Settings
              </button>
              <a href="">
                <PlusCircle /> Add Team Members
              </a>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </IconoirProvider>
  );
}
