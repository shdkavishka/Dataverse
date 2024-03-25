import React, { useState } from 'react';
import Thumbup from '../../assets/icons8-thumb-up-50.png';
import Thumbdown from '../../assets/icons8-thumbs-down-50.png';

function Feedback() {
  const [text, setText] = useState('');

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const sendData = (feedback) => {
    fetch('http://127.0.0.1:5000/send-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text, thumb: feedback }),  // Corrected 'Thumbup' and 'Thumbdown' here
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <div>
        <h1>Send Data to SQL Server</h1>
        <textarea value={text} onChange={handleChange} />
        <button onClick={() => sendData('')}>Send</button>
      </div>
      <div>
        <button onClick={() => sendData('Thumbup')}><img src={Thumbup} alt='' /></button>
        <button onClick={() => sendData('Thumbdown')}><img src={Thumbdown} alt='' /></button>
      </div>
    </div>
  );
}

export default Feedback;