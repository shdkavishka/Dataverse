import React from 'react';

const UserCardCollab = ({ user, database_id }) => {
  const fullName = user.name || `${user.firstName} ${user.lastName}`;

  const handleClick = async () => {
    try {
      console.log(database_id)
      console.log(user.email)
      const response = await fetch('http://localhost:8000/api/invite/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          database_id: database_id,
          email: user.email,
        }),
      });
      
  
      if (!response.ok) {
        // This handles non-200 HTTP responses
        const errorData = await response.json(); // Parse the response body as JSON
        throw new Error(errorData.detail || 'Failed to send invitation.'); // Use errorData.detail if available
      }
  
      console.log('Invitation sent successfully!');
    } catch (error) {
      console.error('Error sending invitation:', error.message); // Log the error message
      // Optionally, you can log the full error object for more details:
      console.error('Error object:', error);
    }
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

export default UserCardCollab;
