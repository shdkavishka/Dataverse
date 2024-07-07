import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Joyride from "react-joyride";
import axios from "axios";
import Header from "./Header";

const Dashboard = () => {
  const [connectedDatabases, setConnectedDatabases] = useState([]);
  const [joyrideSteps] = useState([
    {
      target: ".add-database-btn",
      content: "Add your Database Here...",
    },
    {
      target: ".btn1:nth-of-type(2)",
      content: "View your Database here...",
    },
  ]);
  const [run, setRun] = useState(true);

  useEffect(() => {
    fetchConnectedDatabases();
  }, []);

  const fetchConnectedDatabases = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/connected-databases/", { withCredentials: true });
      console.log("Response from backend:", response.data);
      setConnectedDatabases(response.data || []);
    } catch (error) {
      console.error("Error fetching connected databases:", error);
      if (error.response && error.response.status === 400) {
        console.log("Invalid Token. Redirecting to login.");
        // Handle invalid token: clear local storage, redirect to login, etc.
      }
    }
  };
  

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if (status === "finished" || status === "skipped") {
      setRun(false);
    }
  };

  const renderDatabaseLinks = () => {
    return connectedDatabases.map((db) => (
      <Link key={db.id} to={`/databases/${db.id}`} className="btn1">
        {db.name}
      </Link>
    ));
  };

  return (
    <div>
      <Header />
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
