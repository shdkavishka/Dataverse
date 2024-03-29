// Header.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import dropdown from "../../assets/drop.png";
import user from "../../assets/user.png";
import logo from "../../assets/logo.png";
import a from "../../assets/a.png";
import b from "../../assets/b.png";
import c from "../../assets/c.png";

const Header = () => {
  const navigate = useNavigate();
  // State to toggle dropdown visibility
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

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
          <Link to="/UserPage">Edit User </Link>
          <Link to="/UserPage">View User </Link>
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
          <img src={user} alt="User Icon" />
        </button>
      </div>
      <div className="right"></div>
    </div>
  );
};

export default Header;
