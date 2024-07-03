// Header.js
import React, { useState ,useEffect,useRef} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import dropdown from "../../assets/drop.png";
import logo from "../../assets/logo.png";
import a from "../../assets/a.png";
import b from "../../assets/b.png";
import c from "../../assets/c.png";
import { handleLogout } from "../Logout/Logout";  // AH-- to handle logout

const Header = () => {

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
      setProfilePic(profileData.profilePicture);
    } catch (error) {
      console.error("Error fetching user data:", error);

    }
  };



  const navigate = useNavigate();
  // State to toggle dropdown visibility
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
      <div className="left">
        {/* Dropdown content */}
        <button onClick={toggleDropdown}>
          <img src={dropdown} alt="dropdown" />
        </button>
        <div
          id="dropdownContent"
          className={`dropdown-content ${dropdownVisible ? "show" : ""}`}
        >
          <Link to="/Profile">Edit User </Link>
          <Link to="/Profile">View User </Link>
          <Link to="/Login" onClick={handleLogout}>Logout </Link>  {/* AH-- to logout and redirect to login page */}
        </div>
        <img src={logo} alt="" style={{ width: "50px", height: "50px" }} />
        <span>DataVerse</span>
        {/* Dropdown button */}
      </div>
      <div className="center">
        {/* Search box */}
        <input type="text" placeholder="Search" />
        {/* Buttons */}
        <button>
          <img src={a} alt="" />
        </button>
        <button>
          {" "}
          <img src={b} alt="" />
        </button>
        <button>
          <img src={c} alt="" />
        </button>
        {/* Clickable icon */}
        <button onClick={() => navigate("/profile")}>
          <img src={ImageUrl} alt="User Icon" className="user-icon" />
        </button>
      </div>
      <div className="right"></div>
    </div>
  );
};

export default Header;
