import React from 'react';
import './ProfileImage.css'; 

// AH-- Function to generate a color based on string
export function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ("00" + value.toString(16)).substr(-2);
    }
  
    return color;
  }
  

const ProfileImage = ({ firstName = '', lastName = '' }) => {
  //AH-- Extract the first letters of the first and last name
  const initials = `${firstName[0]?.toUpperCase() ?? ''}${lastName[0]?.toUpperCase() ?? ''}`;

  //AH-- Generate a dynamic background color based on the full name
  const fullName = `${firstName} ${lastName}`;
  const backgroundColor = stringToColor(fullName);

  return (
    <div className="profile-image" style={{ backgroundColor }}>
      {initials}
    </div>
  );
};

export default ProfileImage;
