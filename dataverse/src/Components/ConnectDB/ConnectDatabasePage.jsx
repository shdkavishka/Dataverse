// ConnectDatabasePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConnectDatabasePage.css';
// import Header from '../Dashboard/Header';
import Header1 from '../header-all/Header1';
import { toast } from './toast'; // Import the toast function
import { useNavigate } from 'react-router-dom';

const ConnectDatabasePage = () => {
  const [server, setServer] = useState('');
  const [database, setDatabase] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate=useNavigate()

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setLoggedInUser(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchLoggedInUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!loggedInUser || !loggedInUser.id) {
        throw new Error('Logged-in user information not available.');
      }

      const payload = {
        name: name,
        server: server,
        database: database,
        user: username,
        password: password,
        owner: loggedInUser.id,
      };

      const response = await axios.post('http://localhost:8000/api/connected-databases/', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true  // Send credentials for CORS
      });

      if (response.data.error) {
        toast('Credentials Wrong: ' + response.data.error, 'error');
      } else {
        console.log('Connection successful', response.data);
        toast('Connection Successful', 'success');
        clearForm();
        navigate("/Dashboard")
      }
    } catch (error) {
      console.error('Error connecting to database:', error);

      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
        toast('Credentials Wrong: ' + (error.response.data.message || error.response.data.error || 'Unknown Error'), 'error');
      } else {
        toast('Credentials Wrong: ' + error.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setName('');
    setServer('');
    setDatabase('');
    setUsername('');
    setPassword('');
  };

  if (loading) {
    return <div>Loading user...</div>;
  }

  return (
    <div> <Header1/>
    <div className="container">
     
      <h1 className="form-title">Add Your Database</h1>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Server:</label>
            <input type="text" value={server} onChange={(e) => setServer(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Database:</label>
            <input type="text" value={database} onChange={(e) => setDatabase(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Connecting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default ConnectDatabasePage;
