import React from 'react';
import ReactDOM from 'react-dom/client';
import 'regenerator-runtime/runtime';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';






const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
      <BrowserRouter>
    <GoogleOAuthProvider clientId='127204397595-ou180j4acvf3e1rm5ke5e1bes13o7rsr.apps.googleusercontent.com'>
  
      <App />
    
    </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
