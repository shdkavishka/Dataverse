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
import ChartPage from './Components/Visualization/ChartPage.jsx';
import SavedCharts from './Components/Visualization/SavedCharts.jsx';
import UIGuide from "./Components/UIGuide/UIGuide.jsx"
import Profile2 from './Components/Profile/ProfileOther.jsx';
import CollaborationConfirm from './Components/Collaboration/CollaborationConfirm.jsx';
import ViewDatabase from './Components/Collaboration/viewDatabase.jsx';
import Admin from "./Components/Admin/Admin.jsx"
import SavedCharts2 from './Components/Visualization/SavedCharts2.jsx';
import SavedCharts3 from './Components/Visualization/SavedCharts3.jsx';


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
      <Route path="/Admin" element={<Admin />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/Chat/:database_id" element={<Chat />} />
      <Route path="/Chat/:database_id" Component={Chat} />
      <Route path="/Signin/Dashboard" Component={Dashboard} />
        <Route path="/Login/Dashboard" Component={Dashboard} />
        <Route path="/Login/Signin/Dashboard" Component={Dashboard} />
        <Route path="/Signin/Login/Dashboard" Component={Dashboard} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/api/reset_password_confirm/:uidb64/:token/" element={<ResetPasswordConfirm />} />
        <Route path="/ChartPage" element={<ChartPage />} />
        <Route path="/saved-charts/:user_id" element={<SavedCharts />} />  
        <Route path="/saved-charts2/:database_id" element={<SavedCharts2 />} />  
        <Route path="/saved-charts3/:other_user_id/:name" element={<SavedCharts3 />} />  
        <Route path="/profile/:userId" element={<Profile2 />} />
        <Route path="/confirm-collaboration/:db_id/:user_id/:sender_id" element={<CollaborationConfirm/>} />
        <Route path="/databases/:database_id/" element={<ViewDatabase />}/>

    </Routes>
    </div>  
  );
};

export default App;
