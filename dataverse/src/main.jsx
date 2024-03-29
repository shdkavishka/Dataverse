import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Signin from './Components/SignAndLogin/Signin.jsx';
import Login from './Components/SignAndLogin/Login.jsx';
import Header from './Components/Dashboard/Header.jsx';
import ConnectDatabasePage from './Components/ConnectDB/ConnectDatabasePage.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import Profile from './Components/Profile/Profile.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/ConnectDatabasePage",
    element: <ConnectDatabasePage/>,
  },
  
  
  {
    path: "/Header",
    element: <Header/>,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
  },
 
  {
    path: "/Login",
    element: <Login/>,
  },
  
  {
    path: "/signin",
    element:<Signin/> ,
  },
  {
    path: "/profile",
    element:<Profile/> ,
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
