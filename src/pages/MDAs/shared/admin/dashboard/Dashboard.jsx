import React from 'react';

import './dashboard.css';
// import Vision from './pages/vision'
import { useParams } from 'react-router-dom';
import Heading from '../components/header/Heading';
import Sidebar from '../components/sidebar/sidebar';
import Overview from '../pages/overview/Overview';
// import Agency from './pages/agencies'
// import Responsibilities from './pages/responsibilities'
// import People from './pages/people'
// import Contact from './pages/contact'
// import Resources from './pages/resources'

const Dashboard = () => {
  let { id } = useParams();

  const getPage = () => {
    if (id == 'dashboard') return <Overview />;
    //   if(page == "vision") return <Vision inData = {data} />

    //   if(page == "agencies") return <Agency inData = {data}/>

    //   if(page == "responsibility") return <Responsibilities inData = {data}/>

    //   if(page == "resources") return <Resources inData = {data}/>

    //   if(page == "people") return <People inData = {data}/>

    //   if(page == "contact_info") return <Contact inData = {data}/>
  };

  return (
    <div className="dashboard-body">
      <Sidebar />

      <div className="dashboardHeader">
        <Heading />
      </div>

      <div className="dashboardPages">{getPage()}</div>
    </div>
  );
};

export default Dashboard;
