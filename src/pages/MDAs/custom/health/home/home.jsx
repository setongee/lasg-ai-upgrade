import { ArrowDown } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { getSingleCategory } from '../../../../../api/read/category.req';
import { getAllServicesCategory } from '../../../../../api/read/services.req';
import Button from '../../../shared/button/Button';
import Divider from '../../../shared/divider/Divider';
import Newsletter from '../../../shared/emailLetter/Newsletter';
import QuickServices from '../../../shared/quick_services/QuickServices';
import ServicesComponent from '../../../shared/services/style1/ServicesComponent';
import Wrapper from '../../../shared/Wrapper/Wrapper';
import YoutubeSocials from '../../../shared/youtubePlayer/YoutubeSocials';
import { useThemeStore } from '../../../stores/theme.store';
import landingImages from '../assets/rim.svg';
import './home.css';

const Home = () => {
  const landingContent = {
    title: `Ensuring Premium-Quality Healthcare for Every Lagosian`,
    subtitle:
      'Committed to your well-being with comprehensive services and innovative initiatives, supporting a healthier state.',
    landingImage: landingImages,
    commissionerImage: 'https://health.lagosstate.gov.ng/assets/hc-B2TcIYsJ.jpeg',
    servicesData: [
      {
        title: 'Ilera Eko',
        description: 'Ilera Eko',
        image: 'https://health.lagosstate.gov.ng/assets/ilera__eko-DQ6c3ULr.png',
        link: 'https://ileraeko.com/',
      },
      {
        title: 'Emergency Medical Services',
        description: '24/7 Emergency Medical Services',
        image:
          'https://health.lagosstate.gov.ng/assets/emergency_medical_services_lasambus_lasasem-BxzYgbjA.png',
        link: 'tel:123',
      },
      {
        title: 'Ilera Eko',
        description: 'Ilera Eko',
        image: 'https://health.lagosstate.gov.ng/assets/ilera__eko-DQ6c3ULr.png',
        link: 'https://ileraeko.com/',
      },
    ],
  };

  const { title, subtitle, landingImage } = landingContent;
  const isMobile = useThemeStore((state) => state.isMobile);
  const [services, setServices] = useState([]);
  const [icon, setIcon] = useState('');

  useEffect(() => {
    getAllServicesCategory('healthservices').then((res) => {
      if (res.status === 'ok') setServices(res.data);
    });

    getSingleCategory('healthservices').then((res) => {
      if (res.status === 'ok') setIcon(res.data[0]?.icon);
    });
  }, []);

  return (
    <div className="landingPage-version mx-auto my-0 mt-[115px]">
      {/* Home */}
      <Wrapper customClass="">
        <div className="home-version relative flex justify-between">
          <div className="text-content flex flex-col">
            <div className="main-text">{title}</div>
            <p>{subtitle}</p>
            <Button customClass="bg-[#108a00] uppercase tracking-[2px] text-white rounded-[5px] flex gap-2 text-[11px]">
              Explore Health Services <ArrowDown />
            </Button>
          </div>
          <div className="landing-photo w-[550px] h-[600px] my-10">
            <img src={landingImage} alt="landing page" className="w-full h-full object-cover" />
          </div>
        </div>
      </Wrapper>

      {/* Quick Services */}
      {landingContent.servicesData?.length > 0 && (
        <section className="bg-[#e6edef] py-10">
          <QuickServices data={landingContent.servicesData} />
        </section>
      )}

      {/* Health Services */}
      <section className="bg-[#e6edef] md:py-10 py-5 pb-10">
        <ServicesComponent data={services} icon={icon} />
      </section>

      {/* Commissioner Zone */}
      <section className="bg-[#fff] flex commisioners-zone md:py-[120px] py-[50px]">
        <Wrapper>
          <div className="flex wrapped lg:gap-[100px] gap-[30px] items-center justify-center flex-wrap lg:flex-nowrap">
            <div className="commissioner-container md:w-[600px] md:h-[580px] w-[500px] sm:h-[480px] h-[380px] relative">
              <div className="backdrop-photo w-[100%] h-[100%] sm:h-[80%] bg-[#eee]"></div>
              <div className="commissioner-image h-[calc(100%_-_20px)] w-[calc(100%_-_20px)] sm:w-[calc(100%_-_100px)] sm:h-[500px] md:w-[calc(100%_-_150px)] overflow-hidden absolute bottom-[10px] sm:bottom-0 left-[50%] transform-[translateX(-50%)]">
                <img
                  src={landingContent.commissionerImage}
                  alt="commissioners photo"
                  className="object-top w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="content flex flex-col w-full sm:w-[550px]">
              <div className="flex flex-col lg:gap-8 gap-5">
                <div className="text-[24px] sm:text-[32px] md:text-[40px] font-semibold comms-title leading-[130%]">
                  Welcome to Lagos State Ministry of Health
                </div>
                <p className="leading-[180%]">
                  It is my pleasure to welcome you to the Ministry of Health. Our mandate is simple
                  — to safeguard lives, promote healthy living, and ensure every resident has access
                  to quality healthcare. Guided by Governor Babajide Sanwo-Olu’s vision, we continue
                  to strengthen our health systems, expand universal health coverage, and improve
                  emergency preparedness. Together with our partners and communities, we are
                  building a healthier, stronger Lagos.
                </p>
              </div>

              <div className="font-semibold mt-5 block commissioner-name">
                <h1>Prof. Akin Abayomi</h1> <span className="!font-normal block"></span>Hon.
                Commissioner for Health, Lagos State
              </div>
            </div>
          </div>
        </Wrapper>
      </section>

      {/* Youtube Component */}
      <Wrapper>
        <Divider customClass="sm:mb-[80px] mb-[40px]" />
        <YoutubeSocials />
      </Wrapper>

      {/* Newsletter */}
      <Wrapper>
        <Newsletter />
      </Wrapper>
    </div>
  );
};

export default Home;
