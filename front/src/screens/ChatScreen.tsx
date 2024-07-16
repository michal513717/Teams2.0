import { Button, IconButton } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import Container from "@mui/material/Container";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

type Props = { chat_user: string | undefined };

const ChatScreen: React.FC<Props> = ({ chat_user }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const { user } = useUser();

  const handleSendMessage = () => {
    console.log(input);
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
    console.log(messages);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>{chat_user}</div>
        <Button variant="contained" startIcon={<CallIcon />}>
          Call
        </Button>
      </div>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className="message-container to">
            <div className="message">{msg}</div>
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
