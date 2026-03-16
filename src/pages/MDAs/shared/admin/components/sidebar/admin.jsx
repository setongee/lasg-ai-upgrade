import {
  AppleShortcutsSolid,
  AppNotificationSolid,
  CompassSolid,
  CoolingSquareSolid,
  DownloadSquareSolid,
  FlashSolid,
  GoogleDocs,
  GraduationCapSolid,
  HeartSolid,
  MultiBubbleSolid,
  PocketSolid,
  TextSquareSolid,
  WhiteFlagSolid,
} from 'iconoir-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Admin({ baseurl, mdaType }) {
  let { id } = useParams();

  useEffect(() => {
    getActive();
  }, [id]);

  const getActive = async () => {
    // Remove all current-active classes from all menu items
    const allActiveElements = document.querySelectorAll('.current-active');
    allActiveElements.forEach((element) => {
      element.classList.remove('current-active');
    });

    // Add current-active class to the new active element
    const getElementToBeActive = document.querySelector(`.${id}-admin`);
    if (getElementToBeActive) {
      getElementToBeActive.classList.add('current-active');
    }
  };

  let navigate = useNavigate();

  const menuItemsList = {
    overview: [
      {
        name: 'Dashboard',
        href: `${baseurl}/dashboard`,
        icon: <AppleShortcutsSolid />,
        id: 'dashboard-admin',
      },
    ],

    templates: [
      {
        name: 'Published',
        href: `${baseurl}/published`,
        icon: <FlashSolid />,
        id: 'published-admin',
      },
      {
        name: 'Drafts',
        href: `${baseurl}/drafts`,
        icon: <WhiteFlagSolid />,
        id: 'drafts-admin',
      },
      {
        name: 'Library',
        href: `${baseurl}/library`,
        icon: <PocketSolid />,
        id: 'library-admin',
      },
    ],

    content: [
      {
        name: 'Vision & Mission',
        href: `${baseurl}/vision`,
        icon: <CompassSolid />,
        id: 'vision-admin',
      },
      {
        name: 'Agencies / Depts.',
        href: `${baseurl}/agencies`,
        icon: <CoolingSquareSolid />,
        id: 'agencies-admin',
      },
      {
        name: 'Principal Officers',
        href: `${baseurl}/people`,
        icon: <GraduationCapSolid />,
        id: 'people-admin',
      },
      {
        name: 'Responsibilities',
        href: `${baseurl}/responsibility`,
        icon: <TextSquareSolid />,
        id: 'responsibility-admin',
      },
      {
        name: 'Resources',
        href: `${baseurl}/resources`,
        icon: <DownloadSquareSolid />,
        id: 'resources-admin',
      },
      {
        name: 'Contact',
        href: `${baseurl}/contact`,
        icon: <MultiBubbleSolid />,
        id: 'contact-admin',
      },
    ],

    more: [
      {
        name: 'Services',
        href: `${baseurl}/services`,
        icon: <AppNotificationSolid />,
        id: 'services-admin',
      },
      {
        name: 'Form Builder',
        href: `${baseurl}/forms`,
        icon: <GoogleDocs />,
        id: 'forms-admin',
      },
      {
        name: 'Subscribers',
        href: `${baseurl}/subscribers`,
        icon: <HeartSolid />,
        id: 'subscribers-admin',
      },
    ],
  };

  const menuItemsListServices = {
    Services: [
      {
        name: 'Services',
        href: `${baseurl}/services`,
        icon: <AppNotificationSolid />,
        id: 'services-admin',
      },
      {
        name: 'Form Builder',
        href: `${baseurl}/forms`,
        icon: <GoogleDocs />,
        id: 'forms-admin',
      },
    ],
  };

  return (
    <div className="menu__links">
      {mdaType === 'full'
        ? Object.entries(menuItemsList).map(([key, value]) => (
            <section className="nav-section">
              <div className="section-title-admin">{key}</div>
              {Object.entries(value).map(([key, value]) => (
                <div onClick={() => navigate(value.href)} className={`link ${value.id}`}>
                  <div className="icon">{value.icon}</div>
                  <div className="text">{value.name}</div>
                </div>
              ))}
            </section>
          ))
        : Object.entries(menuItemsListServices).map(([key, value]) => (
            <section className="nav-section">
              <div className="section-title-admin">{key}</div>
              {Object.entries(value).map(([key, value]) => (
                <div onClick={() => navigate(value.href)} className={`link ${value.id}`}>
                  <div className="icon">{value.icon}</div>
                  <div className="text">{value.name}</div>
                </div>
              ))}
            </section>
          ))}
    </div>
  );
}
