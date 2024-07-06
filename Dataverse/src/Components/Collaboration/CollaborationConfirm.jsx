import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../footer-all/footer';
import logo from "../../assets/logo.png";
import axios from 'axios';
import Toast from '../Toast/Toast';

const CollaborationConfirm = () => {
  const { db_id, user_id, sender_id } = useParams();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${sender_id}/`);
        setUser(response.data);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
        showToast("Error fetching user data", "error");
      }
    };

    fetchUserData();
  }, [sender_id]);

  const handleConfirmCollaboration = async () => {
    const data = {
      database_id: db_id,
      user_id: user_id
    };

    try {
      const response = await fetch('http://localhost:8000/api/confirm-collaboration/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(data)
      });

      if (response.ok) {
        showToast('Collaboration confirmed successfully', 'success');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        showToast('Error confirming collaboration', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error confirming collaboration', 'error');
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
      <Link className="link2" to="/Home">
        Home
      </Link>
      <div className="proflogin">
        <img src={logo} alt="logo-login" className="logo-login2" />
        <p className="opentext">Do you want to collaborate as a viewer for {email}'s database?</p>
        <button className="login-btn" onClick={handleConfirmCollaboration}>
          collaborate
        </button>
      </div>
      <Footer />
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
}

export default CollaborationConfirm;
