import React from "react";
import "./chat.css";
import profile from "../assets/profile.jpg";
import bot from "../assets/bot.jpg";
import send from "../assets/send-icon.png";
import add from "../assets/add.png";
import del from "../assets/delete.png";
import {useState} from "react";

const Chat = () => {

  const [prompt,setPrompt]=useState("");
  const [message,setMessage]=useState([
    {
      text: "Hi, Im dataVerse, what can I visualise for you today?",
      isBot: true,
    }
  
  ]);
  const handleSend=()=>{

    const text = prompt;
   setPrompt ('');
 setMessage([...message,
       {text, isBot:false}
      ])
   setMessage([...message,
  {text,isBot: false},
  {text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  isBot: true}
])}
const handleEnter =(e) => {
  if (e.key === 'Enter')handleSend();
  }



  return (
    <div className="chat">
      <div className="header">
        <span className="left-header">
          <div className="back-button">..</div>
          <div className="profile-picture">
            <img src={profile} alt="profile-pic"></img>
          </div>
          <div className="Display-Name">Aleesha Clerrano</div>
        </span>
        <span className="right-header">
          <img
            src={process.env.PUBLIC_URL + "/assets/logo.png"}
            alt="logo"
            className="logo"
          />
        </span>
      </div>
      <div className="main">
        <span className="side-menu">
          <div className="newchat">
            <button id="newchat-button">New Chat<img src={add} alt="add"></img></button>
          </div>
          <div className="history">
          <div className="historybox">
            
            <div className="past-chat">chat 1<button><img src={del} alt="delete"></img></button></div>
            <div className="past-chat">chat 2<button><img src={del} alt="delete"></img></button></div>
            <div className="past-chat">chat 3<button><img src={del} alt="delete"></img></button></div>
           
          </div>
          </div>
        </span>

        <span className="chat-area">
            <div className="chat-section">
          <div className="chats">

           
             {message.map((message,i)=>(
              <div key={i} className={message.isBot ?"QandA bot":"QandA"}><img src={message.isBot?bot:profile} alt="dp"></img><div>{message.text}</div></div>
              
             ))}
          </div>
          <div className="input-box">
            <input id="prompt" placeholder="Ask a question" value={prompt} onKeyDown={handleEnter} onChange={(e)=> setPrompt (e.target.value)}></input>
            <button onClick={() => handleSend()}><img src={send} alt="send" /></button>

          </div>
          </div>
        </span>
      </div>
      <div className="footer">@divergent</div>
    </div>
  );
};

export default Chat;
