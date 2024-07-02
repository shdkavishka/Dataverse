import React, { useEffect, useState } from 'react';

const SavedCharts = () => {
  const [savedCharts, setSavedCharts] = useState([]);

  useEffect(() => {
    fetchSavedCharts();
  }, []);

  const fetchSavedCharts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/get_saved-charts');
      if (response.ok) {
        const data = await response.json();
        setSavedCharts(data);
      } else {
        console.error('Error fetching saved charts:', response.status);
      }
    } catch (error) {
      console.error('Error fetching saved charts:', error);
    }
  };

  const handleDeleteChart = async (chartId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/delete-chart/${chartId}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSavedCharts(savedCharts.filter(chart => chart.id !== chartId));
      } else {
        console.error('Error deleting chart:', response.status);
      }
    } catch (error) {
      console.error('Error deleting chart:', error);
    }
  };

  const handleShareChart = (chartImageUrl) => {
    navigator.clipboard.writeText(chartImageUrl)
      .then(() => {
        alert('Chart image URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Error copying URL:', err);
      });
  };


  return (
    <div>
      <h1>Saved Charts</h1>
      {savedCharts.length > 0 ? (
        <ul>
          {savedCharts.map((chart) => (
            <li key={chart.id}>
              <h2>{chart.chart_name}</h2>
              <p>Created by: {chart.created_by}</p>
              <p>Created at: {new Date(chart.created_at).toLocaleString()}</p>
              <img src={chart.chart_data} alt={chart.chart_name} />
              <button onClick={() => handleShareChart(chart.chart_data)}>Share</button>
              <button onClick={() => handleDeleteChart(chart.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved charts available.</p>
      )}
    </div>
  );
};

export default SavedCharts;
