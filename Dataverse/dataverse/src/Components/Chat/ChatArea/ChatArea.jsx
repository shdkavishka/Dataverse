import React, { useState, useEffect } from 'react';
import axios from 'axios';
import profile from "../../../assets/profile.jpg";
import bot from "../../../assets/bot.jpg";
import send from "../../../assets/send.png";
import mic from "../../../assets/microphone.png";
import VoiceToText from '../VoiceToText/VoiceToText.jsx';
import Toast from "../../Toast/Toast";
import Feedback from '../../Feedback/Feedback.jsx';
import "./ChatArea.css";

// NSN - Constant for the maximum number of messages allowed in a chat
const MAX_MESSAGES = 20;

// NSN - ChatArea component 
const ChatArea = ({ newChatTrigger, setNewChat, databaseId }) => {
  // NSN - State variables for managing various aspects of the chat
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [voice, setVoice] = useState(false);
  const [messages, setMessages] = useState([
    {
      prompt: "Hi, I'm dataVerse, what can I visualize for you today?",
      output: "",
      isBot: true,
    },
  ]);
  const [limitReached, setLimitReached] = useState(false);

  // NSN - useEffect to handle new chat initialization
  useEffect(() => {
    if (newChatTrigger) {
      // NSN - Check if there are messages to save
      if (messages.length > 1) {
        // NSN - Confirm with the user before starting a new chat
        if (!window.confirm("Are you sure you want to start a new chat? Unsaved messages will be lost.")) {
          return; // NSN - Cancel starting new chat if user cancels
        }
        saveChat(); // NSN - Save the current chat before starting a new one
      }
      // NSN - Initialize the new chat
      setMessages([
        {
          prompt: "Hi, I'm dataVerse, what can I visualize for you today?",
          output: "",
          isBot: true,
        },
      ]);
      setLimitReached(false); // NSN - Reset the limit reached state
      setNewChat(false); // NSN - Reset the new chat trigger
    }
  }, [newChatTrigger, setNewChat]);

  // NSN - Function to handle sending a message
  const handleSend = async () => {
    if (userPrompt.trim() === "") {
      showToast("You can't send empty messages", "error");
      return;
    }

    if (messages.length >= MAX_MESSAGES) {
      setLimitReached(true);
      showToast("Message limit reached. Start a new chat.", "error");
      return;
    }

    setIsLoading(true);
    try {
      // NSN - Send the user's prompt to the backend API
      const response = await axios.post("http://localhost:8000/api/generate_sql_query/", {
        db_user: "root",
        db_password: "",
        db_host: "localhost",
        db_name: "newDB",
        prompt: userPrompt,
      });

      // NSN - Update the messages state with the new user and bot messages
      const newMessages = [
        ...messages,
        { prompt: userPrompt, output: "", isBot: false },
        { prompt: "", output: `Query: ${response.data.query}\nResult: ${response.data.result}`, isBot: true }
      ];

      setMessages(newMessages);
      setUserPrompt("");

      // NSN - Check if the message limit has been reached
      if (newMessages.length >= MAX_MESSAGES) {
        setLimitReached(true);
      }
      //NSN - error handling
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = `Error sending message: ${error.message}`;
      const newMessages = [
        ...messages,
        { prompt: userPrompt, output: "", isBot: false },
        { prompt: "", output: errorMessage, isBot: true },
      ];

      setMessages(newMessages);
      setUserPrompt("");

      if (newMessages.length >= MAX_MESSAGES) {
        setLimitReached(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // NSN - Function to handle the Enter key press for sending messages
  const handleEnter = (e) => {
    if (e.key === "Enter") handleSend();
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

  // NSN - Function to handle the microphone button click
  const handleMicClick = () => {
    setVoice(true);
  };

  // NSN - Function to handle the voice input and set it as the user prompt
  const handleVoicePrompt = (transcript) => {
    setUserPrompt(transcript);
  };

  // NSN - Function to save the current chat
  const saveChat = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/save_chat/', {
        database: databaseId,
        title: `Chat ${new Date().toISOString()}`, // Generate a title automatically
        messages: messages.map(msg => ({ prompt: msg.prompt, output: msg.output }))
      });
      showToast('Chat saved successfully', 'success');
    } catch (error) {
      console.error('Error saving chat:', error);
      showToast('Error saving chat', 'error');
    }
  };

  // NSN - Render the chat area component
  return (
    <span className="chat-area">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
      )}

      <VoiceToText 
        trigger={voice} 
        setTrigger={setVoice} 
        setVoicePrompt={handleVoicePrompt} 
        showToast={showToast} 
      />

      <div className="chat-section">
        <div className="chats">
        {messages.map((message, i) => {
            const question = i > 0 && !messages[i - 1].isBot ? messages[i - 1].prompt : "";
            const answer = message.isBot ? message.output : "";

            return (
              <div key={i} className={message.isBot ? "QandA bot" : "QandA"}>
                <img src={message.isBot ? bot : profile} alt="dp" />
                <div>
                  {message.prompt}
                  {message.output}
                  {message.isBot && i > 0 && (
                    <Feedback question={question} answer={answer} /> // Here I Using Feedback component
                  )}
                </div>
              </div>
            );
          })}
          {limitReached && (
            <>
              <div className="limit-message">
                Message limit reached. Please start a new chat.
              </div>
            </>
          )}
        </div>
      
        <div className="input-box">
          <input
            id="prompt"
            placeholder="Ask a question"
            value={userPrompt}
            onKeyDown={handleEnter}
            onChange={(e) => setUserPrompt(e.target.value)}
            disabled={isLoading || limitReached}
          />
          <button className='send-button' onClick={handleSend} disabled={isLoading || limitReached}>
            <img src={send} alt="send" />
          </button>
          <button className='mic-button' onClick={handleMicClick} disabled={limitReached}>
            <img src={mic} alt="mic" />
          </button>
          <button className='new-chat-button' onClick={() => setNewChat(true)} disabled={isLoading || limitReached}>
            New Chat
          </button>
        </div>
      </div>
    </span>
  );
};

export default ChatArea;
