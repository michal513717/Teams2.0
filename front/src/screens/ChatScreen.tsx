import { Button } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import { useState, useContext, useEffect } from "react";
import { ChatContext, ChatContextType } from "@/context/ChatContext";
import { useAuthStore } from "@/stores/authStorage";
import { useVideo, VideoContext, VideoContextType } from "@/context/VideoCallContext";

type Props = { chat_user: string | undefined };

const ChatScreen: React.FC<Props> = ({ chat_user }) => {
  const [input, setInput] = useState<string>("");
  const { userName } = useAuthStore();
  const { callUser } = useContext(VideoContext) as VideoContextType;
  const { messages, sendMessage } = useContext(ChatContext) as ChatContextType;

  const handleSendMessage = () => {
    if (input.trim() && chat_user) {
      sendMessage(input, chat_user);
      setInput("");
    }
  };

  const filteredMessages = messages.filter(msg => {
    return chat_user === userName ? msg.from === userName && msg.to === userName : msg.to === chat_user || msg.from === chat_user;
  });

  const handleCallUser = () => {
    callUser(chat_user as string);
  }

  return (
    <div className="chat-container" >
      <div className="chat-header">
        <div>{chat_user}</div>
        <Button variant="contained" startIcon={<CallIcon />} onClick={handleCallUser}>
          Call
        </Button>
      </div>
      <div className="chat-window">
        {filteredMessages.map((msg, index) => (
          <div key={index} className={`message-container ${msg.from === userName ? 'from' : 'to'}`}>
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