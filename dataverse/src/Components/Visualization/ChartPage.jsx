import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './styles2.css';

const ChartPage = () => {
  const [query, setQuery] = useState('');
  const [queryData, setQueryData] = useState([]);
  const [data, setData] = useState([]);
  const [editChartOpen, setEditChartOpen] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [saveChartOpen, setSaveChartOpen] = useState(false);
  const [savedChartName, setSavedChartName] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [validationError, setValidationError] = useState('');
  const chartRef = useRef(null);
  const navigate = useNavigate();

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const validateData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return 'No data available';
    }

    for (const row of data) {
      const keys = Object.keys(row);
      if (keys.length < 2) {
        return 'Data must have at least two columns';
      }
    }

    return null;
  };

const handleGenerateChart = () => {
    const validationError = validateData(queryData);
    if (validationError) {
      setValidationError(validationError);
      return;
    }

    setValidationError('');
    const chartData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ],
    };

    const colors = [];

    queryData.forEach((row) => {
      const keys = Object.keys(row);
      const label = row[keys[0]]; // Assuming the first key is the x-axis label
      const value = row[keys[1]]; // Assuming the second key is the y-axis value
    
      chartData.labels.push(label);
      chartData.datasets[0].data.push(value);

        const color = generateRandomColor();
        chartData.datasets[0].backgroundColor.push(color);
        colors.push({ label, color });
      }
    );

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          anchor: 'end',
          align: 'end',
          formatter: (value, context) => value,
          color: 'black',
          font: {
            weight: 'bold',
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || '';
              const yValue = context.raw;
              return `${label}: ${yValue}`;
            },
          },
        }, 
      },
    };

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('chart');
    const newChart = new Chart(ctx, {
      type: chartType,
      data: chartData,
      options,
      plugins: [ChartDataLabels],
    });
    chartRef.current = newChart;
  };

  const handleQueryInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleQuerySubmit = async (event) => {
    event.preventDefault();

    // Define your db_details
    const dbDetails = {
        db_user: "root",
        db_password: "",
        db_host:  "localhost",
        db_name: "dataset"
       
    };

    try {
        const response = await fetch('http://localhost:8000/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, db_details: dbDetails }),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Query Data:', responseData);
            setQueryData(responseData);
            setData(responseData);
        } else {
            const errorMessage = await response.text();
            console.error('Error executing query:', errorMessage);
        }
    } catch (error) {
        console.error('Error executing query:', error);
    }
};

  const handleEditChartClick = () => {
    setEditChartOpen(true);
  };

  const handleCloseEditChart = () => {
    setEditChartOpen(false);
  };

  const handleUpdateChart = () => {
    handleGenerateChart();
    setEditChartOpen(false);
  };

  const handleSaveChartClick = () => {
    setSaveChartOpen(true);
  };

  const handleCloseSaveChart = () => {
    setSaveChartOpen(false);
  };

  const handleSaveChart = async () => {
    try {
      const chartData = chartRef.current.toBase64Image();
      const response = await fetch('http://localhost:8000/api/save-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          chartName: savedChartName, 
          chartData,
           createdBy
          }),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Chart saved successfully');
      } else {
        console.error('Error saving chart:', responseData.error ||response.statusText);
      }
    } catch (error) {
      console.error('Error saving chart:', error);
    }

    setSaveChartOpen(false);
    setSavedChartName('');
    setCreatedBy('');
  };

  const handleViewSavedCharts = () => {
    navigate('/saved-charts');
  };

  return (
    <div className="chart-page-body">
      <form onSubmit={handleQuerySubmit} className="chart-page-form">
        <input 
        type="text"
        value={query} 
        onChange={handleQueryInputChange}
        className="chart-page-input" 
        />
        <br />
        <button type="submit" className="chart-page-button">Submit Query</button>
      </form>
      <div>
      {validationError && <p className="chart-page-error">{validationError}</p>}
        {data.length > 0 && (
          <table className="chart-page-table">
            <thead>
              <tr>
                {Object.keys(queryData[0] || {}).slice(0,2).map((key) => (
                  <th key={key} className="chart-page-th">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryData.map((row, index) => (
                <tr key={index}>
                  {Object.entries(row).slice(0, 2).map(([key,value], i) => (
                    <td key={i} className="chart-page-td">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <br />
        <button onClick={handleGenerateChart} className="chart-page-button">Generate Chart</button>
        <button onClick={handleEditChartClick} className="chart-page-button">Edit Chart</button>
        {editChartOpen && (
          <div className="edit-chart-modal">
            <div className="edit-chart-content">
              <span className="chart-page-close-button" onClick={handleCloseEditChart}>
                &times;
              </span>
              <h3>Edit Chart</h3>
              <div>
                <label htmlFor="chart-type">Chart Type:</label>
                <select
                  id="chart-type"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="chart-page-select"
                >
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                  <option value="pie">Pie</option>
                  <option value="doughnut">Doughnut</option>
                  <option value="radar">Radar</option>
                  <option value="polarArea">Polar Area</option>
                </select>
              </div>
              <br />

              <button onClick={handleUpdateChart} className="chart-page-button">Update Chart</button>
            </div>
          </div>
        )}
      </div>
      <br />
      <div className="chart-page-canvas-container">
        <canvas id="chart" className="chart-page-canvas"></canvas>
      </div>
      <br />
      <button onClick={handleSaveChartClick} className="chart-page-button">Save Chart</button>
      {saveChartOpen && (
        <div className="save-chart-modal">
          <div className="save-chart-content">
            <span className="close-button" onClick={handleCloseSaveChart}>
              &times;
            </span>
            <h3>Save Chart</h3>
            <div>
              <label htmlFor="saved-chart-name">Chart Name:</label>
              <input
                type="text"
                id="saved-chart-name"
                value={savedChartName}
                onChange={(e) => setSavedChartName(e.target.value)}
                className="chart-page-input"
              />
            </div>
            <div>
              <label htmlFor="created-by">Created By:</label>
              <input
                type="text"
                id="created-by"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                className="chart-page-input"
              />
            </div>
            <br />
            <button onClick={handleSaveChart} className="chart-page-button">Save Chart</button>
          </div>
        </div>
      )}
      <br /><br />
      <button onClick={handleViewSavedCharts} className="chart-page-button">View Saved Charts</button>
    </div>
  );
};

export default ChartPage;


