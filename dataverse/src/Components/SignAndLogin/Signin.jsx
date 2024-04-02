import React from 'react';
import './Signin.css';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png";

const Signin = () => {
  const navigate = useNavigate();

  return (
    <div className='Signin'>
      <button onClick={() => navigate(-1)}>Home</button>
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
          
          <button type="submit" className="continue-btn" onClick={() => navigate('/')}>Continue</button>
          <div className="login-link">
            <p>Have an account? <button onClick={() => navigate('/Login')}>Login</button></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
