import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatbotVisible, setChatbotVisible] = useState(false); // Initially false
  const token = localStorage.getItem('login');

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage = { text: inputText, sender: 'user' };
    setMessages([...messages, newMessage]);

    try {
      const response = await axios.post(
        'http://54.242.240.123/chatbot',
        {
          inputText,
        },
        { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } }
      );

      const botResponse = { text: response.data.response, sender: 'bot' };
      setMessages((messages) => [...messages, botResponse]);
    } catch (error) {
      console.error('Error communicating with chatbot:', error);
      setMessages((messages) => [
        ...messages,
        { text: 'Error communicating with the chatbot.', sender: 'bot' },
      ]);
    }

    setInputText('');
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    };
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [inputText]);

  return (
    <div
      className={`chatbot-container ${chatbotVisible ? 'show-chatbot' : ''}`}
    >
      <button
        className="chatbot-toggler"
        onClick={() => setChatbotVisible(!chatbotVisible)}
      >
        {chatbotVisible ? (
          <span className="material-symbols-outlined">close</span>
        ) : (
          <span className="material-symbols-outlined">mode_comment</span>
        )}
      </button>
      <div className="chatbot">
        <header>
          <h2>Cluby</h2>
        </header>
        <ul className="chatbox">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`chat ${
                msg.sender === 'user' ? 'outgoing' : 'incoming'
              }`}
            >
              {msg.sender === 'bot' && (
                <span className="icon material-symbols-outlined">
                  smart_toy
                </span>
              )}
              <p>{msg.text}</p>
            </li>
          ))}
        </ul>
        <div className="chat-input">
          <textarea
            placeholder="Enter a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            required
          ></textarea>
          <span
            id="send-btn"
            className="material-symbols-outlined"
            onClick={sendMessage}
          >
            send
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
