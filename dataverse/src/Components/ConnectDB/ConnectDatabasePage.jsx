import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConnectDatabasePage.css';
import Header from '../Dashboard/Header';

const ConnectDatabasePage = () => {
  const [server, setServer] = useState('');
  const [database, setDatabase] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/");
        setLoggedInUser(response.data);
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

      const response = await axios.post('http://localhost:8000/api/connected-databases/', {
        name: name,
        server: server,
        database: database,
        username: username,
        password: password,
        owner: loggedInUser.id,
      });

      if (response.data.error) {
        alert('Connection Failed: ' + response.data.error);
      } else {
        console.log('Connection successful', response.data);
        alert('Connection Successful');
        clearForm();
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      alert('Connection Failed: ' + error.message);
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
    <div className="container">
      <Header />
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
  );
};

export default ConnectDatabasePage;
