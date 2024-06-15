// Dashboard.jsx
import React,{ useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; 
// Import the CSS file
//import addDatabaseIcon from '../../assets/AddDb.png'
//import db from '../../assets/DBGroup.png'
import Joyride from 'react-joyride';


const Dashboard = ({ showTour }) => {
  const steps = [ 
    {
      target: '.btn1',
      content: 'Add your Database Here...',
      disableBeacon: true,
    },
    {
      target: '.btn1:nth-of-type(2)',
      content: 'View your Database here...',
    },
    {
      target: '.btn2',
      content:'Add your Collaborator here...' ,
    },
    {
      target: '.btn2:nth-of-type(2)',
      content: 'View your Collaborator here...',
    },
    
    
    // Add more steps as needed for other elements
  ];

  

  return (
    <div>
      <div className="section">
        <div className="container">
          {/* Databases Section */}
          <div className="section bg-white shadow-md rounded-md p-6">
            <h2 className="text-xl font-bold mb-4">Databases</h2>
            <Link to="./ConnectDatabasePage" className="btn1"> Add Database</Link>
            <Link to="/connect-database" className="btn1">Database 1</Link>
            {/* Add more database buttons */}
          </div>
        </div>
        {/* Collaborators Section */}
        <div className="container mt-8">
          <div className="section bg-white shadow-md rounded-md p-6">
            <h2 className="text-xl font-bold mb-4">Collaborators</h2>
            <Link to="/Colloborators" className="btn2">Test 1</Link>
            <Link to="/Colloborators" className="btn2">Test 1</Link>
            {/* Add more collaborator buttons */}
          </div>
        </div>
        </div>
      {showTour && (
        <Joyride
          steps={steps}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
        />
      )}
    </div>
  );
}

export default Dashboard;
