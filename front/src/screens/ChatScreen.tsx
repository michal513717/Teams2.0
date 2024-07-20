import { Button } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import { useState, useContext, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { ChatContext, ChatContextType } from "@/context/ChatContext";

type Props = { chat_user: string | undefined };

const ChatScreen: React.FC<Props> = ({ chat_user }) => {
  const [input, setInput] = useState<string>("");
  const { user } = useUser();
  const { messages, sendMessage } = useContext(ChatContext) as ChatContextType;

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

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>{chat_user}</div>
        <Button variant="contained" startIcon={<CallIcon />}>
          Call
        </Button>
      </div>
      <div className="chat-window">
        {messages
          .filter(msg => msg.to === chat_user || msg.from === chat_user)
          .map((msg, index) => (
            <div key={index} className={`message-container ${msg.from === user ? 'from' : 'to'}`}>
              <div className="message">{msg.content}</div>
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