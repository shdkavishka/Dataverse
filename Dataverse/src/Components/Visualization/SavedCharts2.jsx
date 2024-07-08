import React, { useEffect, useState } from 'react';
import './styles2.css';
import { useParams } from 'react-router-dom';

const SavedCharts2 = () => {
  const [savedCharts, setSavedCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { database_id } = useParams();

  useEffect(() => {
    fetchSavedCharts();
  }, [database_id]);

  const fetchSavedCharts = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/charts/database/${database_id}/`);
      if (response.ok) {
        const data = await response.json();
        setSavedCharts(data.charts);
      } else {
        console.error('Error fetching saved charts:', response.status);
        setError('Error fetching saved charts');
      }
    } catch (error) {
      console.error('Error fetching saved charts:', error);
      setError('Error fetching saved charts');
    } finally {
      setLoading(false);
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
        const errorData = await response.json();
        console.error('Error deleting chart:', response.status, errorData.error);
        // Handle specific errors or show a user-friendly message
      }
    } catch (error) {
      console.error('Network error deleting chart:', error.message);
      // Handle network errors
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="saved-charts-body">
      <h1 className="saved-charts-h1">Saved Charts</h1>
      {savedCharts.length > 0 ? (
        <ul className="saved-charts-ul">
          {savedCharts.map((chart) => (
            <li key={chart.id} className="saved-charts-li">
              <h2 className="saved-charts-h2">{chart.chart_name}</h2>
              <p className="saved-charts-p">Created by: {chart.created_by}</p>
              <p className="saved-charts-p">Created at: {new Date(chart.created_at).toLocaleString()}</p>
              <img src={chart.chart_data} alt={chart.chart_name} className="saved-charts-img" />
              <button onClick={() => handleShareChart(chart.chart_data)} className="saved-charts-button">Share</button>
              <button onClick={() => handleDeleteChart(chart.id)} className="saved-charts-button">Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved charts available for this database.</p>
      )}
    </div>
  );
};

export default SavedCharts2;
