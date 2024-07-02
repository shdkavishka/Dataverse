import React, { useState, useEffect } from "react";
import "./chat.css";
import logo from "../../assets/logo.png";
import ChatHistory from "./chatHistory/chatHistory.jsx";
import Footer from "../footer-all/footer.jsx";
import ChatArea from "./ChatArea/ChatArea.jsx";
import ProfileImage from "../Profile/profileImage.jsx";


// NSN - Chat component

const Chat = () => {
  const [first_Name, setFirstName] = useState("");
  const [last_Name, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");

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
  
    return () => {
      clearInterval(intervalId);
    };
  }, []); 
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
  // NSN - Render the Chat component
  return (
    <div className="chat"> 
      <div className="header1"> {/* NSN - Header section */}
        <span className="left-header1"> 
          <div className="back-button">..</div> 
          <div className="profile-picture1">
          <img src={ImageUrl} className="dp-chat"/>
            <ProfileImage firstName="A" lastName="" /> 
          </div>
          <div className="Display-Name1">{first_Name || userName}&nbsp; {last_Name}</div> 
        </span>
        <span className="right-header1"> 
          <img src={logo} alt="logo" className="logo1" />
        </span>
      </div>
      <div className="main"> {/* NSN - Main content area */}
        <ChatHistory newChatTrigger={newChatTrigger} setNewChat={setNewChat} databaseId='1' mess={mess} setMess={setMess} view={ view} setView={setView}/> 
        <ChatArea newChatTrigger={newChatTrigger} setNewChat={setNewChat} databaseId='1'  mess={mess} setMess={setMess} view={ view} setView={setView} /> {/* NSN - ChatArea component */}
      </div>
      <Footer /> {/* NSN - Footer component */}
    </div>
  );
};

export default Chat;
