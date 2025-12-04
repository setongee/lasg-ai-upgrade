import {
  AppleShortcutsSolid,
  AppNotificationSolid,
  CompassSolid,
  CoolingSquareSolid,
  DownloadSquareSolid,
  FlashSolid,
  GraduationCapSolid,
  HeartSolid,
  MessageTextSolid,
  MultiBubbleSolid,
  PocketSolid,
  TextSquareSolid,
  WhiteFlagSolid,
} from 'iconoir-react';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Admin({ baseurl }) {
  let { id } = useParams();

  useEffect(() => {
    getActive();
  }, [id]);

  const getActive = async () => {
    const getElementToBeActive = document.querySelector(`.${id}-admin`);
    getElementToBeActive.classList.add('current-active');
  };

  return (
    <div className="menu__links">
      <section className="nav-section">
        <div className="section-title-admin">Overview</div>
        <a href={`${baseurl}/dashboard`} className="link dashboard-admin">
          <div className="icon">
            <AppleShortcutsSolid />
          </div>
          <div className="text">Dashboard</div>
        </a>
      </section>

      <section className="nav-section">
        <div className="section-title-admin">Templates</div>
        <a href={`${baseurl}/published`} className="link published-admin">
          <div className="icon">
            <FlashSolid />
          </div>
          <div className="text">Published</div>
        </a>

        <a href={`${baseurl}/drafts`} className="link drafts-admin">
          <div className="icon">
            <WhiteFlagSolid />
          </div>
          <div className="text">Drafts</div>
        </a>

        <a href={`${baseurl}/library`} className="link library-admin">
          <div className="icon">
            <PocketSolid />
          </div>
          <div className="text">Library</div>
        </a>
      </section>

      <section className="nav-section">
        <div className="section-title-admin">Content</div>

        <a href={`${baseurl}/vision`} className="link vision-admin">
          <div className="icon">
            <CompassSolid />
          </div>
          <div className="text">Vision & Mission</div>
        </a>

        <a href={`${baseurl}/agencies`} className="link agencies-admin">
          <div className="icon">
            <CoolingSquareSolid />
          </div>
          <div className="text"> Agencies / Depts. </div>
        </a>

        <a href={`${baseurl}/people`} className="link people-admin">
          <div className="icon">
            <GraduationCapSolid />
          </div>
          <div className="text"> Principal Officers </div>
        </a>

        <a href={`${baseurl}/responsibility`} className="link responsibility-admin">
          <div className="icon">
            <TextSquareSolid />
          </div>
          <div className="text"> Responsibilities </div>
        </a>

        <a href={`${baseurl}/resources`} className="link resources-admin">
          <div className="icon">
            <DownloadSquareSolid />
          </div>
          <div className="text"> Resources </div>
        </a>

        <a href={`${baseurl}/contact_info`} className="link contact_info-admin">
          <div className="icon">
            <MultiBubbleSolid />
          </div>
          <div className="text"> Contact </div>
        </a>
      </section>

      <section className="nav-section">
        <div className="section-title-admin">More</div>
        <a href={`${baseurl}/published`} className="link published-admin">
          <div className="icon">
            <AppNotificationSolid />
          </div>
          <div className="text">Services</div>
        </a>

        <a href={`${baseurl}/drafts`} className="link drafts-admin">
          <div className="icon">
            <MessageTextSolid />
          </div>
          <div className="text">Messages</div>
        </a>

        <a href={`${baseurl}/library`} className="link library-admin">
          <div className="icon">
            <HeartSolid />
          </div>
          <div className="text">Subscribers</div>
        </a>
      </section>
    </div>
  );
}
