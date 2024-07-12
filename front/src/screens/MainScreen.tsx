import React, { useState } from 'react';
import './Screen.css';
import { useUser } from '../context/UserContext';
import { Button, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import SideProfilesMenu from './SideProfilesMenu'
import ChatProvider from '@/context/ChatContext';

const MainScreen: React.FC = () => {
  const { user, setUser } = useUser();
  const [messages, setMessages] = useState<string[]>(['Hello!']);
  const [input, setInput] = useState<string>('');
  const navigate = useNavigate();
  const {user_chat} = useParams();

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
    <ChatProvider>
      <div className="main-screen">
        <div className="sidebar">
          <SideProfilesMenu chat_user={user_chat}/>
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
    </ChatProvider>
  );
};

export default MainScreen;