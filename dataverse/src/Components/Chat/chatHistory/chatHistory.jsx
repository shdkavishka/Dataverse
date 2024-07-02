import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./chatHistory.css";
import add from "../../../assets/add.png";
import del from "../../../assets/delete.png";
import Toast from "../../Toast/Toast";

const ChatHistory = ({  newChatTrigger, setNewChat, databaseId ,mess,setMess ,view,setView}) => {
  const [chats, setChats] = useState([]);
  const [id, setId] = useState(1); // State to store the ID for the request
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
 

  const fetchChats = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/pastchats/', { id });
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    fetchChats();

    const intervalId = setInterval(fetchChats, 1000);
    
    // Cleanup function to clear the interval when the component is unmounted or id changes
    return () => clearInterval(intervalId);
  }, [id]);

  const handleNewChat = () => {
    setNewChat(true);
    setView(false);
    setMessages([
      {
        prompt: "Hi, I'm dataVerse, what can I visualize for you today?",
        output: "",
        isBot: true,
      },
    ]);
  };


  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete_chat/${chatId}/`);
      // Refetch chats after successful deletion
      fetchChats();
      showToast("Chat deletion successful","success")
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleViewChat = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/chat/${chatId}/`);
      const { messages } = response.data;
      console.log(response.data)
      setView(true)

      // Transform messages into the desired format
      const newMessages = messages.flatMap(msg => ([
        {
          prompt: msg.prompt,
          output: "",
          isBot: false
        },
        {
          prompt: "",
          output: `Query: ${msg.query}\nResult: ${msg.result}`,
          isBot: true
        }
      ]));

      // Set messages state with the transformed data
      setMess(newMessages)
      console.log(newMessages)
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

    // NSN - Function to show a toast message
    const showToast = (message, type) => {
      setToastMessage(message);
      setToastType(type);
      setTimeout(() => {
        setToastMessage("");
        setToastType("");
      }, 3000);
    };

  return (
    <span className="side-menu">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
      )}

      <div className="newchat">
        <button id="newchat-button" onClick={handleNewChat}>
          New Chat
          <img src={add} alt="add" />
        </button>
      </div>
      <div className="history">
        <div className="historybox">
          {chats.map(chat => (
           
            <div key={chat.id} className="past-chat"  >
              <button onClick={() => handleViewChat(chat.id)}>{chat.title}</button>
              <button onClick={() => handleDeleteChat(chat.id)}>
                <img src={del} alt="delete" />
              </button>
            </div>
            
          ))}
        </div>
      </div>
    </span>
  );
};

export default ChatHistory;
