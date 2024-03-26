import React from 'react';
import ChartGenerator from './ChartGenerator';
import './styles.css';

const HomePage = ({ data1, data2}) => {
  return (
    <div className="home-page">
      <div className="chart-box">
        <div className="employee-data">
        <h2>Data 1:</h2>
        {data1 && data1.map((item, index) => (
            <p key={index}>{item.year}: {item.value}</p>
          ))}
          <h2>Data 2:</h2>
          {data2 && data2.map((item, index) => (
            <p key={index}>{item.year}: {item.value}</p>
          ))}
        </div>
        <div className="chart-details">
        <ChartGenerator />
        <div className="chart-info">
        <h2>Chart Name</h2>
            <p>Created by: Sahla</p>
            <button>Delete</button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;









