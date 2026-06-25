import { useEffect } from 'react';
import { useParams } from 'react-router';
import Connect from '../../shared/connect/connect';
import Footer from '../../shared/footer/Footer';
import LiveForm from '../../shared/forms/LiveForm';
import News_Events from '../../shared/news_events/News_Events';
import Resources from '../../shared/resources/resources';
import { useThemeStore } from '../../stores/theme.store';
import About from './about/About';
import HeaderEdit from './header/edit-mode/headerEdit';
import Header from './header/header';
import Home from './home/home';

const FinanceTheme = ({ isEdit }) => {
  const { page } = useParams();
  const data = useThemeStore((state) => state.mdaData);

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
      <div className="themeHolder bg-black">
        <HeaderEdit fullname={data?.fullname} />
        {renderPage()}
        <Footer data={data} />
      </div>
    );
  }

  return (
    <div className="themeHolder bg-black">
      <Header fullname={data?.fullname} isEdit={isEdit || false} />
      {renderPage()}
      <Footer data={data} />
    </div>
  );
};

export default FinanceTheme;
