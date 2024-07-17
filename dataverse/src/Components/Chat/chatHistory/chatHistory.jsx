import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./chatHistory.css";
import add from "../../../assets/add.png";
import del from "../../../assets/delete.png";
import Toast from "../../Toast/Toast";
import reset from "../../../assets/reset.png";

const ChatHistory = ({ newChatTrigger, setNewChat, database_id, mess, setMess, view, setView, nowViewing, setNowViewing }) => {
  const [chats, setChats] = useState([]);
  const [id, setId] = useState(database_id);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  const fetchChats = async () => {
    try {
      console.log('Fetching chats with ID:', id);
      const response = await axios.post('http://localhost:8000/api/pastchats/', { database_id:id });
      console.log('Response data:', response.data); 
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error.response ? error.response.data : error.message); // Log detailed error
      showToast("Error fetching chats", "error");
    }
  };

  useEffect(() => {
    fetchChats();
  }, [id]);

  const handleNewChat = () => {
    setNewChat(true);
    setView(false);
    setMess([
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
      fetchChats();
      showToast("Chat deletion successful", "success");
    } catch (error) {
      console.error('Error deleting chat:', error);
      showToast("Error deleting chat", "error");
    }
  };

  const handleViewChat = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/chat/${chatId}/`);
      const { messages } = response.data;
      setView(true);
      setNowViewing(chatId);

      const newMessages = messages.flatMap(msg => ([
        {
          prompt: msg.prompt,
          output: "",
          isBot: false,
        },
        {
          prompt: "",
          output: `Query: ${msg.query}\nResult: ${msg.result}`,
          isBot: true,
        },
      ]));

      setMess(newMessages);
    } catch (error) {
      console.error('Error fetching chat:', error);
      showToast("Error fetching chat", "error");
    }
  };

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
        <button onClick={fetchChats} className="refresh">
          <img src={reset} className="chat-reset" alt="refresh" /> Refresh
        </button>
        <div className="historybox">
          {chats.slice().reverse().map(chat => (
            <div key={chat.id} className="past-chat">
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
