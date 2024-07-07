import React, { useState, useEffect, useRef } from "react";
import dropdown from "../../assets/drop.png";
import './Header1.css'
import logo from "../../assets/logo.png";
import logoname from  "../../assets/dataverse.png";
import { Link } from 'react-router-dom';
import { handleLogout } from "../Logout/Logout";
import Searchbar from "../Profile/search-other-users/searchbar";


//AH-- header 
const Header = (props) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [first_Name, setFirstName] = useState("");
  const [last_Name, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  //AH-- fetch user data
  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const profileData = await response.json();
      // AH-- Set extracted user data to state variables
     
      setFirstName(profileData.firstName);
      setLastName(profileData.lastName);
      setUserName(profileData.name);
      setProfilePic(profileData.profilePicture);
    } catch (error) {
      console.error("Error fetching user data:", error);
  
    }
  };



  const dropdownRef = useRef(null);
  useEffect(() => {
    fetchUserData();
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
//AH-- for profilePic
  const ImageUrl = `http://localhost:8000${profilePic}`;
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

      <Searchbar/>
      <span className="right-header">

      <div className="Display-Name">
          <div>{first_Name || userName}</div>
          <div>{last_Name}</div>
        </div>
        <div className="profile-picture">
        <img src={ImageUrl} className="dp-header"/>
        </div>
       
       
      </span>
    </div>
  );
}

export default Header;
