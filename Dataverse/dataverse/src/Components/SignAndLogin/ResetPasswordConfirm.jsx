import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import "../../App.css";
import "./ResetPassword.css";
import logo from "../../assets/logo2.png";
import { Link } from 'react-router-dom';
import Toast from "../Toast/Toast";
import Footer from "../footer-all/footer"


// AH-- Reset pw confirmation unauthenticated users
const ResetPasswordConfirm = () => {
    const { uidb64, token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState(""); 
    const [isSuccess,setIsSuccess]=useState(false)

    useEffect(() => {
        console.log("UIDB64:", uidb64);
        console.log("Token:", token);
    }, [uidb64, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        //AH-- Check if all fields are filled
        if (!password || !confirmPassword) {
        
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
        // AH-- Make a POST request to confirm password reset, get UID and token from URL
        try {
            const response = await axios.post(`http://localhost:8000/api/reset_password_confirm/${uidb64}/${token}/`, {
                new_password: password,
                confirm_new_password: confirmPassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setIsSuccess(true)
            showToast('Password reset successful', "success");
            
            // AH-- Handle errors
        } catch (error) {
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
                showToast('Unable to connect to the server. Please check your network connection.', "error");
            
            } else {
                showToast('An error occurred. Please try again.', "error");
            }
        
        }
    };

    const showToast = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => {
          setToastMessage("");
          setToastType("");
        }, 3000); 
      };
      

    return (
        <div>
            <Link className='link2' to="/Home">Home</Link>
            {toastMessage && (
            <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
          )}
            <img
                src={logo}
                alt="logo-login"
                className="logo-login"
            />
           {isSuccess?(<>
                        <div className='openText2'>Login to your account</div>
                       <Link to="/Login">
            <button className="login-btn2">Login</button>
          </Link>
          </>):

                
                    (<>
                        <div className='openText'>Reset Your Password</div>
                        <div className='cont'>
                            <p className='x'> </p>
                            <form className="Reset-form" onSubmit={handleSubmit}>
                                <input
                                    placeholder="New Password"
                                    className="input2"
                                    type={passwordVisibility ? "" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <br />
                                <input
                                    placeholder="Confirm Password"
                                    className="input2"
                                    type={passwordVisibility ? "" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <br />
                                <div className='passwordVisibility' onClick={() => setPasswordVisibility(!passwordVisibility)}>
                                    {passwordVisibility ? (<p>Hide Password <EyeInvisibleOutlined /></p>) : (<p>Show Password <EyeOutlined /></p>)}
                                </div>
                                <button type="submit" className="continue-btn">Reset Password</button>
                            </form> </div></> )}
                
               
           
            <Footer/>
        </div>
    );
};

export default ResetPasswordConfirm;
