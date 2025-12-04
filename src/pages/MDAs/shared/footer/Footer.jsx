import {
  ArrowUpRight,
  FacebookTag,
  Instagram,
  Mail,
  MapPin,
  Phone,
  X,
  Youtube,
} from 'iconoir-react';
import React, { useEffect, useState } from 'react';
import Wrapper from '../Wrapper/Wrapper';
import './Footer.css';

export default function Footer({ data }) {
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
    <div className="footer__mda">
      <Wrapper>
        <div className="footerContent">
          <div className="topPart">
            <h1>
              {' '}
              Lagos, <span>{time.toLowerCase()}</span>{' '}
            </h1>

            {/* socials */}

            <div className="socialsIcon flex">
              <a target="_blank" href={data?.contact?.socials?.instagram} className="icon">
                <Instagram width={22} strokeWidth={1.6} />
              </a>
              <a target="_blank" href={data?.contact?.socials?.twitter} className="icon">
                <X width={22} strokeWidth={1.6} />
              </a>
              <a target="_blank" href={data?.contact?.socials?.facebook} className="icon">
                <FacebookTag width={22} strokeWidth={1.6} />
              </a>
              <a target="_blank" href={data?.contact?.socials?.youtube} className="icon">
                <Youtube width={22} strokeWidth={1.6} />
              </a>
            </div>
          </div>

          <div className="linksPart flex">
            <div className="linkHolder flex flex-col fritz">
              <div className="linkHeader thick_500">Contact Us</div>

              <div className="flex flex-col gap-[30px] badger">
                <a
                  href={data?.contact?.address}
                  target="_Blank"
                  className="flex text-[14px] gap-[15px] dark"
                >
                  <div className="icon">
                    {' '}
                    <MapPin />{' '}
                  </div>
                  {data?.contact?.address ||
                    'Block 4, The Lagos State Government Secretariat Complex, Alausa, Ikeja, Lagos. P.M.B. 21007, Ikeja'}
                </a>

                <a
                  href={`mailto:${data?.contact?.email}`}
                  target="_Blank"
                  className="flex text-[14px] gap-[15px] dark"
                >
                  <div className="icon">
                    {' '}
                    <Mail />{' '}
                  </div>
                  {data?.contact?.email || 'health@lagosstate.gov.ng'}
                </a>

                <a
                  href={`tel:${data?.contact?.phone}`}
                  target="_Blank"
                  className="flex text-[14px] gap-[15px] dark"
                >
                  <div className="icon">
                    {' '}
                    <Phone />{' '}
                  </div>
                  {data?.contact?.phone || '234-1-4969061'}
                </a>
              </div>
            </div>

            <div className="linkHolder flex flex-col">
              <div className="linkHeader thick_500">Other Links</div>

              <div className="links a-dark flex sublime">
                <a target="_blank" href="/about" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  About Us{' '}
                </a>

                <a target="_blank" href="/resources" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Resources{' '}
                </a>

                <a target="_blank" href="/news" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Newsroom{' '}
                </a>

                <a target="_blank" href="/contact" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Contact{' '}
                </a>

                <a target="_blank" href="/" className="link">
                  {' '}
                  <span>
                    <ArrowUpRight />
                  </span>{' '}
                  Back to LASG{' '}
                </a>
              </div>
            </div>
          </div>

          <div className="footest_footer uppercase">
            <div className="copyright flex justify-between">
              <div className="txt">
                © Copyright 2024, All Rights Reserved  |   Lagos State Government
              </div>

              <div className="txt text__trend col">
                <span>Powered by - </span> Lagos State Ministry of Innovation, Science and
                Technology
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
