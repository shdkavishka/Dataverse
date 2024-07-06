import React, { useState, useEffect ,useRef} from "react";
import "./chat.css";
import logo from "../../assets/logo.png";
import ChatHistory from "./chatHistory/chatHistory.jsx";
import Footer from "../footer-all/footer.jsx";
import ChatArea from "./ChatArea/ChatArea.jsx";
import dropdown from "../../assets/drop.png";
import { Link, useParams } from "react-router-dom";
import { handleLogout } from "../Logout/Logout";  // AH-- to handle logout

// NSN - Chat component

const Chat = () => {
  const {database_id}=useParams();
  const [email, setEmail] = useState("");
  const [first_Name, setFirstName] = useState("");
  const [last_Name, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [nowViewing, setNowViewing] = useState("");
  const dropdownRef = useRef(null);


  //AH --to fetch data of user
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
      setEmail(profileData.email);
      setFirstName(profileData.firstName);
      setLastName(profileData.lastName);
      setUserName(profileData.name);
      setProfilePic(profileData.profilePicture);
    } catch (error) {
      console.error("Error fetching user data:", error);
      showToast("Error fetching user data:", "error");
    }
  };
//AH-- To keep fetching
  
useEffect(() => {
  
  fetchUserData();
  const intervalId = setInterval(fetchUserData, 500);

 
  const handleClickOutside = (event) => {
    
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
      
    }
     
  return () => {
    clearInterval(intervalId);
  }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
   
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

//AH-- Function to toggle dropdown visibility
const toggleDropdown = () => {
  setDropdownVisible(!dropdownVisible);
};
  // NSN - State to manage the trigger for a new chat

  const [newChatTrigger, setNewChatTrigger] = useState(true);
  const [mess,setMess]=useState([])
  const [view,setView]=useState(false)
  

  // NSN - Function to update the newChatTrigger state
  const setNewChat = (state) => {
    setNewChatTrigger(state);
  };
   //AH-- profile pic url
 const ImageUrl = `http://localhost:8000${profilePic}`;

  return (
    <>{
      email?( <div className="chat"> 
        <div className="header1"> {/* NSN - Header section */}
          <span className="left-header1"> 
            <div className="back-button">  <button onClick={toggleDropdown}>
            <img src={dropdown} alt="dropdown" />
          </button>
          <div
            id="dropdownContent"
            className={`dropdown-content3 ${dropdownVisible ? "show" : ""}`}
          >
            <Link to="/Profile">User Profile</Link>
            <Link to="/Login" onClick={handleLogout}>Logout </Link>  {/* AH-- to logout and redirect to login page */}
          </div></div> 
            <div className="profile-picture1">
            <Link to="/Profile"><img src={ImageUrl} className="dp-chat"/></Link>
            
            </div>
            <div className="Display-Name1">{first_Name || userName}&nbsp; {last_Name}</div> 
          </span>
          <span className="right-header1"> 
            <img src={logo} alt="logo" className="logo1" />
          </span>
        </div>
        <div className="main"> {/* NSN - Main content area */}
        <ChatHistory newChatTrigger={newChatTrigger} setNewChat={setNewChat} databaseId={database_id} mess={mess} setMess={setMess} view={ view} setView={setView} nowViewing={nowViewing} setNowViewing={setNowViewing}/> 
        <ChatArea newChatTrigger={newChatTrigger} setNewChat={setNewChat} databaseId={database_id}  mess={mess} setMess={setMess} view={ view} setView={setView} nowViewing={nowViewing} setNowViewing={setNowViewing} ImageUrl={ImageUrl}/>
        </div>
        <Footer /> {/* NSN - Footer component */}
      </div>):(
        <div>
          <Link className="link2" to="/Home">
            Home
          </Link>
          <div className="proflogin">
            <img src={logo} alt="logo-login" className="logo-login2" />
            <p className="opentext">You are not logged in</p>
            <Link to="/Login">
              <button className="login-btn">Login</button>
            </Link>
          </div>
          <Footer />
        </div>
      )
    }
    </>
   
  );
};

export default Chat;
