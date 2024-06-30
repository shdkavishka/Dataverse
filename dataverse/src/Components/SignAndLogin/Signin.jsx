import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signin.css';
import logo from "../../assets/logo2.png";
import axios from 'axios';
import "../../App.css";
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import Toast from "../Toast/Toast";
import Footer from "../footer-all/footer"
import Cookies from 'universal-cookie'
{/*
  import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
  */}

import { useGoogleLogin } from '@react-oauth/google';


import google from "../../assets/google.png";


// AH-- Signin
const Signin = () => {
  const Navigate = useNavigate();
  // AH-- cookies object to handle cookies
  const cookies=new Cookies();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");


  // AH-- for social register
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        //AH-- getting user info from Google API
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        //AH-- Extract user data from the response
        const email = res.data.email;
        const firstName = res.data.given_name;
        const lastName = res.data.family_name;
        const name = res.data.name;
        const google_id=res.data.sub;

        console.log('Sending user data to backend:', { email, firstName, lastName, name });

        //AH-- Send to the backend
        try {
          const response = await axios.post('http://localhost:8000/api/save_google_user', {
            email,
            name,
            firstName,
            lastName,
            google_id
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          console.log('Backend response:', response.data);
          setRedirect(true);
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

          showToast("User successfully Signed in", "success");
        } catch (error) {
          console.error('Error:', error);
          if (error.response && error.response.status === 400 && error.response.data.email) {
            showToast("Email already exists", "error");
          } else {
            showToast("Failed to Signin. Please try again.", "error");
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        showToast('Error fetching user info from Google', 'error')
      }
    },
    onFailure: (error) => {
      console.error('Login failed:', error);
      showToast('Signin failed', 'error')
    },
  });


  {/*
  const handleSuccess = (credentialResponse) => {
    const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
    console.log(credentialResponseDecoded);
    setRedirect(true);
  };

  const handleError = () => {
    console.log('Login Failed');
  };
*/}
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


      showToast("User successfullly registred", "success");
    } catch (error) {
      console.error('Error:', error);
      if (error.response.status === 400 && error.response.data.email) {
        showToast("Email already exists", "error");
      }
      else
        showToast("Failed to Register. Please try again.", "error");
    }
  };

  // AH-- Redirect to login once successfully signed in
  if (redirect) {
    Navigate('/Dashboard');
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
  const HandleKey = (e) => {
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
          <div><input type="textarea" className="input2" placeholder="Username" onChange={e => setName(e.target.value)} onKeyDown={HandleKey} /></div>
          <div><input type="email" className="input2" placeholder="E-mail" onChange={e => setEmail(e.target.value)} /></div>
          <div><input type={passwordVisibility ? " " : "password"} className="input2" placeholder="Password" onChange={e => setPassword(e.target.value)} /></div>
          <div><input type={passwordVisibility ? " " : "password"} className="input2" placeholder="Re-type Password" onChange={e => setConfirmPassword(e.target.value)} /></div>
          <div className='passwordVisibility' onClick={() => setPasswordVisibility(!passwordVisibility)}> {passwordVisibility ? (<p>Hide Password <EyeInvisibleOutlined /></p>) : (<p>Show Password <EyeOutlined /></p>)}</div>

          <button type="submit" className="continue-btn" >Continue</button>
          <div className="login-link2">
            <p>Have an account? <Link className='link' to="/Login">Login</Link></p>
          </div>
        </form>
        <hr className='hr'/>
        <p className='or'>or</p>



        <div className="social-login">

          <div>
            <div><button onClick={() => login()} className="social-btn"> <img src={google} alt="google" className="google" /><div>&nbsp; &nbsp; &nbsp;  Continue with Google</div> </button></div>

          </div>
          {/*
             <div>       <GoogleLogin className="social-login-button"
        onSuccess={handleSuccess}
        onError={handleError}
      /></div>
      */}


        </div>

      </div>
      <Footer />
    </div>
  );
}

export default Signin;
