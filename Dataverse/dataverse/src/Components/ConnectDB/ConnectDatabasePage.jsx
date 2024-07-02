// ConnectDatabasePage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ConnectDatabasePage.css';
import Header from "../Dashboard/Header";

const ConnectDatabasePage = () => {
  const [server, setServer] = useState('');
  const [database, setDatabase] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/connected-databases/', {
        name: name,
        server: server,
        database: database,
        user: user,
        password: password
      });
      if (response.data.error) {
        alert('Connection Failed');
      } else {
        console.log('Connection successful', response.data);
        alert('Connection Successful');
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      alert('Connection Failed');
    }
  };

  return (
    <div className="container">
    <Header />
    <h1 className="form-title">Add Your Database</h1>
    <div className="form">
      <div className="input-group">
        <label>Name:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="input-group">
        <label>Server:</label>
        <input type="text" value={server} onChange={e => setServer(e.target.value)} />
      </div>
      <div className="input-group">
        <label>Database:</label>
        <input type="text" value={database} onChange={e => setDatabase(e.target.value)} />
      </div>
      <div className="input-group">
        <label>User:</label>
        <input type="text" value={user} onChange={e => setUser(e.target.value)} />
      </div>
      <div className="input-group">
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button className="btn" onClick={handleSubmit}>Submit</button>
    </div>
  </div>
  
  
  );
};

export default ConnectDatabasePage;
