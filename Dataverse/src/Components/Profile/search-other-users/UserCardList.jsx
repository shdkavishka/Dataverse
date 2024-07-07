import React from 'react';
import UserCard from './usercard';
import './usercardlist.css';

const UserCardList = ({ users }) => {
  if (!users || users.length === 0) {
    return <div className="user-card-list"><h3 className=''>No Users matched</h3></div>;
  }

  return (
    <div className="user-card-list">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserCardList;
