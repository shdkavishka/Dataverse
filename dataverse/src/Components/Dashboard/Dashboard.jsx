import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // Import the CSS file
import Joyride from "react-joyride";
import axios from "axios";
import Header from "../Dashboard/Header";

const Dashboard = ({ showTour }) => {
  const [connectedDatabases, setConnectedDatabases] = useState([]);

  const steps = [
    {
      target: ".add-database-btn",
      content: "Click here to add your Database",
      disableBeacon: true,
    },
    {
      target: ".dropdown",
      content: "Click here to see more option",
    },
    {
      target: ".profile",
      content: "Click here to edit your profile details",
    },
    
  ];

  useEffect(() => {
    fetchConnectedDatabases();
  }, []);

  const fetchConnectedDatabases = () => {
    axios
      .get("http://localhost:8000/api/connected-databases/")
      .then((response) => {
        console.log("Response from backend:", response.data);
        setConnectedDatabases(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching connected databases:", error);
      });
  };

  const renderDatabaseLinks = () => {
    return connectedDatabases.map((db, index) => (
      <Link key={index} to={`/databases/${db.id}`} className="btn1">
        {db.name}
      </Link>
    ));
  };

  return (
    <div>
      <Header /> {/* Render the Header1 component */}
      <div className="container1">
        <Link to="/ConnectDatabasePage" className="btn2 add-database-btn">
          Add Database
        </Link>
      </div>
      <div className="dashboard-container">
        {/* Databases Section */}
        <div className="databases-section">
          <div className="section bg-white shadow-md rounded-md p-6">
            <h2 className="text-xl font-bold mb-4">Databases</h2>
            {renderDatabaseLinks()}
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
};

export default Dashboard;
