import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signin.css';
import logo from "../../assets/logo2.png";
import axios from 'axios';
import "../../App.css";
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import Toast from "../Toast/Toast";
import Footer from "../footer-all/footer"

   {/*
import google from "../../assets/google.png";
import fb from "../../assets/fb.jpeg";
import linkedin from "../../assets/linkedin.png";
*/}

// AH-- Signin
const Signin = () => {
  const Navigate = useNavigate();
  const [passwordVisibility,setPasswordVisibility] =useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(""); 



  const submit = async (e) => {
    e.preventDefault();
   
    // AH-- Check if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      showToast('All fields are required', "error");
      return;
    }

    // AH-- Check if password is at least 8 characters long
    if (password.length < 8 || confirmPassword.length < 8) {
      showToast('Password must be at least 8 characters long', "error");
      return;
    }

     // AH-- Check if passwords match
    if (password !== confirmPassword) {
      showToast('Passwords do not match', "error");
      
      return;
    }

    try {

      // AH-- Make a POST request to register the user
      const response = await axios.post('http://localhost:8000/api/register', {
        name,
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);
      setRedirect(true);

     
      showToast("User successfullly registred", "success");
    } catch (error) {
      console.error('Error:', error);
      if (error.response.status === 400 && error.response.data.email) {
        showToast("Email already exists", "error");}
        else
      showToast("Failed to Register. Please try again.", "error");
    }
  };
 
  // AH-- Redirect to login once successfully signed in
  if (redirect) {
    Navigate('/login');
  }

   // AH-- to show toast
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
      setToastType("");
    }, 3000); 
  };


   // AH-- alerting user
  const HandleKey=(e)=>{
    showToast("You wont be able to edit the username later", "alert");
  }



  return (
    <div className='Signin'>
       
      <Link className="home_link" to="/Home">Home</Link>
      {toastMessage && (
            <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
          )}
      <img src={logo} alt="logo-Signin" className="logo-Signin" />
      <div className="openText">Create your Account</div>
      <div>
        <form className="Signin-form" onSubmit={submit}>
          <div><input type="textarea" className="input2" placeholder="Username" onChange={e => setName(e.target.value) } onKeyDown={HandleKey} /></div>
          <div><input type="email" className="input2" placeholder="E-mail" onChange={e => setEmail(e.target.value)} /></div>
          <div><input type={passwordVisibility?" ":"password"} className="input2" placeholder="Password" onChange={e => setPassword(e.target.value)} /></div>
          <div><input type={passwordVisibility?" ":"password"} className="input2" placeholder="Re-type Password" onChange={e => setConfirmPassword(e.target.value)} /></div>
         <div className='passwordVisibility' onClick={()=>setPasswordVisibility(!passwordVisibility)}> {passwordVisibility?(<p>Hide Password <EyeInvisibleOutlined/></p>):(<p>Show Password <EyeOutlined/></p>)}</div>
         
          <button type="submit" className="continue-btn" >Continue</button>
          <div className="login-link">
            <p>Have an account? <Link className='link' to="/Login">Login</Link></p>
          </div>
        </form>
   {/*
        <div className="social-login">
        <div><button className="social-btn"> <img src={google} alt="google" className="google"/><div>&nbsp; &nbsp; &nbsp;  Continue with Google</div> </button></div>
        <div><button className="social-btn"> <img src={fb} alt="fb" className="fb"/><div> &nbsp; &nbsp; &nbsp; Continue with Facebook</div></button></div>
        <div><button className="social-btn"> <img src={linkedin} alt="linkedin" className="linkedin"/><div> &nbsp; &nbsp; &nbsp; Continue with LinkedIn</div> </button></div>
        </div>
  */}
        
      </div>
      <Footer/>
    </div>
  );
}

export default Signin;
