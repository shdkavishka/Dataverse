import React,{useState} from 'react';
import Toast from '../../Toast/Toast';

const UserCardCollab = ({ user, database_id }) => {
  const fullName = user.name || `${user.firstName} ${user.lastName}`;
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(""); 

  const handleClick = async () => {
    try {
      console.log(database_id.database_id)
      console.log(user.email)
      const response = await fetch('http://localhost:8000/api/invite/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          database_id: database_id.database_id,
          email: user.email,
        }),
      });
      
      
  
      if (!response.ok) {
        
        const errorData = await response.json(); 
        throw new Error(errorData.detail || 'Failed to send invitation.'); 
      }
  
      console.log('Invitation sent successfully!');
      showToast('Invitation sent successfully!',"success")
    } catch (error) {
      console.error('Error sending invitation:', error.message);
      showToast('Error sending invitation',"error") 
     
      console.error('Error object:', error);
      showToast('Error',"error")
    }
  };
    // AH-- for toast
    const showToast = (message, type) => {
      setToastMessage(message);
      setToastType(type);
      setTimeout(() => {
        setToastMessage("");
        setToastType("");
      }, 3000); 
    };
  

  return (
    <div className="user-card" onClick={handleClick}>
      {toastMessage && (
            <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
          )}
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
