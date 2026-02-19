import React, { useEffect } from 'react';
import ScrollSpy from 'react-ui-scrollspy';
import Divider from '../../../shared/divider/Divider';
import Wrapper from '../../../shared/Wrapper/Wrapper';
import { useThemeStore } from '../../../stores/theme.store';
import './about.css';
import Agencies from './Agency/Agency';
import People from './People/People';

const About = () => {
  const data = useThemeStore((state) => state.mdaData);

  useEffect(() => {
    addContent(data?.responsibilities);
  }, [data]);

  const addContent = (response) => {
    const content = document.getElementById('responsibility-content');
    content.innerHTML = response;
  };

  return (
    <div className="about-mda">
      <div className="navigateMenu">
        <Wrapper>
          <div className="spy__links">
            <a href="#history" data-to-scrollspy-id="history">
              {' '}
              History{' '}
            </a>
            <a href="#mission" data-to-scrollspy-id="mission">
              {' '}
              Mission & Vision{' '}
            </a>
            <a href="#responsibility" data-to-scrollspy-id="responsibility">
              {' '}
              Responsibilities{' '}
            </a>
            <a href="#agency" data-to-scrollspy-id="agency">
              {' '}
              Agencies, Departments and Units{' '}
            </a>
            <a href="#people" data-to-scrollspy-id="people">
              {' '}
              Principal officers{' '}
            </a>
          </div>
        </Wrapper>
      </div>

      <ScrollSpy>
        <section className="about-sections index-top " id="history">
          <div className="history">
            <Wrapper customClass="flex items-center justify-center">
              <div className="contentArea">
                <h2>
                  That every Lagosian enjoys unfettered access to qualitative healthcare without
                  significant geographical, financial, cultural or political barriers
                </h2>
              </div>
            </Wrapper>
          </div>
        </section>

        {/* mission */}
        <section className="about-sections" id="mission">
          <Wrapper>
            <div className="mission">
              <div className="card-set">
                <div className="card-item">
                  <div className="card-content">
                    <div className="h2">Vision</div>
                    <p>{data?.vision}</p>
                  </div>
                </div>
                <div className="card-item">
                  <div className="card-content">
                    <div className="h2">Mission</div>
                    <p>{data?.mission}</p>
                  </div>
                </div>
                <div className="card-item">
                  <div className="card-content">
                    <div className="h2">Our Goal</div>
                    <p>{data?.goal}</p>
                  </div>
                </div>
              </div>
            </div>
          </Wrapper>
        </section>

        {/* responsibilities */}
        <section className="about-sections" id="responsibility">
          <Wrapper>
            <div className="about-heading flex">
              <h1>
                Roles and Responsibilities: Understanding Core Functions, Duties, and Key Roles
              </h1>
              <span>
                A clear guide to the core functions, duties, and key roles that drive effective
                operations and accountability.
              </span>
            </div>

            <Divider customClass="my-20 divider-about" />

            <div id="responsibility-content"></div>
          </Wrapper>
        </section>

        <section className="about-sections" id="agency">
          <div className="agency">
            <Agencies res={data} />
          </div>
        </section>
        <section className="about-sections" id="people">
          <div className="people">
            <People res={data} />
          </div>
        </section>
      </ScrollSpy>
    </div>
  );
};

export default About;
