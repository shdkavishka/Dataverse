import React, { useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';
import './styles.css';

const ChartGenerator = ({ chartType = 'bar', data1, data2 }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const generateChart = useCallback((type) => {
    if (chartRef.current && data1 && data2) {
      if (chartInstance.current !== null) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: type,
        data: {
          labels: data1.map(item => item.year),
          datasets: [{
            label: 'Male Employees',
            data: data1.map(item => item.value),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }, {
            label: 'Female Employees',
            data: data2.map(item => item.value),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }, [data1, data2]);

  useEffect(() => {
    generateChart(chartType); // Generate the default chart initially

    // Cleanup function
    return () => {
      if (chartInstance.current !== null) {
        chartInstance.current.destroy();
      }
    };
  }, [chartType, generateChart]);

  return (
    <div className="chart-container">
      <div className="canvas-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ChartGenerator;
