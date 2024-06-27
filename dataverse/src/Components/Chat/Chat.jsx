import React, { useState } from "react";
import "./chat.css";
import logo from "../../assets/logo.png";
import ChatHistory from "./chatHistory/chatHistory.jsx";
import Footer from "../footer-all/footer.jsx";
import ChatArea from "./ChatArea/ChatArea.jsx";
import ProfileImage from "../Profile/profileImage.jsx";

// NSN - Chat component
const Chat = () => {
  // NSN - State to manage the trigger for a new chat
  const [newChatTrigger, setNewChatTrigger] = useState(true);

  // NSN - Function to update the newChatTrigger state
  const setNewChat = (state) => {
    setNewChatTrigger(state);
  };

  // NSN - Render the Chat component
  return (
    <div className="chat"> 
      <div className="header1"> {/* NSN - Header section */}
        <span className="left-header1"> 
          <div className="back-button">..</div> 
          <div className="profile-picture1">
            <ProfileImage firstName="A" lastName="" /> 
          </div>
          <div className="Display-Name1">Aleesha Clerrano</div> 
        </span>
        <span className="right-header1"> 
          <img src={logo} alt="logo" className="logo1" />
        </span>
      </div>
      <div className="main"> {/* NSN - Main content area */}
        <ChatHistory newChatTrigger={newChatTrigger} setNewChat={setNewChat} /> {/* NSN - ChatHistory component */}
        <ChatArea newChatTrigger={newChatTrigger} setNewChat={setNewChat} /> {/* NSN - ChatArea component */}
      </div>
      <Footer /> {/* NSN - Footer component */}
    </div>
  );
};

export default Chat;
