import React, { useState } from 'react';
import EditChartOptionsPopup from './EditChartOptionsPopup';

    const ChartComponent = ({ chartOptions, updateChartOptions }) => { // Receive chartOptions and updateChartOptions as props
      const [showPopup, setShowPopup] = useState(false);
  
      const handleEditChart = () => {
        setShowPopup(true);
      };

     // handleEditChart();
  
    return (
      <div>
         {/* Render EditChartOptionsPopup only when showPopup is true */}
        {showPopup && chartOptions && (
          <EditChartOptionsPopup
            chartOptions={chartOptions}
            updateChartOptions={updateChartOptions}
          />
        )}

     
      </div>
    );
  };

export default ChartComponent;




