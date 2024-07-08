import React from 'react';
import UserCard from './usercard';
import './usercardlist.css';

const UserCardList = ({ users ,onClose}) => {
  if (!users || users.length === 0) {
    
    return <div className="user-card-list5"><div className='close-collab' onClick={onClose}>x</div><h3 className=''>No collaborators</h3></div>;
  }

  return (
    <div className="user-card-list5">
        <div className='close-collab' onClick={onClose}>x</div>
      <h3 className='collab-text'>Collaborators</h3>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserCardList;
