import { useEffect } from 'react';
import { useParams } from 'react-router';
import Connect from '../../shared/connect/connect';
import Events from '../../shared/events/Events';
import Footer from '../../shared/footer/Footer';
import LiveForm from '../../shared/forms/LiveForm';
import Gallery from '../../shared/gallery/Gallery';
import News_Events from '../../shared/news_events/News_Events';
import Resources from '../../shared/resources/resources';
import { themeCssVars } from '../../shared/utils/colorTheme';
import { useThemeStore } from '../../stores/theme.store';
import About from './about/About';
import HeaderEdit from './header/edit-mode/headerEdit';
import Header from './header/header';
import Home from './home/home';

const FinanceTheme = ({ isEdit }) => {
  const { page } = useParams();
  const data = useThemeStore((state) => state.mdaData);
  const themeVars = themeCssVars(data?.colorTheme);

  useEffect(() => {
    const footer = document.querySelector('.footer');
    const header = document.querySelector('#header');
    if (footer) footer.style.display = 'none';
    if (header) header.style.display = 'none';

    return () => {
      if (footer) footer.style.display = '';
      if (header) header.style.display = '';
    };
  }, []);

  const renderPage = () => {
    switch (page) {
      case '':
        return <Home isEdit={isEdit || false} />;
      case 'about':
        return <About />;
      case 'news':
        return <News_Events topic="Health Services" />;
      case 'events':
        return <Events />;
      case 'gallery':
        return <Gallery />;
      case 'resources':
        return <Resources />;
      case 'contact':
        return <Connect />;
      case 'forms':
        return <LiveForm />;
      default:
        return <Home isEdit={isEdit || false} />;
    }
  };

  if (isEdit) {
    return (
      <div className="themeHolder" style={themeVars}>
        <HeaderEdit fullname={data?.fullname} />
        {renderPage()}
        <Footer data={data} />
      </div>
    );
  }

  return (
    <div className="themeHolder" style={themeVars}>
      <Header fullname={data?.fullname} isEdit={isEdit || false} />
      {renderPage()}
      <Footer data={data} />
    </div>
  );
};

export default FinanceTheme;
