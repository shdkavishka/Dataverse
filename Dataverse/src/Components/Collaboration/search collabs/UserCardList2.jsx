import React from 'react';
import UserCardCollab from './UserCardCollab';
import './usercardlist2.css';

const UserCardList = ({ users ,database_id}) => {
  if (!users || users.length === 0) {
    return <div className="user-card-list"><h3 className=''>No Users matched</h3></div>;
  }

  return (
    <div className="user-card-list">
      {users.map(user => (
        <UserCardCollab key={user.id} user={user} database_id={database_id}/>
      ))}
    </div>
  );
};


export default UserCardList;
