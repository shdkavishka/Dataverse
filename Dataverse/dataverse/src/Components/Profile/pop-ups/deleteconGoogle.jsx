import React, { useState } from "react";
import './passwordForDeletion.css';
import Toast from '../../Toast/Toast';
import { useGoogleLogin } from '@react-oauth/google';
import google from "../../../assets/google.png";
import axios from "axios";



// AH-- pop up to delete Account


const DeleteConGoogle = (props) => {
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");
    
    
    const socialDelete = useGoogleLogin({

      
      onSuccess: async (response) => {
        try {

          //AH-- Get user info from Google API
          const res = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${response.access_token}`,
              },
            }
          );
          console.log(res.data); //AH-- Log user info
          const email = res.data.email;
    
               //AH-- Retrieve JWT token from cookies
               const cookieString = document.cookie.split('; ').find(row => row.startsWith('jwt='));
               if (!cookieString) {
                   console.error('JWT token not found in cookies');
                   showToast("User not logged in", "error");
                   return;
               }
               const token = cookieString.split('=')[1];
               console.log(token)
               try {
                const response = await fetch('http://localhost:8000/api/google_delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email }) 
                });
            
            console.log('User data deleted successfully:', response.data);
            window.location.href = '/login';  //AH-- Redirect to login page after successful deletion
          } catch (error) {
            console.error('Failed to delete user data:', error.response ? error.response.data : error.message);
            showToast("Failed to delete user account", "error");
          }
        } catch (error) {
          console.error('Failed to fetch user info from Google API:', error);
          showToast("Error fetching info from Google", "error");
        }
      },
      onFailure: (error) => {
        console.error('Account Deletion failed:', error);
        showToast("Account Deletion failed", "error");
      },
    });
      

    const showToast = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => {
            setToastMessage("");
            setToastType("");
        }, 3000);
    };

    return props.trigger ? (
        <div className='pass'>
            {toastMessage && (
                <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
            )}
            <div>
                <div className="text">Click below to continue deleting your account</div>
                <button onClick={() => socialDelete()} className="social-btn2"> <img src={google} alt="google" className="google" /><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  Continue with Google</div> </button>
            </div>
            <div>
                    <button className='cancel-button' onClick={() => props.setTrigger(false)}>
                        Cancel
                    </button>
                </div>
        </div>
    ) : null;
};

export default DeleteConGoogle;
