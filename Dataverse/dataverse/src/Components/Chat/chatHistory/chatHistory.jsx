import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./chatHistory.css";
import add from "../../../assets/add.png";
import del from "../../../assets/delete.png";

// NSN - ChatHistory component (sidebar)
const ChatHistory = ({ setNewChat, setMessages }) => {
  // NSN - State variable to store the list of chats
  const [chats, setChats] = useState([]);

  // NSN - useEffect to fetch chats when the component mounts
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // NSN - Fetching chats from the backend API
        const response = await axios.get('http://localhost:8000/api/chats/');
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  // NSN - Function to handle the creation of a new chat
  const handleNewChat = (e) => {
    e.preventDefault();
    setNewChat(true);
  };

  // NSN - Function to handle retrieving a specific chat by its ID
  const handleRetrieveChat = async (chatId) => {
    try {
      // NSN - Fetching the chat data from the backend API
      const response = await axios.get(`http://localhost:8000/api/retrieve_chat/${chatId}/`);
      const chatData = response.data;
      setMessages(chatData.messages.map(msg => ({
        prompt: msg.prompt,
        output: msg.output,
        isBot: msg.output !== "",
      })));
      showToast('Chat retrieved successfully', 'success');
    } catch (error) {
      console.error('Error retrieving chat:', error);
      showToast('Error retrieving chat', 'error');
    }
  };

  // NSN - Function to handle deleting a specific chat by its ID
  const handleDeleteChat = async (chatId) => {
    try {
      // NSN - Deleting the chat from the backend API
      await axios.delete(`http://localhost:8000/api/delete_chat/${chatId}/`);
      setChats(chats.filter(chat => chat.id !== chatId));
      showToast('Chat deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting chat:', error);
      showToast('Error deleting chat', 'error');
    }
  };

  // NSN - Rendering the chat history and new chat button
  return (
    <span className="side-menu">
      <div className="newchat">
        <button id="newchat-button" onClick={handleNewChat}>
          New Chat
          <img src={add} alt="add" />
        </button>
      </div>
      <div className="history">
        <div className="historybox">
          {chats.map(chat => (
            <div key={chat.id} className="past-chat">
              {chat.title}
              <button onClick={() => handleRetrieveChat(chat.id)}>
                Retrieve
              </button>
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
