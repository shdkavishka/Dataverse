// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home.jsx'
import ConnectDatabasePage from './Components/ConnectDB/ConnectDatabasePage';
import Header from './Components/Dashboard/Header';
import Dashboard from './Components/Dashboard/Dashboard';
import Login from './Components/SignAndLogin/Login';
import Signin from './Components/SignAndLogin/Signin';
import Profile from './Components/Profile/Profile';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/ConnectDatabasePage" element={<ConnectDatabasePage />} />
      <Route path="/Header" element={<Header />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/profile" element={<Profile />} />
      {/* Add more routes here */}
    </Routes>
  );
};

export default App;
