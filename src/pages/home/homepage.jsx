import { useState } from 'react';
import HeroSection from '../../components/photo_slider/v2/HeroSection';
import NewQuick from '../../components/quickIn/newQuick';
import Services from '../../components/services/services';
import Stat from '../../components/stat/stat';
import { useApp } from '../../stores/app.store';
import NewsCarrier from './newsZone/NewsCarrier';
import QuickCheck from './quickCheck/QuickCheck';

const Homepage = () => {
  const [isActive, setisActive] = useState(false);
  const darkmode = useApp((state) => state.darkmode);

  return (
    <div className="home" style={{ background: darkmode ? '#000' : '#fff' }}>
      <HeroSection />
      <Stat darkmode={darkmode} />
      <NewQuick />
      <QuickCheck darkmode={darkmode} />
      <Services bgColor="#f0f7f6" location="home" data_limit={100} />
      <NewsCarrier />
    </div>
  );
};

export default Homepage;
