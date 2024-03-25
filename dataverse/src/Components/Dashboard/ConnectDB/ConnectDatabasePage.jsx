// ConnectDatabasePage.jsx
import { useState } from 'react';
import axios  from  'axios'
import React from 'react';
import './ConnectDatabasePage.css'; // Import the CSS file

const ConnectDatabasePage = () => {

const [server , setServer] = useState('');
const [database, setDatabase] = useState('');

const handleSubmit = ()=>{
  const data = {
    server:server,
    database:database,
  };
  axios.post('http://localhost:5000/test-connections',[data])
  .then(response =>{
    console.log('connection successful' , response.data)
    alert('Connecyion Successfull')
  })
};


return (
  <div className="container">
    <h1>User Page</h1>
    <div className="input-group">
      <label>Server:</label>
      <input type="text" value={server} onChange={e => setServer(e.target.value)} />
    </div>
    <div className="input-group">
      <label>Database:</label>
      <input type="text" value={database} onChange={e => setDatabase(e.target.value)} />
    </div>
    <button onClick={handleSubmit}>Submit</button>
    
   
  </div>
);
}

export default ConnectDatabasePage;
