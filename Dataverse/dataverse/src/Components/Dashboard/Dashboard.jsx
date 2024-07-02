import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // Import the CSS file
import Joyride from "react-joyride";
import axios from "axios";
import Header from "./Header";

const Dashboard = () => {
  const [connectedDatabases, setConnectedDatabases] = useState([]);
  const [joyrideSteps, setJoyrideSteps] = useState([
    {
      target: ".add-database-btn",
      content: "Add your Database Here...",
    },
    {
      target: ".btn1:nth-of-type(2)",
      content: "View your Database here...",
    },

    // Add more steps as needed for other elements
  ]);
  const [run, setRun] = useState(true); // Set to true to automatically start the tour

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

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if (status === "finished" || status === "skipped") {
      setRun(false);
    }
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
      <Header />
      <div className="container1">
        <Link to="/ConnectDatabasePage" className="btn2 add-database-btn">
          {" "}
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
      <Joyride
        steps={joyrideSteps}
        run={run}
        continuous
        scrollToFirstStep
        showSkipButton
        callback={handleJoyrideCallback}
      />
    </div>
  );
};

export default Dashboard;
