import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "@asgardeo/auth-react";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider
        config={{
          signInRedirectURL: "http://localhost:3000/",
          signOutRedirectURL: "http://localhost:3000/",
          clientID: "7KbhUeHptMxSE5RCoySvJb06D78a",
          baseUrl: "https://api.asgardeo.io/t/aaishah",
          scope: ["openid", "profile"],
          disableTrySignInSilently: true,
          enableOIDCSessionManagement: true
        }}
      >
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
