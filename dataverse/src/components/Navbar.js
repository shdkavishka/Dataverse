import React from 'react';
import logoImage from  './images/logo.png';
import userProfileImage from './images/profile-img.jpg';
import './styles.css';

const Navbar = ({ dbName = 'MyDB'}) => {
  return (
    <nav className="navbar">
      <div className="logo">
        {/* Use the imported logoImage */}
        <img src={logoImage} alt="Logo" />
      </div>
      <div>
      <div className="user-profile">
      <img src = {userProfileImage} alt='sahla' />
      </div> <br></br>
      <div className="database-name">{dbName}</div>  
      </div>  
    </nav>
  );
};

export default Navbar;



