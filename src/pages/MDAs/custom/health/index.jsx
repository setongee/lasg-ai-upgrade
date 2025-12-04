import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import Connect from '../../shared/connect/connect';
import Footer from '../../shared/footer/Footer';
import News_Events from '../../shared/news_events/News_Events';
import Resources from '../../shared/resources/resources';
import { useThemeStore } from '../../stores/theme.store';
import About from './about/About';
import Header from './header/header';
import Home from './home/home';

const Index = () => {
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
        return <Home />;
      case 'about':
        return <About />;
      case 'news':
        return <News_Events topic="Health Services" />;
      case 'resources':
        return <Resources />;
      case 'contact':
        return <Connect />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="themeHolder">
      <Header fullname={data?.fullname} />
      {renderPage()}
      <Footer data={data} />
    </div>
  );
};

export default Index;
