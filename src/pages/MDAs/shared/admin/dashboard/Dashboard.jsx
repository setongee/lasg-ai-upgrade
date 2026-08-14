import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../components/topbar/Topbar';
import './dashboard.css';

// pages Section
import { useThemeStore } from '../../../stores/theme.store';
import FormsZone from '../../forms/Forms';
import Agency from '../pages/agencies/Agencies';
import Contact from '../pages/contact/Contact';
import EventsAdmin from '../pages/events/EventsAdmin';
import GalleryAdmin from '../pages/gallery/GalleryAdmin';
import NewsAdmin from '../pages/news/NewsAdmin';
import Overview from '../pages/overview/Overview';
import PrincipalOfficers from '../pages/principal-officers/PrincipalOfficers';
import Resources from '../pages/Resources/Resources';
import ResourcesCategoryStyle from '../pages/Resources/ResourcesCategoryStyle';
import Responsibilities from '../pages/responsibilities/Responsibilities';
import Services from '../pages/services/Services';
import SettingsAdmin from '../pages/settings/Settings';
import Subscribers from '../pages/subscribers/subscribers';
import Vision from '../pages/vision/Vision';
import Appearance from '../pages/web-templates/appearance/Appearance';
import Drafts from '../pages/web-templates/drafts/Drafts';
import Library from '../pages/web-templates/library/Library';
import Published from '../pages/web-templates/published/Published';

const Dashboard = () => {
  const mdaData = useThemeStore((state) => state.mdaData);
  const isVerified = useThemeStore((state) => state.mdaData)?.isVerified;
  let { id, mda } = useParams();
  const navigate = useNavigate();
  const mdaType = useThemeStore((state) => state.mdaData)?.type;

  useEffect(() => {
    if (!id && mda) {
      return navigate(`/${mda}/admin/dashboard`);
    }
  }, [id, mda, mdaData]);

  if (!isVerified) {
    return navigate(`/${mda}/admin/onboarding`);
  }

  const getPage = () => {
    // Define allowed routes for different MDA types
    const serviceTypeRoutes = ['services', 'forms', 'settings'];
    const fullTypeRoutes = [
      'dashboard',
      'vision',
      'agencies',
      'people',
      'responsibility',
      'newsroom',
      'events',
      'gallery',
      'resources',
      'contact',
      'published',
      'drafts',
      'themes',
      'library',
      'services',
      'subscribers',
      'forms',
      'settings',
    ];

    // Get allowed routes based on MDA type
    const allowedRoutes = mdaType === 'full' ? fullTypeRoutes : serviceTypeRoutes;

    // Render the appropriate page based on id
    if (id == 'dashboard') return <Overview />;
    if (id == 'vision') return <Vision mda_data={mdaData} />;
    if (id == 'agencies') return <Agency mda_data={mdaData} />;
    if (id == 'people') return <PrincipalOfficers mda_data={mdaData} />;
    if (id == 'responsibility') return <Responsibilities mda_data={mdaData} />;
    if (id == 'newsroom') return <NewsAdmin />;
    if (id == 'events') return <EventsAdmin />;
    if (id == 'gallery') return <GalleryAdmin />;
    if (id == 'resources') {
      // Render different Resources component based on theme
      if (mdaData?.theme === 'mepb') {
        return <ResourcesCategoryStyle mda_data={mdaData} />;
      } else {
        return <Resources mda_data={mdaData} />;
      }
    }
    if (id == 'contact') return <Contact mda_data={mdaData} />;

    // Web Templates
    if (id == 'published') return <Published />;
    if (id == 'drafts') return <Drafts />;
    if (id == 'themes') return <Appearance />;
    if (id == 'library') return <Library />;

    // Utilities
    if (id == 'services') return <Services />;
    if (id == 'subscribers') return <Subscribers />;
    if (id == 'forms') return <FormsZone />;

    // Settings
    if (id == 'settings') return <SettingsAdmin />;

    // Check if current route is allowed
    if (!allowedRoutes.includes(id)) {
      // Redirect based on MDA type
      if (mdaType === 'full') {
        return (window.location.href = `/${mda}/admin/dashboard`);
      } else {
        return (window.location.href = `/${mda}/admin/services`);
      }
    }
  };

  return (
    <div className="dashboard-body bg-gray-100/70">
      <Topbar />

      <div className="dashboardPages py-6 pt-25 px-[70px] w-full">{getPage()}</div>
    </div>
  );
};

export default Dashboard;
