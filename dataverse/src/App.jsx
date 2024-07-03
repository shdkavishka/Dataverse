// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home.jsx'
import ConnectDatabasePage from './Components/ConnectDB/ConnectDatabasePage';
import Header from './Components/Dashboard/Header';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import Login from './Components/SignAndLogin/Login';
import Signin from './Components/SignAndLogin/Signin';
import Profile from './Components/Profile/Profile';
import ResetPassword from './Components/SignAndLogin/ResetPassword';
import Chat from './Components/Chat/Chat.jsx';
import ResetPasswordConfirm from './Components/SignAndLogin/ResetPasswordConfirm'
import './App.css'
import ChartPage from './components/Visualization/ChartPage.jsx';
import SavedCharts from './Components/Visualization/SavedCharts.jsx';
import UIGuide from "./Components/UIGuide/UIGuide.jsx"

const App = () => {


  return (
    <div className="App">
    <Routes>
      <Route path="" element={<Home/>} />
      <Route path="/" element={<Home/>} />
      <Route path="/Home" element={<Home/>} />
      <Route path="/ConnectDatabasePage" element={<ConnectDatabasePage />} />
      <Route path="/Header" element={<Header />} />
      <Route path="/UIGuide" element={<UIGuide />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/Chat" element={<Chat />} />
      <Route path="/Signin/Dashboard" Component={Dashboard} />
        <Route path="/Login/Dashboard" Component={Dashboard} />
        <Route path="/Login/Signin/Dashboard" Component={Dashboard} />
        <Route path="/Signin/Login/Dashboard" Component={Dashboard} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/api/reset_password_confirm/:uidb64/:token/" element={<ResetPasswordConfirm />} />
        <Route path="/ChartPage" element={<ChartPage />} />
        <Route path="/saved-charts" element={<SavedCharts />} />  
    </Routes>
    </div>  
  );
};

export default App;
