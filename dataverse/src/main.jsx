import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ConnectDatabasePage from './Components/Dashboard/ConnectDB/ConnectDatabasePage'
import Header from './Components/Dashboard/Header'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/ConnectDatabasePage",
    element: <ConnectDatabasePage />,
  },
  
  
  {
    path: "/Header",
    element: <Header/>,
  },


]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
