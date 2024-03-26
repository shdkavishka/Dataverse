import React from 'react';
import './Signin.css';
import '../App.css';
import { useNavigate } from 'react-router-dom'
import logo from "../assets/logo.png"
import google from "../assets/google.png"
import fb from "../assets/fb.jpeg"
import linkedin from "../assets/linkedin.png"

const Signin = () => {
  const Navigate=useNavigate();
  return (
    <div className='Signin'>
      <button onClick={()=>Navigate(-1)}>Home</button>
      <img
        src={logo}
        alt="logo-Signin"
        className="logo-Signin"
      />
    
      <div className="openText">Create your Account</div>
      <div>
        <form className="Signin-form">
          <div><input type="text" className="input" placeholder="Username" /></div>
          <div><input type="password" className="input" placeholder="Password" /></div>
          
      
          <button type="submit" className="continue-btn" onClick={()=>Navigate('Dashboard')}>Continue</button>
          <div className="login-link">
            <p>Have an account? <button onClick={()=>Navigate('Login')}>Login</button></p>
    
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

export default Signin





