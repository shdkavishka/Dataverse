import React, { useState } from "react";
import axios from "axios";
import "./FeedbackNew.css";

const FeedbackNew = ({ question, answer, chartData, onClose }) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/api/feedback/add_feedback_or_reaction/", {
        question: question,
        answer: answer,
        feedback: feedback,
        chartData: chartData,
      });
      setFeedback("");
      onClose(); 
    } catch (error) {
      console.error("There was an error submitting the feedback!", error);
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-area">
        <div className="feedback-header">
          <p className="close" onClick={onClose}>&times;</p>
        </div>
        <div className="feedback-body">
          <p>Enter your feedback :</p>
        </div>
        <div>
          <input
            className="feedback-text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
        <div className="feedback-footer">
          <button className="btn btn-submit" onClick={handleSubmit}>Submit</button>
          <button className="btn btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackNew;
