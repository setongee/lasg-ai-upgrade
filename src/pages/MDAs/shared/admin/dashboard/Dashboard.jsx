import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Heading from '../components/header/Heading';
import Sidebar from '../components/sidebar/sidebar';
import './dashboard.css';

// pages Section
import { useThemeStore } from '../../../stores/theme.store';
import Onboarding from '../onboarding/Onboarding';
import Agency from '../pages/agencies/Agencies';
import Contact from '../pages/contact/Contact';
import Overview from '../pages/overview/Overview';
import PrincipalOfficers from '../pages/principal-officers/PrincipalOfficers';
import Resources from '../pages/Resources/Resources';
import ResourcesCategoryStyle from '../pages/Resources/ResourcesCategoryStyle';
import Responsibilities from '../pages/responsibilities/Responsibilities';
import Services from '../pages/services/Services';
import Subscribers from '../pages/subscribers/subscribers';
import Vision from '../pages/vision/Vision';
import Drafts from '../pages/web-templates/drafts/Drafts';
import Library from '../pages/web-templates/library/Library';
import Published from '../pages/web-templates/published/Published';

const Dashboard = () => {
  const mdaData = useThemeStore((state) => state.mdaData);
  let { id, mda } = useParams();
  const navigate = useNavigate();
  const mdaType = useThemeStore((state) => state.mdaData)?.type;

  useEffect(() => {
    if (!id && mda) {
      navigate(`/${mda}/admin/dashboard`);
    }
  }, [id, mda, mdaData]);

  const getPage = () => {
    if (mdaData && !mdaData?.isVerified) {
      return navigate(`/${mda}/admin/onboarding`);
    }

    // Restrict routing for non-full MDA types - only allow services
    if (mdaType !== 'full' && id !== 'services') {
      return (window.location.href = `/${mda}/admin/services`);
    }

    if (id == 'dashboard') return <Overview />;
    if (id == 'vision') return <Vision mda_data={mdaData} />;
    if (id == 'agencies') return <Agency mda_data={mdaData} />;
    if (id == 'people') return <PrincipalOfficers mda_data={mdaData} />;
    if (id == 'responsibility') return <Responsibilities mda_data={mdaData} />;
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
    if (id == 'library') return <Library />;

    // More
    if (id == 'services') return <Services />;
    if (id == 'subscribers') return <Subscribers />;

    if (id === 'onboarding') {
      return <Onboarding />;
    }
  };

  return (
    <div className="dashboard-body">
      <Sidebar />

      <div className="dashboardHeader">
        <Heading />
      </div>

      <div className="dashboardPages">{getPage()}</div>
    </div>
  );
};

export default Dashboard;
