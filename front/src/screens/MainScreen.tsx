import React, { useState } from 'react';
import './Screen.css';
import { useUser } from '../context/UserContext';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MainScreen: React.FC = () => {
  const { user, setUser } = useUser();
  const [messages, setMessages] = useState<string[]>(['Hello!']);
  const [input, setInput] = useState<string>('');
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput('');
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="main-screen">
      <div className="sidebar">
        <div className="player">
          <span className="status online"></span> {user} (yourself)
        </div>
        <div className="player">
          <span className="status online"></span> Player 2
        </div>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
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