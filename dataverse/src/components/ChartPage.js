import React, { useState } from 'react';
import ChartComponent from './ChartComponent';
import EditChartOptionsPopup from './EditChartOptionsPopup';
import Chart from 'chart.js/auto';
import { useQueryLogic } from './queryLogic';
import './styles2.css';

const ChartPage = () => {
  const [query, setQuery] = useState('');
  const [chart, setChart] = useState(null);
  /*const [userInput, setUserInput] = useState({
    xAxisLabel: '',
    yAxisLabel: '',
    dataPointColor: '',
    lineColor: ''
  });*/


  const [showEditPopup, setShowEditPopup] = useState(false); // State to control the visibility of the edit chart options popup
  
  const { data, handleSubmitQuery } = useQueryLogic(); // Use query logic hook


  /*const handleSubmitQuery = async () => {*/
    // Call backend API to fetch data based on the user query
    // Example: const responseData = await fetch('backendAPIURL', {
    //   method: 'POST',
    //   body: JSON.stringify({ query }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
    // const responseData = await response.json();
    // setData(responseData);
    // Fetch data based on the user query
   // try {
      // Dummy data for demonstration
      /*setData([
        { label: 'Category 1', value: 10 },
        { label: 'Category 2', value: 20 },
        { label: 'Category 3', value: 30 },      
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };*/
        

const handleGenerateChart = () => {
  // Determine suitable chart type based on the nature of data
  const chartType = determineChartType(data);

  // Customize chart options based on user preferences
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // Customize other options as needed
  };

  // Destroy existing chart instance if present
  if (chart !== null) {
    chart.destroy();
  }

  // Render new chart using Chart.js
  const ctx = document.getElementById('chart');
  setChart(new Chart(ctx, {
    type: chartType,
    data: {
      labels: data.map(item => item.label),
      datasets: [{
        label: 'Data',
        data: data.map(item => item.value),
        backgroundColor: '#007bff', // Example color
      }],
    },
    options: chartOptions,
  }));
};


const determineChartType = (data) => {
  const numberOfDataPoints = data.length;

  if (numberOfDataPoints === 0) {
    // No data points, return null or default chart type
    return null;
  } else if (numberOfDataPoints === 1) {
    // If there's only one data point, use scatter plot
    return 'scatter';
  } else if (numberOfDataPoints === 2) {
    // If there are only two data points, use line chart
    return 'bar';
  } else {
    // For more than two data points, determine based on data characteristics
    const hasOneCategory = data.every(item => item.label === data[0].label);
   // const totalValue = data.reduce((total, item) => total + item.value, 0);

    if (hasOneCategory) {
      // If data has only one category, use bar chart
      return 'bar';
    } else {
      // Otherwise, determine based on data distribution and characteristics
      // Check for specific conditions to determine suitable chart types

      // Check if data values are within a certain range
      const maxDataValue = Math.max(...data.map(item => item.value));
      const minDataValue = Math.min(...data.map(item => item.value));
      const dataRange = maxDataValue - minDataValue;

      if (dataRange > 100) {
        // If data range is large, use scatter plot
        return 'scatter';
      } else if (dataRange <= 100 && numberOfDataPoints >= 10) {
        // If data range is small and number of data points is limited, use line chart
        return 'line';
      } else if (numberOfDataPoints >= 3 && numberOfDataPoints < 10) {
        // For datasets with three or more data points, consider using a radar chart
        return 'bar';
      } else {
        // If none of the above conditions are met, default to pie chart
        return 'pie';
      }
    }
  }
};

         
  
  const handleEditChart = () => {
    // Function to handle editing the chart
    setShowEditPopup(true); // Show the edit chart options popup when this function is called
  };

          

  const handleSaveChart = async () => {
    if (chart === null) {
      // No chart to save
      return;
    }
  
    // Extract necessary data from the chart
    const chartData = chart.data;
    const chartOptions = chart.options;
  
    try {
      // Send chart data to the backend to save
      const response = await fetch('backendAPIURL', {
        method: 'POST',
        body: JSON.stringify({
          chartData: chartData,
          chartOptions: chartOptions,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        // Chart saved successfully
        console.log('Chart saved successfully');
      } else {
        // Handle error saving chart
        console.error('Failed to save chart');
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error saving chart:', error);
    }
  };


  const handleQueryInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleQuerySubmit = (event) => {
    event.preventDefault(); // Prevent form submission

    // Check if the query is a predefined query
    if (query === 'courseCredits' || query === 'studentCountByGender' || query === 'lecturerCoursesCount'
     || query === 'courseEnrollmentCount' ) {
      // If it's a predefined query, pass it to handleSubmitQuery
      handleSubmitQuery(query);
    } else {
      // If it's not a predefined query, handle it differently (e.g., call a backend API)
      // Your custom logic here
    }
  };

  const handleUpdateChartOptions = (updatedOptions) => {
    // Update chart options
    // Implementation remains the same
    if (chart !== null) {
      chart.options = updatedOptions;
      chart.update();
      setShowEditPopup(false);
    }
  };
 
  return (
    <div>
      {/* User interface elements for input and displaying data */}
      <form onSubmit={handleQuerySubmit}> {/* Attach handleQuerySubmit to form submission event */}
      <input type="text" value={query} onChange={handleQueryInputChange} />
      <button onClick={handleSubmitQuery}>Submit Query</button>
      </form>
      <div>
        {data.length > 0 && (
          <table>
          <thead>
            <tr>
              <th>Label</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.label}>
                <td>{item.label}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
        <br></br>
        <button onClick={handleGenerateChart}>Generate Chart</button>
      </div>
      {/* Canvas for displaying the chart */}
      <div className="canvas-container">
        <canvas id="chart"></canvas>
        <br></br>
        {/* Buttons for editing and saving the chart */}
        <button onClick={handleEditChart}>Edit Chart</button>
        <button onClick={handleSaveChart}>Save Chart</button>
      </div>    
      {/* Render ChartComponent */}
      <ChartComponent chartOptions={chart && chart.options} updateChartOptions={handleUpdateChartOptions} />
      {/* Render EditChartOptionsPopup if showEditPopup is true */}
      {showEditPopup && (
        <EditChartOptionsPopup chartOptions={chart && chart.options} updateChartOptions={handleUpdateChartOptions} />
      )}       
    </div>
  );
};
export default ChartPage;
  
