import { ArrowUpRight, FacebookTag, Instagram, Linkedin, X, Youtube } from 'iconoir-react';
import { useEffect, useState } from 'react';
import Container from '../container/container';
import './footer.scss';

export default function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const d = new Date();
    let hour = d.getHours();

    if (hour >= 0 && hour < 12) {
      setTime('Good Morning ☀️');
    } else if (hour >= 12 && hour < 18) {
      setTime('Good Afternoon 🌤️');
    } else {
      setTime('Good Evening 🌙');
    }
  }, []);

  return (
    <div className="footer footer__new bg-gray-900 main_footer">
      {/* <Subscribe/> */}

      <Container>
        <div className="footerContent">
          <div className="topPart">
            <h1>
              {' '}
              Lagos, <span>{time.toLowerCase()}</span>{' '}
            </h1>

            {/* socials */}

            <div className="socialsIcon flex">
              <a
                target="_blank"
                href="https://www.instagram.com/lagosstategovt/?hl=en"
                className="icon"
              >
                <Instagram width={22} strokeWidth={1.6} />
              </a>
              <a target="_blank" href="https://x.com/followlasg" className="icon">
                <X width={22} strokeWidth={1.6} />
              </a>
              <a target="_blank" href="https://web.facebook.com/followlasg" className="icon">
                <FacebookTag width={22} strokeWidth={1.6} />
              </a>
              <a
                target="_blank"
                href="https://www.linkedin.com/company/lagosstategovernment/?originalSubdomain=ng"
                className="icon"
              >
                <Linkedin width={22} strokeWidth={1.6} />
              </a>
              <a target="_blank" href="https://youtube.com/@lasgpage" className="icon">
                <Youtube width={22} strokeWidth={1.6} />
              </a>
            </div>
          </div>

          <div className="linksPart flex">
            <div className="linkHolder flex flex_col">
              <div className="linkHeader thick_500">Government</div>

              <div className="links a-dark flex flex_col">
                <a
                  target="_blank"
                  href="/government/elected_officials/governor/view"
                  className="link"
                >
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  About Governor{' '}
                </a>

                <a target="_blank" href="/government/elected_officials" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Executive Council{' '}
                </a>

                <a target="_blank" href="/government/mdas/all" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Explore MDAs{' '}
                </a>

                <a
                  target="_blank"
                  href="https://lagoshouseofassembly.gov.ng/home/our-team/"
                  className="link"
                >
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Legislative officers{' '}
                </a>

                <a
                  target="_blank"
                  href="https://lagosjudiciary.gov.ng/directories.html#directories"
                  className="link"
                >
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Judiciary officers{' '}
                </a>

                <a
                  target="_blank"
                  href="https://registration.lagosresidents.gov.ng/register/"
                  className="link"
                >
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Apply for Lag-ID{' '}
                </a>
              </div>
            </div>

            <div className="linkHolder flex flex_col">
              <div className="linkHeader thick_500">Quick Services</div>

              <div className="links a-dark flex flex_col">
                <a target="_blank" href="/services/jobopportunities" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Work in Lagos{' '}
                </a>

                <a target="_blank" href="/services/housingandlands" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Housing and lands{' '}
                </a>

                <a target="_blank" href="/services/tourism_culture" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Tourism and travels{' '}
                </a>

                <a target="_blank" href="/services/payments_levies" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Payments and levies{' '}
                </a>

                <a target="_blank" href="/services/advertisement" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Advertisement{' '}
                </a>

                <a target="_blank" href="/services/governmentbenefits" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Government Benefits{' '}
                </a>
              </div>
            </div>

            <div className="linkHolder flex flex_col">
              <div className="linkHeader thick_500">Safety & Emergencies</div>

              <div className="links a-dark flex flex_col">
                <a
                  target="_blank"
                  href="https://lagos.npf.gov.ng/home/find/division"
                  className="link"
                >
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Find police stations{' '}
                </a>

                <a target="_blank" href="https://lagos.npf.gov.ng/news/post/3" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Report missing person{' '}
                </a>

                <a target="_blank" href="https://citizensgate.lagosstate.gov.ng/" className="link">
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Make complaints{' '}
                </a>
              </div>
            </div>

            <div className="linkHolder flex flex_col">
              <div className="linkHeader thick_500">Help & support</div>

              <div className="links a-dark flex flex_col">
                <a target="_blank" href="/connect" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Contact us{' '}
                </a>

                <a target="_blank" href="https://mail.lagosstate.gov.ng/owa" className="link">
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Lagos Mail Login{' '}
                </a>

                <a target="_blank" href="https://lasrab.lagosstate.gov.ng/" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Archives{' '}
                </a>

                <a target="_blank" href="/privacy" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Privacy Policy{' '}
                </a>
              </div>
            </div>

            <div className="linkHolder flex flex_col">
              <div className="linkHeader thick_500">Feedback</div>

              <div className="links a-dark flex flex_col">
                <a target="_blank" href="https://citizensgate.lagosstate.gov.ng/" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Give feedback{' '}
                </a>
              </div>
            </div>
          </div>

          {/* lashma link */}
          <div className="flex  md:items-center justify-center gap-5 p-6 md:p-4 rounded-[0px] bg-gray-800 my-11 text-white flex-col md:flex-row">
            <p className="text-[19px] font-semibold text-white">
              Access affordable healthcare at your fingertips!
            </p>
            <button
              onClick={() => window.open('https://ileraeko.com/')}
              className="py-2.5 px-5 bg-[#90ee90] text-gray-900 rounded-[4px] font-semibold text-[15px] flex items-center gap-2 cursor-pointer w-max"
            >
              Start with LASHMA <ArrowUpRight className="text-[11px]" strokeWidth={2} />
            </button>
          </div>

          {/* lastpart */}
          <div className="footest_footer">
            <div className="copyright flex flex_justify_space_between">
              <div className="txt uppercase">
                © Copyright 2024, All Rights Reserved  |   Lagos State Government
              </div>

              <div className="txt uppercase col">
                <span>Powered by - </span> Lagos State Ministry of Innovation, Science and
                Technology
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
