import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css'; // Import the CSS file for styling
import Footer from "../../Components/footer-all/footer"
import Header from '../header-all/Header1';

const Admin = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0); // State for count
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Number of rows per page

  useEffect(() => {
    // Fetch all feedbacks from the backend
    axios.get("http://localhost:8000/api/feedback/get_all_feedbacks/")
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error));

    // Fetch the count of feedbacks from the backend
    axios.get("http://localhost:8000/api/feedback/count_feedbacks/")
      .then(response => setCount(response.data.count))
      .catch(error => console.error('Error fetching count:', error));
  }, []);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/feedback/${id}/delete_feedback/`)
      .then(() => {
        setData(data.filter(row => row.id !== id));
        setCount(count - 1);
      })
      .catch(error => console.error('Error deleting data:', error));
  };

  return (
    <div>
      <Header />
      <div className="admin-dashboard">
        <h2>Feedbacks</h2>
        <p>Total Feedbacks: {count}</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
              <th>Chart Image</th>
              <th>Reaction</th>
              <th>Feedback</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map(row => (
              <tr key={row.id}>
                <td>{row.question}</td>
                <td>{row.answer_query}</td>
                <td>
                  {row.chart_image && <img src="{row.chart_image}" alt="chart" />}
                </td>
                <td>{row.reaction}</td>
                <td>{row.feedback}</td>
                <td>
                  <button className="action-button" onClick={() => handleDelete(row.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>{`Page ${currentPage} of ${Math.ceil(data.length / rowsPerPage)}`}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastRow >= data.length}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
