import React, { useState } from 'react';
import "../../App.css";
import "./ResetPassword.css";
import { useNavigate, Link } from 'react-router-dom';
import logo from "../../assets/logo2.png";
import axios from 'axios';
import Toast from "../Toast/Toast";
import Footer from "../footer-all/footer"


// AH-- reset pw-unauthenticated user
const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");

    const [email, setEmail] = useState('');
    const Navigate = useNavigate();

    // AH-- get email and set value from input
    const handleChange = (e) => {
        setEmail(e.target.value);
    };


    // AH-- Handle form submission for password reset
    // AH-- send button
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); 
        //AH-- Start loading state
        try {
            // AH-- Make a POST request to the password reset API
            const response = await axios.post('http://localhost:8000/api/reset_password/', {
                email: email
            });

            console.log(response.data);
            if (response.status === 200) {
                showToast('Password reset email has been sent.', "success");
            } else if (response.status === 400 && response.data.message === "Invalid token or user not found.") {
                showToast('User not found. Please check your email address.', "error");
            }
             else {

                showToast('Failed to reset password. Please try again.', "error");
                
            }
        } catch (error) {
            console.error('An error occurred:', error);
            showToast('Failed to reset password. Please try again.', "error");
        } finally {
            setIsLoading(false); 
            //AH-- Stop loading state
        }
    };

    // AH-- Show toast
    const showToast = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => {
          setToastMessage("");
          setToastType("");
        }, 3000);
      };

    return (
        <div className='Reset'>
       
            <button onClick={() => Navigate(-1)}>Back</button>
            {toastMessage && (
            <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
          )}
            <img
                src={logo}
                alt="logo-login"
                className="logo-login"
            />
            <div className='openText'>Reset Password</div>
            <div className='cont'>
                <p className='x'>Enter your registered E-mail address</p>
                <form className="Reset-form" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="email"
                            className="input2"
                            placeholder="E-mail"
                            name="email"
                            onChange={handleChange}
                            value={email}
                            required
                        />
                    </div>
                
                    <button type="submit" className="continue-btn" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send"}
                    </button>
                </form>
            </div>
            <Footer/>
        </div>
    );
};

export default ResetPassword;
