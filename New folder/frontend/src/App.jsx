import React, { useState, useEffect } from 'react';
import Header from "./Components/Header/Header"
import Dashboard from './Components/Dashboard/Dashboard';


const App = () => {
  // State to control whether the tour should be shown
  const [showTour, setShowTour] = useState(false);

  // useEffect to check local storage on component mount
  useEffect(() => {
    // Check local storage for the 'hasSeenTour' key
    const hasSeenTour = localStorage.getItem('hasSeenTour');

    // If the key does not exist, show the tour
    if (!hasSeenTour) {
      setShowTour(false);
      // Set the 'hasSeenTour' key in local storage
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, []);

  const resetTour = () => {
    localStorage.removeItem('hasSeenTour');
    setShowTour(true);
  };

  return (
    <>
    <Header />
    <button onClick={resetTour} style={{ margin: '20px' }}>Reset Tour</button>
    <Dashboard showTour={showTour} />
    
    </>
  );
}

export default App;

