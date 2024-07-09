import React, { useState } from 'react';
import './Screen.css';
import { useUser } from '../context/UserContext';


const MainScreen: React.FC = () => {
    const { user } = useUser();
    const [messages, setMessages] = useState<string[]>(['Hello!']);
    const [input, setInput] = useState<string>('');
  
    const handleSendMessage = () => {
      if (input.trim()) {
        setMessages([...messages, input]);
        setInput('');
      }
    };
  
    return (
      <div className="main-screen">
        <div className="sidebar">
          <div className="user">
            <span className="status online"></span> {user} (yourself)
          </div>
          <div className="user">
            <span className="status online"></span> User2
          </div>
        </div>
        <div className="chat-container">
          <div className="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                ({user}) {msg}
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSendMessage} disabled={!input.trim()}>
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default MainScreen;