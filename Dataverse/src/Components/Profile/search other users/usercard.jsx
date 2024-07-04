import React from 'react';
import { useNavigate } from 'react-router-dom';
import './usercard.css';

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  const fullName = user.name || `${user.firstName} ${user.lastName}`;

  const handleClick = () => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <div className="user-card" onClick={handleClick}>
      <div className="user-image">
        <img src={`http://localhost:8000${user.profilePicture}`} alt={`${fullName}'s profile`} />
      </div>
      <div className="user-info">
        <h2>{fullName}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;
