import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Joyride from "react-joyride";
import logo from "../../assets/logo.png";
import axios from "axios";
import Header from "./Header";
import Footer from "../../Components/footer-all/footer";

const Dashboard = ({ showTour }) => {
  const [connectedDatabases, setConnectedDatabases] = useState([]);
  const [collaboratedDatabases, setCollaboratedDatabases] = useState([]);
  const [email, setEmail] = useState("");
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
    fetchUserData();
    fetchConnectedDatabases();
    fetchCollaboratedDatabases();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const profileData = await response.json();
      setEmail(profileData.email);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


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


  const fetchCollaboratedDatabases = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/database-collabs/", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      
      });
    
      const databaseIds = response.data;
      console.log(response.data)

      const databaseRequests = databaseIds.map(id => axios.get(`http://localhost:8000/api/view-database/${id}/`));
      const responses = await Promise.all(databaseRequests);
      const details = responses.map(response => response.data);
      setCollaboratedDatabases(details);
    } catch (error) {
      console.error("Error fetching collaborated databases: ", error);
    }
  };
  const renderCollaboratedDBs = () => {
    return collaboratedDatabases.map((db, index) => (
      <div key={index} className="database-item">
        <div className="btn1">
          <Link to={`/collab-databases/${db.id}`} className="btn1">
            {db.name}
          </Link>
        </div>
      </div>
    ));
  };
  
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

  

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if (status === "finished" || status === "skipped") {
      setRun(false);
    }
  };

  const renderDatabaseLinks = () => {
    return connectedDatabases.map((db) => (
      <div className="btn1">
      <Link key={db.id} to={`/databases/${db.id}`} className="btn1">
        {db.name}
      </Link>
      </div>
    ));
  };

  return (
    <>
      {email ? (
        <div>
          <Header /> {/* Render the Header component */}
          <div className="container1">
            <Link to="/ConnectDatabasePage" className="btn2 add-database-btn">
              Add Database
            </Link>
          </div>
          <div className="dashboard-container">
            {/* Databases Section */}
            <div className="databases-section">
              <div className="section bg-white shadow-md rounded-md p-6">
                <h2 className="text-xl font-bold mb-4">Own Databases</h2>
                <div className="databases">
                  {renderDatabaseLinks()}
                </div>
              </div>
              <div className="section bg-white shadow-md rounded-md p-6">
                <h2 className="text-xl font-bold mb-4">Collaborations</h2>
                <div className="databases">
                  {renderCollaboratedDBs()}
                </div>
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
      ) : (
        <div>
          <Link className="link2" to="/Home">
            Home
          </Link>
          <div className="proflogin">
            <img src={logo} alt="logo-login" className="logo-login2" />
            <p className="opentext">You are not logged in</p>
            <Link to="/Login">
              <button className="login-btn">Login</button>
            </Link>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Dashboard;

