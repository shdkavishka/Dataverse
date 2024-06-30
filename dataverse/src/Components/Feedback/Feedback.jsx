import React, { useState } from "react";
import axios from "axios";
import Thumbup from "../../assets/icons8-thumb-up-50.png";
import Thumbdown from "../../assets/icons8-thumbs-down-50.png";
import Feedback_icon from "../../assets/feedback-icon.png";
import FeedbackNew from "../FeedbackNew/FeedbackNew";
import "./Feedback.css";

const Feedback = ({ question, answer }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [currentAnswer, setCurrentAnswer] = useState(answer);

  const openFeedbackModal = () => {
    setModalOpen(true);
  };

  const handleButtonClick = () => {
    setModalOpen(false);
  };

  const handleThumb = async (reaction) => {
    await axios.post('http://localhost:8000/api/qna/add_feedback_or_reaction/', {
      question: currentQuestion,
      answer: currentAnswer,
      reaction: reaction,
    });
  };

  return (
    <div className="feedback">
      <button className="modal-open button" onClick={openFeedbackModal}>
        <img src={Feedback_icon} alt="Feedback" />
      </button>
      <button className="button" onClick={() => handleThumb('good')}>
        <img src={Thumbup} alt="Thumbup" />
      </button>
      <button className="button" onClick={() => handleThumb('bad')}>
        <img src={Thumbdown} alt="Thumbdown" />
      </button>
      {modalOpen && (
        <FeedbackNew
          question={currentQuestion}
          answer={currentAnswer}
          onClose={handleButtonClick}
        />
      )}
    </div>
  );
};

export default Feedback;
