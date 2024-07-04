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
import ChartPage from '../../Visualization/ChartPage.jsx';
// NSN - Constant for the maximum number of messages allowed in a chat
const MAX_MESSAGES = 21;

// NSN - ChatArea component 
const ChatArea = ({ newChatTrigger, setNewChat, databaseId ,mess,setMess,view,setView}) => {

  // NSN - State variables for managing various aspects of the chat
  const database=databaseId;
  const [userPrompt, setUserPrompt] = useState("");
  const [query,setQuery] =useState("SELECT p.Name AS PublisherName, SUM(s.TotalAmount) AS TotalSales FROM Publishers p JOIN Books b ON p.PublisherID = b.PublisherID JOIN Sales s ON b.BookID = s.BookID GROUP BY p.PublisherID ORDER BY TotalSales DESC;");
  const [result,setResult] =useState("No result");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [voice, setVoice] = useState(false);
  const [visualisation, setVisualisation] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [messages, setMessages] = useState([
    {
      prompt: "Hi, I'm dataVerse, what can I visualize for you today?",
      output: "",
      isBot: true,
    },
  ]);
  const [limitReached, setLimitReached] = useState(false);

  const handleChartData = (base64Image) => {
    setChartData(base64Image);
  };

  // NSN - useEffect to handle new chat initialization
  useEffect(() => {
    if (newChatTrigger) {
      if (messages.length > 1) {
        if (!window.confirm("Are you sure you want to start a new chat? Unsaved messages will be lost.")) {
          return;
        }
        if(!view){
          saveChat();
        }
       
      }
      setMessages([
        {
          prompt: "Hi, I'm dataVerse, what can I visualize for you today?",
          output: "",
          isBot: true,
        },
      ]);
      setLimitReached(false);
      setNewChat(false);
    }
    if (view){
       setMessages(mess)
    }
  }, [newChatTrigger, setNewChat,mess,setMessages,view,setView]);

  


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
        db_name: "dataset",
        prompt: userPrompt,
      });
      setQuery(response.data.query)
      setResult(response.data.result)
      // NSN - Update the messages state with the new user and bot messages
      const newMessages = [
        ...messages,
        { prompt: userPrompt, output: "", isBot: false },
        { prompt: "", output: `Query: ${query}\nResult: ${result}`, isBot: true }
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
        { prompt: "", output: `Query: ${query}\nResult: ${result}`, isBot: true }
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

  const formatMessages = () => {
    const formattedMessages = [];
    for (let i = 1; i < messages.length; i += 2) {
      const userMessage = messages[i];
      const botMessage = messages[i + 1] || { output: "" };
      const [queryLine, resultLine] = botMessage.output.split('\n');
      const query = queryLine ? queryLine.replace('Query: ', '') : '';
      const result = resultLine ? resultLine.replace('Result: ', '') : '';
      formattedMessages.push({
        prompt: userMessage.prompt,
        query: query,
        result: result,
      });
    }
    return formattedMessages;
  };

  const saveChat = async () => {
    try {
      const formattedMessages = formatMessages();
      const response = await axios.post('http://localhost:8000/api/save_chat/', {
        database: database,
        title: `Chat ${new Date().toISOString()}`,
        messages: formattedMessages
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
                      <>
                      <div>
                      <button className="vis-button"onClick={() => setVisualisation(!visualisation)}> {visualisation?"X":"Generate Table for this query"}</button>
                    </div>
                    <div>
                      {
                        visualisation?<ChartPage LangchainQuery={query} onChartData={handleChartData}/>:null
                      }
                    </div>
                      
                      </>
                    
                  )}
                      {message.isBot && i > 0 && (
                    <Feedback question={question} answer={answer} chartData={chartData} /> //lakshi- Here I Using Feedback component
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
            disabled={isLoading || limitReached|| view==true}
          />
          <button className='send-button' onClick={handleSend} disabled={isLoading || limitReached || view==true}>
            <img src={send} alt="send" />
          </button>
          <button className='mic-button' onClick={handleMicClick} disabled={limitReached}>
            <img src={mic} alt="mic" />
          </button>
          
        </div>
      </div>
    </span>
  );
};

export default ChatArea;


