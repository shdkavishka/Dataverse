import React, { useState, useEffect, useRef } from "react";
import dropdown from "../../assets/drop.png";
import './Header1.css'
import ProfileImage from '../Profile/profileImage'
import logo from "../../assets/logo.png";
import logoname from  "../../assets/dataverse.png";
import { Link } from 'react-router-dom';
import { handleLogout } from "../Logout/Logout";


//AH-- header 
const Header = (props) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  //AH-- Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      //AH-- Cleanup event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //AH-- Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="header">
      <span className="left-header">
      <div>
      <div
          ref={dropdownRef}
          id="dropdownContent"
          className={`dropdown-content ${dropdownVisible ? "show" : ""}`}
        >
          <Link to="/Dashboard">DashBoard</Link>
          <Link to="/Login" onClick={handleLogout}>
            Logout
          </Link>
        </div>
        <button onClick={toggleDropdown}> 
          <img src={dropdown} alt="dropdown" />
        </button>
          <img src={logo} alt="logo" className="logoo" />
        </div>
        <div>
        <img src={logoname} alt="logo" className="logoo" />
        </div>
       
      </span>
      <span className="right-header">

      <div className="Display-Name">
          <div>{props.firstName}</div>
          <div>{props.lastName}</div>
        </div>
        <div className="profile-picture">
          <ProfileImage
            firstName={props.firstName || props.userName}
            lastName={props.lastName}
          />
        </div>
       
       
      </span>
    </div>
  );
}

export default Header;
