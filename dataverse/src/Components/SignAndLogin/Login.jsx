// src/components/Login.js
import React, { useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import logo from "../../assets/logo2.png";
import axios from 'axios';
import "../../App.css";
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import Toast from "../Toast/Toast";
import Footer from "../footer-all/footer"
import Cookies from 'universal-cookie'

// AH-- login
const Login = () => {
  const navigate = useNavigate();
  // AH-- cookies object to handle cookies
  const cookies=new Cookies();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(""); 


// AH-- Handles form submission for login
// AH-- continue
  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast( "All Fields are required" ,"error")
      return;
    }

     // AH-- Make a POST request to the login endpoint
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      console.log(response.data);
      const jwt_token = response.data.jwt;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);

      // AH-- Set JWT token in cookies
      cookies.set("jwt", jwt_token, {
        path: '/',
        expires: expiryDate,
        secure: true, 
        sameSite: 'strict'
      });
      
      setRedirect(true);
      showToast("Logged in successfully", "success");
    } catch (error) {
  
      console.error('Error:', error);
      showToast("Failed to Login. Please try again.", "error");
    
    }
  };

  // AH-- redirect if login succeess
  if (redirect) {
    navigate('Dashboard');
  }

  // AH-- for toast
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
      setToastType("");
    }, 3000); 
  };

  return (
    <div className='Login'>
      
      <Link className="home_link" to="/Home">Home</Link>
      {toastMessage && (
            <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
          )}
      <img src={logo} alt="logo-login" className="logo-login" />

      <div className="openText">Welcome Back</div>
      <div>
        <form className="login-form" onSubmit={submit}>
          <div><input type="email" className="input2" placeholder="E-mail" onChange={e => setEmail(e.target.value)} /></div>
          <div><input type={passwordVisibility ? " " : "password"} className="input2" placeholder="Password" onChange={e => setPassword(e.target.value)} /></div>
          <div>
            <div className='passwordVisibility' onClick={() => setPasswordVisibility(!passwordVisibility)}> {passwordVisibility ? (<p>Hide Password <EyeInvisibleOutlined /></p>) : (<p>Show Password <EyeOutlined /></p>)}</div>
            <div className="forgot-password">
              <Link to="/ResetPassword">Forgot password?</Link>
            </div>
          </div>

          <button type="submit" className="continue-btn" >Continue</button>
          <div className="signup-link">
            <p>Don't have an account? <Link className='link' to="/Signin">Signup</Link></p>
          </div>
        </form>
      </div>
      <Footer/>
    </div>
  );
}

export default Login;