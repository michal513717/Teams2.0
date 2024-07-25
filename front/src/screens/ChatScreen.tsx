import { Button } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import EndCallIcon from "@mui/icons-material/CallEnd";
import { useState, useContext, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { ChatContext, ChatContextType } from "@/context/ChatContext";
import VideoProvider from "@/context/VideoContext";
import VideoChat from "./VideoChat";

type Props = { chat_user: string | undefined };

const ChatScreen: React.FC<Props> = ({ chat_user }) => {
  const [input, setInput] = useState<string>("");
  const { user } = useUser();
  const { messages, sendMessage } = useContext(ChatContext) as ChatContextType;
  const [isVideoCall, setIsVideoCall] = useState<boolean>(false);

  const handleSendMessage = () => {
    if (input.trim() && chat_user) {
      sendMessage(input, chat_user);
      setInput("");
    }
  };

  useEffect(() => {
    // Scroll to bottom when new messages are added
    const chatWindow = document.querySelector(".chat-window");
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [messages]);

  const filteredMessages = messages.filter(msg => {
    if (chat_user === user) {
      return msg.from === user && msg.to === user;
    } else {
      return msg.to === chat_user || msg.from === chat_user;
    }
  });

  const handleCallButtonClick = () => {
    setIsVideoCall(!isVideoCall);
  };

  const handleEndCall = useCallback(() => {
    setIsVideoCall(false);
  }, []);

  useEffect(() => {
    // End call when switching chat
    handleEndCall();
  }, [chat_user, handleEndCall]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>{chat_user}</div>
        <Button variant="contained" startIcon={isVideoCall ? <EndCallIcon /> : <CallIcon />} onClick={handleCallButtonClick}>
          {isVideoCall ? 'End Call' : 'Call'}
        </Button>
      </div>
      {isVideoCall && chat_user && (
        <VideoProvider>
          <VideoChat remoteUserID={chat_user} onEndCall={handleEndCall} />
        </VideoProvider>
      )}
      <div className="chat-window">
        {filteredMessages.map((msg, index) => (
          <div key={index} className={`message-container ${msg.from === user ? 'from' : 'to'}`}>
            <div className="message">
              <div className="message-content">{msg.content}</div>
              <div className="message-timestamp">{new Date(msg.timestamp).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="Your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button onClick={handleSendMessage} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;