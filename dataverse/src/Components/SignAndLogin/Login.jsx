import React from 'react';
import './Login.css';

import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo2.png";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className='Login'>
      <button onClick={() => navigate(-1)}>Home</button>
      <img
        src={logo}
        alt="logo-login"
        className="logo-login"
      />
    
      <div className="openText">Welcome Back</div>
      <div>
        <form className="login-form">
          <div><input type="text" className="input" placeholder="Username" /></div>
          <div><input type="password" className="input" placeholder="Password" /></div>
          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>
          <div className="remember-me">
            <label><input type="checkbox" name="remember" /> Remember me on this computer</label>
          </div>
          <button type="submit" className="continue-btn" onClick={() => navigate('/dashboard')}>Continue</button>
          <div className="signup-link">
            <p>Don't have an account? <button onClick={() => navigate('/Signin')}>SignIn</button></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
