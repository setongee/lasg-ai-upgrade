import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ElectedOfficials from '../pages/Government/electedOfficials';
import JudiciaryOfficials from '../pages/Government/judiciaryOfficials';
import LegistlativeOfficials from '../pages/Government/legistlativeOfficials';
import Mdas from '../pages/Government/mdas';
import COSView from '../pages/Government/officialsView_cos';
import DGovernorsView from '../pages/Government/officialsView_dgov';
import GovernorsView from '../pages/Government/officialsView_gov';
import HOSView from '../pages/Government/officialsView_hos';
import LagView from '../pages/Government/officialsView_lag';
import SSGView from '../pages/Government/officialsView_ssg';
import Executive__view from '../pages/Government/view/executive__view';
import Page from '../pages/MDAs/Page';
import Connect from '../pages/connect/connect';
import Events from '../pages/events/events';
import Homepage from '../pages/home/homepage';
import News_Events from '../pages/news_events/News_Events';
import News_view from '../pages/news_events/news_view';
import NotFound from '../pages/notFound/notFound';
import Privacy from '../pages/privacy/Privacy';
import Resources from '../pages/resources/resources';
import Search from '../pages/search/search';
import ServicesPage from '../pages/services/servicesPage';
import ViewService from '../pages/services/viewService';

const RouterClass = () => {
  return (
    <Routes>
      <Route path="/">
        {/* homepage */}
        <Route index element={<Homepage />} />
        <Route path=":mda/:page?/:id?" element={<Page />} />

        {/* health */}
        {/* <Route path = '/health' element = { <Health/> } /> */}

        {/* government */}
        <Route path="government">
          <Route path="elected_officials" element={<ElectedOfficials />} />

          <Route path="elected_officials/governor/view" element={<GovernorsView />} />
          <Route path="elected_officials/deputy_governor/view" element={<DGovernorsView />} />
          <Route path="elected_officials/ssg/view" element={<SSGView />} />
          <Route path="elected_officials/hos/view" element={<HOSView />} />
          <Route path="elected_officials/cos/view" element={<COSView />} />
          <Route path="elected_officials/dcos/view" element={<LagView />} />

          <Route path="judiciary_officials" element={<JudiciaryOfficials />} />
          <Route path="legistlative_officials" element={<LegistlativeOfficials />} />

          {/* Other Executives */}
          <Route path="elected_officials/view/:name" element={<Executive__view />} />

          <Route path="mdas/:index" element={<Mdas />} />
        </Route>

        {/* services */}
        <Route path="services">
          <Route path="" element={<ServicesPage />} />
          <Route path=":theme" element={<ViewService />} />
        </Route>

        {/* News */}
        <Route path="news/:topic/:page" element={<News_Events />} />
        <Route path="news/:topic/view/:id" element={<News_view />} />

        {/* resources */}
        <Route path="resources" element={<Resources />} />

        {/* search */}
        <Route path="search" element={<Search />} />

        {/* connect */}
        <Route path="connect" element={<Connect />} />

        {/* events */}
        <Route path="events/:topic/:page" element={<Events />} />

        {/* Privacy Page */}
        <Route path="/privacy" element={<Privacy />} />

        {/* 404 Page Not Found */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default RouterClass;
