// ProfileOther.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './profile.css';
import Toast from '../Toast/Toast';
import Header from '../header-all/Header1';
import Footer from '../footer-all/footer';
import { Link } from 'react-router-dom';

const ProfileOther = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}/`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setToastMessage('Error fetching user data');
        setToastType('error');
      }
    };

    getUser();
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const coverImageStyle = user.coverPic ? { backgroundImage: `url(http://localhost:8000${user.coverPicture})` } : {};
  const imageUrl = `http://localhost:8000${user.profilePicture}`;

  return (
    <>
      <div className="profile">
        {toastMessage && (
          <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
        )}

        <Header/>
     
        <div className="profile-bottom2">
          <div className="profile-card" style={coverImageStyle}>
            <div className="card-bottom2">
              <img src={imageUrl} id="profilePicture" className="profilePicture" alt="Profile" />

              <div className="card-fn">{user.firstName || user.name}</div>
              <div className="card-ln">{user.lastName}</div>
              <hr />
              <div className="card-un">@{user.name}</div>
            
            </div>
          </div>

          <div className="profile-content">
          <form className="profile-details" >
            <div className="details-section2">
              <section className="Title-text2">{user.firstName || user.name}'s Profile</section>

              <div className="First-name card">
                <span className="label4">First Name:</span>
                <span className="data4">{user.firstName}</span>
              </div>
              <div className="Last-Name card">
                <span className="label4">Last Name:</span>
                <span className="data4">{user.lastName}</span>
              </div>
              <div className="Email card">
                <span className="label4">E-mail:</span>
                <span className="data4">{user.email}</span>
              </div>
              <div className="Bio card">
                <span className="label4">Bio:</span>
                <span className="data4">{user.bio}</span>
              </div>
              <div className="Username card">
                <span className="label4">UserName:</span>
                <span className="data4">@{user.name}</span>
              </div>
              <div className="Gender card">
                <span className="label4">Gender:</span>
                <span className="data4">{user.gender}</span>
              </div>
              <div className="Location card">
                <span className="label4">Location:</span>
                <span className="data4">{user.location}</span>
              </div>
            </div>
            <div>
                <Link className="save-button20" to={`/saved-charts/${userId}`}>
                  View {user.firstName || user.name}'s Saved Charts
                </Link>
              </div>
            </form>
        
          </div>
         
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ProfileOther;
