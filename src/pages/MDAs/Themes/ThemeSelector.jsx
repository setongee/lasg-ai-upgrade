import Index from '../custom/health';
import MEPB from '../custom/mepb/Mepb';
import MistTheme from '../custom/mist/mist-theme';
import Finance from '../custom/mof/Finance';
import Transportation from '../custom/mot/Transportation';
import STO from '../custom/sto/STO';

const ThemeSelector = ({ slug, theme, isEdit, data }) => {
  if (!data) return <h1>404 : Page not found!</h1>;

  switch (theme) {
    case 'health':
      return <Index isEdit={isEdit || false} />;

    case 'mepb':
      return <MEPB isEdit={isEdit || false} />;

    case 'mist':
      return <MistTheme isEdit={isEdit || false} />;

    case 'transport':
      return <Transportation isEdit={isEdit || false} />;

    case 'finance':
      return <Finance isEdit={isEdit || false} />;

    case 'sto':
      return <STO isEdit={isEdit || false} />;
  }
};

// Export theme selector
export default ThemeSelector;
