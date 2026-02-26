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
import Responsibilities from '../pages/responsibilities/Responsibilities';
import Services from '../pages/services/Services';
import Vision from '../pages/vision/Vision';
import Drafts from '../pages/web-templates/drafts/Drafts';
import Library from '../pages/web-templates/library/Library';
import Published from '../pages/web-templates/published/Published';

const Dashboard = () => {
  const mdaData = useThemeStore((state) => state.mdaData);
  let { id, mda } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mdaData?.isVerified) {
      return navigate(`/${mda}/admin/onboarding`);
    }

    if (!id && mda) {
      navigate(`/${mda}/admin/dashboard`);
    }
  }, [id, mda, navigate]);

  const getPage = () => {
    if (id == 'dashboard') return <Overview />;
    if (id == 'vision') return <Vision mda_data={mdaData} />;
    if (id == 'agencies') return <Agency mda_data={mdaData} />;
    if (id == 'people') return <PrincipalOfficers mda_data={mdaData} />;
    if (id == 'responsibility') return <Responsibilities mda_data={mdaData} />;
    if (id == 'resources') return <Resources mda_data={mdaData} />;
    if (id == 'contact') return <Contact mda_data={mdaData} />;

    // Web Templates
    if (id == 'library') return <Library />;
    if (id == 'published') return <Published />;
    if (id == 'drafts') return <Drafts />;

    // More
    if (id == 'services') return <Services />;
  };

  if (id === 'onboarding') {
    return <Onboarding />;
  }

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
