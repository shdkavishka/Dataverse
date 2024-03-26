

import React from 'react';
import './Login.css';
import '../App.css';
import { useNavigate } from 'react-router-dom'
import logo from "../assets/logo.png"
import google from "../assets/google.png"
import fb from "../assets/fb.jpeg"
import linkedin from "../assets/linkedin.png"

const Login = () => {
  const Navigate=useNavigate();
  return (
    <div className='Login'>
      <button onClick={()=>Navigate(-1)}>Home</button>
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
          <button type="submit" className="continue-btn" onClick={()=>Navigate('Dashboard')}>Continue</button>
          <div className="signup-link">
            <p>Don't have an account? <button onClick={()=>Navigate('Signin')}>SignIn</button></p>
    
          </div>
        </form>
        <div className="social-login">
        <div><button className="social-btn"> <img src={google} alt="google" className="google"/><div>&nbsp; &nbsp; &nbsp;  Continue with Google</div> </button></div>
        <div><button className="social-btn"> <img src={fb} alt="fb" className="fb"/><div> &nbsp; &nbsp; &nbsp; Continue with Facebook</div></button></div>
        <div><button className="social-btn"> <img src={linkedin} alt="linkedin" className="linkedin"/><div> &nbsp; &nbsp; &nbsp; Continue with LinkedIn</div> </button></div>
        </div>
      </div>
    </div>
  );
}

export default Login;