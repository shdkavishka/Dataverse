import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import Header from "../Dashboard/Header";

function UIGuide() {
  // State to control whether the tour should be shown
  const [showTour, setShowTour] = useState(false);

  // useEffect to check local storage on component mount
  useEffect(() => {
    // Check local storage for the 'hasSeenTour' key
    const hasSeenTour = localStorage.getItem("hasSeenTour");

    // If the key does not exist, show the tour
    if (!hasSeenTour) {
      setShowTour(true);
      // Set the 'hasSeenTour' key in local storage
      localStorage.setItem("hasSeenTour", "true");
    }
  }, []);

  const resetTour = () => {
    localStorage.removeItem("hasSeenTour");
    setShowTour(false); // Ensure it is reset
    setTimeout(() => setShowTour(true), 0); // Then start it again
  };

  return (
    <>
      
      <Dashboard showTour={showTour} />
      <button onClick={resetTour} style={{ margin: "20px" }}>
        Reset Tour
      </button>
    </>
  );
}

export default UIGuide;
