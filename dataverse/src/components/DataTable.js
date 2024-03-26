import React from 'react';
import './styles.css';

const DataTable = ({ data1, data2 }) => {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Data 1</th>
            <th>Data 2</th>
          </tr>
        </thead>
        <tbody>
          {data1.map((data, index) => (
            <tr key={index}>
              <td>{data.year}</td>
              <td>{data.value}</td>
              <td>{data2[index].value}</td> {/* Assuming data2 has same length as data1 */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
