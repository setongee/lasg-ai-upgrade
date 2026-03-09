import { useParams } from 'react-router';
import NotFound from '../../notFound/notFound';
import Index from '../custom/health';
import MepbTheme from '../custom/mepb/mepb-theme';
import MistTheme from '../custom/mist/mist-theme';
import FinanceTheme from '../custom/mof/finance-theme';
import Transportation from '../custom/mot/Transportation';
import Offline from '../shared/offline/Offline';

const ThemeSelector = ({ slug, theme, isEdit, data }) => {
  const { page } = useParams();
  if (!data) return <NotFound />;
  if (data?.isOffline && page !== 'admin') return <Offline />;

  console.log(data);

  switch (theme) {
    case 'health':
      return <Index isEdit={isEdit || false} />;

    case 'mepb':
      return <MepbTheme isEdit={isEdit || false} />;

    case 'mist':
      return <MistTheme isEdit={isEdit || false} />;

    case 'transport':
      return <Transportation isEdit={isEdit || false} />;

    case 'mof':
      return <FinanceTheme isEdit={isEdit || false} />;
  }
};

// Export theme selector
export default ThemeSelector;
