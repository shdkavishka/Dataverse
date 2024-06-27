import React from 'react';
import './Toast.css';

 // AH-- Toast
const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="toast-message">{message}</div>
      </div>
    </div>
  );
};

export default Toast;
