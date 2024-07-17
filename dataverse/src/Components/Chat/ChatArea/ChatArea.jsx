import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bot from "../../../assets/logo.png";
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
const ChatArea = ({ newChatTrigger, setNewChat, database_id, mess, setMess, view, setView, nowViewing, setNowViewing, ImageUrl, user }) => {

  const [db_server, setdb_server] = useState("")
  const [db_name, setdb_name] = useState("")
  const [db_user, setdb_user] = useState("")
  const [db_password, setdb_password] = useState("")
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/view-database/${database_id}/`);
      console.log(response.data);
      setdb_server(response.data.server);
      setdb_name(response.data.database);
      setdb_user(response.data.user);
      setdb_password(response.data.password);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {

    fetchData();
  }, [database_id]);
  // NSN - State variables for managing various aspects of the chat
  const database = database_id;
  const [userPrompt, setUserPrompt] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [voice, setVoice] = useState(false)

  const [messages, setMessages] = useState([
    {
      prompt: "Hi, I'm dataVerse, what can I visualize for you today?",
      output: "",
      isBot: true,
      visualisation: false,
      chartData: null,
    },
  ]);

  const [limitReached, setLimitReached] = useState(false);

  const handleChartData = (base64Image, index) => {
    const updatedMessages = messages.map((message, i) =>
      i === index ? { ...message, chartData: base64Image } : message
    );
    setMessages(updatedMessages);
  };

  // NSN - useEffect to handle new chat initialization
  useEffect(() => {
    console.log(database_id)
    console.log(database)
    if (newChatTrigger) {
      if (messages.length > 1) {
        if (!window.confirm("Are you sure you want to start a new chat? Unsaved messages will be lost.")) {
          return;
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
    if (view) {
      setMessages(mess)
    }
  }, [newChatTrigger, setNewChat, mess, setMessages, view, setView]);




  // NSN - Function to handle sending a message
  const handleSend = async (db_user, db_name, db_password, db_server) => {
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
        db_user: db_user,
        db_password: db_password,
        db_host: db_server,
        db_name: db_name,
        prompt: userPrompt,
      });

      const newQuery = response.data.query;
      const newResult = response.data.result;

      // NSN - Update the messages state with the new user and bot messages
      const newMessages = [
        ...messages,
        { prompt: userPrompt, output: "", isBot: false },
        { prompt: "", output: `Query: ${newQuery}\nResult: ${newResult}`, isBot: true }
      ];

      setQuery(newQuery);
      setResult(newResult);
      setMessages(newMessages);
      setUserPrompt("");

      // NSN - Check if the message limit has been reached
      if (newMessages.length >= MAX_MESSAGES) {
        setLimitReached(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = `Error sending message: ${error.message}`;
      showToast("Error generating query", "error");
      setUserPrompt("");
    } finally {
      setIsLoading(false);
    }
  };

  // NSN - Function to handle the Enter key press for sending messages
  const handleEnter = (e) => {
    if (e.key === "Enter") handleSend(db_user, db_name, db_password, db_server);
  };

  const toggleVisualisation = (index) => {
    const updatedMessages = messages.map((message, i) =>
      i === index ? { ...message, visualisation: !message.visualisation } : message
    );
    setMessages(updatedMessages);
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

      const outputLines = botMessage.output.split('\n');
      let queryLines = [];
      let resultLines = [];
      let collectingQuery = false;
      let collectingResult = false;

      for (const line of outputLines) {
        if (line.startsWith('Query: ')) {
          collectingQuery = true;
          collectingResult = false;
          queryLines.push(line.replace('Query: ', ''));
        } else if (line.startsWith('Result: ')) {
          collectingResult = true;
          collectingQuery = false;
          resultLines.push(line.replace('Result: ', ''));
        } else if (collectingQuery) {
          queryLines.push(line);
        } else if (collectingResult) {
          resultLines.push(line);
        }
      }

      const query = queryLines.join(' ');
      const result = resultLines.join(' ');

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


  let savedMessagesCount = 0;

  const fetchSavedMessagesCount = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/get_saved_messages_count/${nowViewing}`);
      savedMessagesCount = response.data.count;
    } catch (error) {
      console.error('Error fetching saved messages count:', error);
    }
  };

  const formatMessages2 = (messages) => {
    const formattedMessages = [];
    for (let i = savedMessagesCount * 2; i < messages.length; i += 2) {
      const userMessage = messages[i];
      const botMessage = messages[i + 1] || { output: "" };

      const outputLines = botMessage.output.split('\n');
      let queryLines = [];
      let resultLines = [];
      let collectingQuery = false;
      let collectingResult = false;

      for (const line of outputLines) {
        if (line.startsWith('Query: ')) {
          collectingQuery = true;
          collectingResult = false;
          queryLines.push(line.replace('Query: ', ''));
        } else if (line.startsWith('Result: ')) {
          collectingResult = true;
          collectingQuery = false;
          resultLines.push(line.replace('Result: ', ''));
        } else if (collectingQuery) {
          queryLines.push(line);
        } else if (collectingResult) {
          resultLines.push(line);
        }
      }

      const query = queryLines.join(' ');
      const result = resultLines.join(' ');

      formattedMessages.push({
        prompt: userMessage.prompt,
        query: query,
        result: result,
      });
    }
    return formattedMessages;
  };

  const updateChat = async () => {
    await fetchSavedMessagesCount();

    const newMessages = formatMessages2(messages);

    if (newMessages.length === 0) {
      showToast('No new messages to update', 'info');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/updatechat/', {
        chat_id: nowViewing,
        database: database,
        messages: newMessages
      });

      savedMessagesCount += newMessages.length / 2;
      showToast('Chat updated successfully', 'success');
    } catch (error) {
      console.error('Error updating chat:', error);
      if (error.response && error.response.data) {
        console.error('Backend response errors:', error.response.data);
      }
      showToast('Error updating chat', 'error');
    }
  };


  const handleSave = () => {
    if (!view) {

      saveChat()
    }
    else {

      updateChat()
    }
  }



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
                <img src={message.isBot ? bot : ImageUrl} alt="dp" />
                <div>
                  {message.prompt}
                  {message.output}
                  {message.isBot && i > 0 && (
                    <>
                      <div>
                        <button className="vis-button" onClick={() => toggleVisualisation(i)}>
                          {message.visualisation ? "X" : "Generate Table for this query"}
                        </button>
                      </div>
                      <div>
                      {
  view ?
    (message.visualisation ?
      <ChartPage
        LangchainQuery={
          message.output.split('\n').find(line => line.startsWith('Query: '))
            .replace('Query: ', '')
            .split('Result: ')[0]
        }
        createdBy={user}
        database_id={database_id}
        onChartData={(data) => handleChartData(data, i)}
      />
      : null)
    :
    (message.visualisation ?
      <ChartPage
        LangchainQuery={query}
        createdBy={user}
        database_id={database_id}
        onChartData={(data) => handleChartData(data, i)}
      />
      : null)
}

                      </div>
                    </>
                  )}
                  {message.isBot && i > 0 && (
                    <Feedback question={question} answer={answer} chartData={message.chartData} />
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
          <button
            className='send-button'
            onClick={() => handleSend(db_user, db_name, db_password, db_server)}
            disabled={isLoading || limitReached}
          >
            <img src={send} alt="send" />
          </button>
          <button className='mic-button' onClick={handleMicClick} disabled={limitReached}>
            <img src={mic} alt="mic" />
          </button>
          <button className='mic-button' onClick={handleSave} disabled={limitReached}>
            Save chat
          </button>

        </div>
      </div>
    </span>
  );
};

export default ChatArea;


