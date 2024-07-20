import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { getAccessToken, getUserName } from "@/stores/localStorage";
import { io, Socket } from "socket.io-client";

export interface ChatUser {
  name: string;
  status: "online" | "offline";
}

export interface Message {
  from: string;
  to: string;
  content: string;
}

export interface ChatContextType {
  chatUsers: ChatUser[];
  messages: Message[];
  sendMessage: (message: string, to: string) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchUsers = async () => {
    try {
      const accessToken = getAccessToken();
      const response = await axios.get("http://localhost:8080/info/allUsers", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const users = response.data.result.map((name: string) => ({
        name,
        status: "offline", // Default status
      }));
      setChatUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on initial render

    const accessToken = getAccessToken();
    const userName = getUserName();

    if (!accessToken || !userName) {
      console.error("Access token or username is missing");
      return;
    }

    const newSocket = io("http://localhost:8080", {
      auth: {
        token: accessToken,
        sessionID: "placeholder", //TODO
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    newSocket.on("init-chats", (chatHistory: { from: string; message: string; to: string }[]) => {
        const formattedMessages = chatHistory.map((msg) => ({
          from: msg.from,
          to: msg.to,
          content: msg.message,
        }));
        setMessages(formattedMessages);
      }
    );

    newSocket.on("private-message", (message: { from: string; message: string; to: string }) => {
        const formattedMessage = {
          from: message.from,
          to: message.to,
          content: message.message,
        };
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      }
    );

    newSocket.on("user-connected", (userName: string) => {
      setChatUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.name === userName ? { ...u, status: "online" } : u
        )
      );
    });

    newSocket.on("user-disconnected", (userName: string) => {
      setChatUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.name === userName ? { ...u, status: "offline" } : u
        )
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (message: string, to: string) => {
    if (socket) {
      const userName = getUserName();
      if (userName) {
        socket.emit("private-message", { content: message, to });
        setMessages((prevMessages) => [
          ...prevMessages,
          { from: userName, to, content: message },
        ]);
      } else {
        console.error("User name is null");
      }
    }
  };

  return (
    <ChatContext.Provider value={{ chatUsers, messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
