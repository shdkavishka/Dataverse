import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCardList from "./UserCardList"

const ViewCollab = ({ database_id ,onClose}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/users-collabs/', {
          database_id: database_id
        }, {
          withCredentials: true
        });
        setUsers(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [database_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (

    <div className=''>
      
      <UserCardList users={users} onClose={onClose} />
    </div>
  );
};

export default ViewCollab;
