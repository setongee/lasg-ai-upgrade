import { useParams } from 'react-router-dom';
import ServicesComponentStyle1 from './style1/ServicesComponent';
import ServicesComponentStyle2 from './style2/ServicesComponent';

const SERVICES_STYLES = ['style1', 'style2'];
const HOME_LIMIT = 8;

// `showAll` renders every service with no cap (used by the dedicated
// per-MDA services page); otherwise the homepage view caps at HOME_LIMIT
// and hands off to that page via `viewAllLink` once there are more.
const ServicesSection = ({ style, data, name, showAll = false }) => {
  const { mda } = useParams();
  const resolvedStyle = SERVICES_STYLES.includes(style) ? style : 'style1';
  const totalCount = data?.length || 0;
  const visibleData = showAll ? data : data?.slice(0, HOME_LIMIT);
  const viewAllLink = !showAll && totalCount > HOME_LIMIT ? `/${mda}/services` : null;

  if (resolvedStyle === 'style2') {
    return (
      <ServicesComponentStyle2
        data={visibleData}
        name={name}
        viewAllLink={viewAllLink}
        totalCount={totalCount}
      />
    );
  }

  return (
    <ServicesComponentStyle1
      data={visibleData}
      name={name}
      viewAllLink={viewAllLink}
      totalCount={totalCount}
      disableCap={showAll}
    />
  );
};

export default ServicesSection;
