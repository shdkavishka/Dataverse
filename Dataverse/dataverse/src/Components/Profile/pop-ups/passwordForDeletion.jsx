import React, { useState } from "react";
import './passwordForDeletion.css';
import Toast from '../../Toast/Toast';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';


// AH-- pop up to delete Account


const DeleteConf = (props) => {
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [password, setPassword] = useState("");  

    // AH-- Handle deletion of the account
    // AH-- Confirm button
    const handleDelete = async () => {
        //AH-- Retrieve JWT token from cookies
        const cookieString = document.cookie.split('; ').find(row => row.startsWith('jwt='));
        if (!cookieString) {
            console.error('JWT token not found in cookies');
            return;
        }
        const token = cookieString.split('=')[1];

        //AH- Send DELETE request to server endpoint with password for confirmation
        try {
            const response = await fetch('http://localhost:8000/api/delete-account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({ password }) 
            });

            if (response.ok) {
                //AH-- Account deletion successful
                props.setTrigger(false);
                showToast('Account deletion successful', "success");
                window.location.href = '/login';
            } else {
                const data = await response.json();
                showToast(data.error || 'Failed to delete account', "error");
            }
        } catch (error) {
            console.error('Error occurred while deleting account:', error);
            showToast('Error occurred while deleting account', "error");
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

    return props.trigger ? (
        <div className='pass'>
            {toastMessage && (
                <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
            )}
            <div>
                <div className="text">Enter your password</div>
                <input
                    placeholder="Password"
                    className="input4"
                    type={passwordVisibility ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className='passwordVisibility2' onClick={() => setPasswordVisibility(!passwordVisibility)}>
                    {passwordVisibility ? (<p>Hide Password <EyeInvisibleOutlined /></p>) : (<p>Show Password <EyeOutlined /></p>)}
                </div>
                <div>
                    <button type='submit' className='save-button' onClick={handleDelete}>
                        Confirm
                    </button>
                </div>
                <div>
                    <button className='cancel-button' onClick={() => props.setTrigger(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default DeleteConf;
