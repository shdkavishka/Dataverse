import React, { useState } from 'react';
import Thumbup from '../../assets/icons8-thumb-up-50.png';
import Thumbdown from '../../assets/icons8-thumbs-down-50.png';
import './Feedback.css';
//gggggggggggggggggggggggggggggg

function Feedback() {
  // Define state variables using the useState hook
  const [text, setText] = useState('');     
  const [thumb, setThumb] = useState('');

  // Event handler to update the 'text' state when the textarea value changes
  const handleChange = (e) => {
    setText(e.target.value);
  };
  // Event handler to update the 'thumb' state when a thumb button is clicked
  const handleThumb = (thumbValue) => {
    setThumb(thumbValue);
    if (thumbValue == 'Thumbup'){
      window.alert("good");
    }
  };

  // Function to send feedback data to the server
  const sendData = (submit) => {
    fetch('http://127.0.0.1:5000/send-data', {    // Send a POST request to the server
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',       // Specify JSON content type in the request headers
      },
      body: JSON.stringify({ text: text, submit: submit, thumb:thumb }),  // Convert data to JSON string and send in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);  // Log the success message received from the server
      })
      .catch((error) => {
        console.error('Error:', error);   // Log any errors that occur during the request
      });
  };

  // Render the feedback form
  return (
    <div>
      <div className="container">
        <h1>Submit your feedback</h1><br/><br/>
        <textarea value={text} onChange={handleChange} />
      </div>
      <div >
        <button className ="button" onClick={() => sendData('submit')}> Submit </button>
        <button className="button" onClick={() => handleThumb('Thumbup')}><img src={Thumbup} alt='Thumbup' /></button>
        <button className="button" onClick={() => handleThumb('Thumbdown')}><img src={Thumbdown} alt='Thumbdown' /></button>
      </div>
    </div>
  );
}

export default Feedback;