import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Header from './Components/Header/Header.jsx';
import Feedback from './Components/Feedback/Feedback.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
 
  {
    path: "/Header",
    element:<Header />,
  },

  {
    path: "/Feedback",
    element:<Feedback />,
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)