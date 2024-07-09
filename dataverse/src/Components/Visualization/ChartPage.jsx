import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './styles2.css';
import axios from 'axios';

const ChartPage = ({ LangchainQuery, onChartData ,database_id, createdBy }) => {

  const [db_server,setdb_server]=useState("")
  const [db_name,setdb_name]=useState("")
  const [db_user,setdb_user]=useState("")
  const [db_password,setdb_password]=useState("")
  const fetchData = async () => {
    try {
        const response = await axios.get(`http://localhost:8000/api/view-database/${database_id}/`);
        console.log(response.data);
        setdb_server(response.data.server);
        setdb_name(response.data.database);
        setdb_user(response.data.user);
        setdb_password(response.data.password);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
};
  useEffect(() => {
    
    fetchData();
}, [database_id]);
  const [query, setQuery] = useState('');
  const [queryData, setQueryData] = useState([]);
  const [data, setData] = useState([]);
  const [editChartOpen, setEditChartOpen] = useState(false);
  const [chartType, setChartType] = useState('bar'); 
  const [saveChartOpen, setSaveChartOpen] = useState(false);
  const [savedChartName, setSavedChartName] = useState('');
  const [validationError, setValidationError] = useState('');
  const [chartInstance, setChartInstance] = useState(null);
  const canvasRef = useRef(null);
 
  const chartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(LangchainQuery);
  }, [LangchainQuery]);

  useEffect(() => {
    handleQuerySubmit();
  }, [query]);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

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
    createChart();
  };

  const createChart = () => {

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
    });

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000, // General animation time
      },
      hover: {
        animationDuration: 0, // Duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0,
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

    if (chartInstance) {
      console.log('Destroying previous chart instance...');
      chartInstance.destroy();
    }
  
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
    console.log('Creating new chart instance...');
    const newChart = new Chart(ctx, {
      type: chartType,
      data: chartData,
      options,
      plugins: [ChartDataLabels],
    });
      setChartInstance(newChart);
    console.log('New chart instance created');

    // Send chart data to parent component (ChatArea.jsx)
    if (typeof onChartData === 'function') {
      const base64Image = canvasRef.current.toDataURL('image/png');
      onChartData(base64Image);
    }

      // Force an update after a short delay
      setTimeout(() => {
        newChart.update();
      }, 100);
    }
  };
        

  const handleQuerySubmit = async () => {
     console.log(db_user,db_name,db_password,database_id,db_server)
    const dbDetails = {
      db_user: db_user,
      db_password: db_password,
      db_host: db_server,
      db_name: db_name,
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
    createChart();
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
      if (!chartInstance) {
        console.error('No chart to save');
        return;
      }

      const chartData = canvasRef.current.toDataURL('image/png');
      const response = await fetch('http://localhost:8000/api/save-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chartName: savedChartName,
          chartData,
          createdBy: createdBy,
          database_id: database_id,
        }),
      });
      
      const result = await response.json();

      if (response.ok) {
        console.log('Chart saved successfully');
      } else {
        console.error('Error saving chart:', responseData.error || response.statusText);
      }
    } catch (error) {
      console.error('Error saving chart:', error);
    }

    setSaveChartOpen(false);
    setSavedChartName('');
    
  };

  const handleViewSavedCharts = () => {
    navigate(`/saved-charts/${createdBy}`);
  };

  return (
    <div className="chart-page-body">
      <div>
        {validationError && <p className="chart-page-error">{validationError}</p>}
        {data.length > 0 && (
          <table className="chart-page-table">
            <thead>
              <tr>
                {Object.keys(queryData[0] || {}).slice(0, 2).map((key) => (
                  <th key={key} className="chart-page-th">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryData.map((row, index) => (
                <tr key={index}>
                  {Object.entries(row).slice(0, 2).map(([key, value], i) => (
                    <td key={i} className="chart-page-td">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <br />
        <button onClick={handleGenerateChart} className="chart-page-button">Generate Chart</button>
        {chartInstance && (
        <button onClick={handleEditChartClick} className="chart-page-button">Edit Chart</button>
        )}
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

      <div className="chart-page-canvas-container" style={{ width: '100%', height: '400px' }}>
        <canvas ref={canvasRef} className="chart-page-canvas"></canvas>
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
              <label htmlFor="chart-name">Chart Name:</label>
              <input
                id="chart-name"
                type="text"
                value={savedChartName}
                onChange={(e) => setSavedChartName(e.target.value)}
                className="save-chart-input"
              />
            </div>
            <br />
            <button onClick={handleSaveChart} className="chart-page-button">Save</button>
          </div>
        </div>
      )}
      <br />
      <button onClick={handleViewSavedCharts} className="chart-page-button">View Saved Charts</button>
    </div>
  );
};

export default ChartPage;
