import { Button } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import { useState, useContext, useEffect } from "react";
import { ChatContext, ChatContextType } from "@/context/ChatContext";
import { useAuthStore } from "@/stores/authStorage";

type Props = { chat_user: string | undefined };

const ChatScreen: React.FC<Props> = ({ chat_user }) => {
  const [input, setInput] = useState<string>("");
  const { userName } = useAuthStore();
  const { messages, sendMessage } = useContext(ChatContext) as ChatContextType;

  const handleSendMessage = () => {
    if (input.trim() && chat_user) {
      sendMessage(input, chat_user);
      setInput("");
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (chat_user === userName) {
      return msg.from === userName && msg.to === userName;
    } else {
      return msg.to === chat_user || msg.from === chat_user;
    }
  });


  return (
    <div className="chat-container" >
      <div className="chat-header">
        <div>{chat_user}</div>
        <Button variant="contained" startIcon={<CallIcon />}>
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