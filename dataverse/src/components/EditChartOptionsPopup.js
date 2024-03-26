import React, { useState } from 'react';

const EditChartOptionsPopup = ({ chartOptions, updateChartOptions }) => {
    const [xAxisLabel, setXAxisLabel] = useState(chartOptions?.scales?.x?.title?.text || '');
    const [yAxisLabel, setYAxisLabel] = useState(chartOptions?.scales?.y?.title?.text || '');
    const [dataPointColor, setDataPointColor] = useState(chartOptions?.datasets[0]?.pointBackgroundColor || 'red');
    const [lineColor, setLineColor] = useState(chartOptions?.datasets[0]?.borderColor || 'black');
  
    const handleUpdateChartOptions = () => {
      // Create an object with the updated options
      const updatedOptions = {
        scales: {
          x: { title: { text: xAxisLabel } },
          y: { title: { text: yAxisLabel } }
        },
        datasets: [{
          pointBackgroundColor: dataPointColor ,
          borderColor: lineColor,
        }]
      };
    
      // Call the updateChartOptions function with the updated options
      updateChartOptions(updatedOptions);

    };
    
    return (
      <div className="popup">
        <div className="popup-inner">
          <label>X-axis Label:</label>
          <input
            type="text"
            value={xAxisLabel}
            onChange={e => setXAxisLabel(e.target.value)}
          />
  
          <label>Y-axis Label:</label>
          <input
            type="text"
            value={yAxisLabel}
            onChange={e => setYAxisLabel(e.target.value)}
          />
  
          <label>Data Point Color:</label>
          <select value={dataPointColor} onChange={e => setDataPointColor(e.target.value)}>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </select>
  
          <label>Line Color:</label>
          <select value={lineColor} onChange={e => setLineColor(e.target.value)}>
            <option value="black">Black</option>
            <option value="gray">Gray</option>
            <option value="orange">Orange</option>
          </select>
  
          <button onClick={handleUpdateChartOptions}>Update</button>
        </div>
      </div>
    );
  };

export default EditChartOptionsPopup;








