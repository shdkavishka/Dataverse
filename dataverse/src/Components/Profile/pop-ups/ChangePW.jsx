import './changePW.css';
import React, { useState } from 'react';
import axios from 'axios';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import Toast from '../../Toast/Toast';


// AH-- pop up to Change pw
const ChangePW = (props) => {

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  // AH-- to show toast ->error, success,alert
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(""); 


  // AH-- Handle form submission for changing password
  // AH-- save button(submit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    //AH-- Check if all fields are filled
    if (!currentPassword || !password || !confirmPassword) {
      showToast('All fields are required.', "error");
      return;
    }

    //AH-- Check if password is at least 8 characters long
    if (password.length < 8) {
      showToast('Password must be at least 8 characters long.', "error");
      return;
    }

    //AH-- Check if passwords match
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', "error");
      return;
    }
    //send POST request to backend authenticated user password reset end point
    try {
      const response = await axios.post(
        'http://localhost:8000/api/reset_password_confirm/',
        {
          current_password: currentPassword,
          new_password: password,
          confirm_password: confirmPassword
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true 
        }
      );

      showToast('Password Reset Successful.', "success");
    
      props.setTrigger(false);
    } catch (error) {
      //AH-- error handle
      if (error.response) {
        if (error.response.status === 400) {
          
          showToast('Invalid request. Please try again.', "error");
        } else if (error.response.status === 401) {
          showToast('Unauthorized request. Token may have expired.', "error");
        } else if (error.response.status === 404) {
      
          showToast('Resource not found.', "error");
        } else {
         
          showToast('An unknown error occurred.', "error");
        }
      } else if (error.request) {
        showToast( 'Unable to connect to the server. Please check your network connection.', "error");
      } else {
        showToast('An error occurred. Please try again.', "error");
      }
      
    }
  };
  // AH-- to Show toast message
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
      setToastType("");
    }, 3000); 
  };
  return props.trigger ? (
    <div className='changePW'>
      <div>
      {toastMessage && (
            <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
          )}
        <form onSubmit={handleSubmit}>
          <div>Change Password</div>
          <div>
            <input
              className='Current-password'
              id='Current-password'
              placeholder='Current password'
              type={passwordVisibility ? '' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              className='New-password'
              id='New-password'
              placeholder='New password'
              type={passwordVisibility ? '' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              className='Confirm-password'
              id='Confirm-password'
              placeholder='Confirm password'
              type={passwordVisibility ? '' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div
            className='passwordVisibility2'
            onClick={() => setPasswordVisibility(!passwordVisibility)}
          >
            {passwordVisibility ? (
              <p>
                Hide Password <EyeInvisibleOutlined />
              </p>
            ) : (
              <p>
                Show Password <EyeOutlined />
              </p>
            )}
          </div>
          <div>
            <button type='submit' className='save-button'>
              Save
            </button>
          </div>
          <div>
            <button className='cancel-button' onClick={() => props.setTrigger(false)}>
              Cancel
            </button>
          </div>
        </form>
      
      </div>
    </div>
  ) : null;
};

export default ChangePW;
