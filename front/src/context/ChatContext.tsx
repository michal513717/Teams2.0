import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { getAccessToken, getUserName, setSessionID, getSessionID, removeSessionID } from "@/stores/localStorage";
import { io, Socket } from "socket.io-client";

export interface ChatUser {
  name: string;
  status: "online" | "offline";
}

interface UserStatus {
  userName: string;
  connected: boolean;
}

export interface Message {
  from: string;
  to: string;
  content: string;
  timestamp: string;
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
    const storedSessionID = getSessionID();

    if (!accessToken || !userName) {
      console.error("Access token or username is missing");
      return;
    }

    const newSocket = io("http://localhost:8080", {
      auth: {
        token: accessToken,
        sessionID: storedSessionID,
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    newSocket.on("session", ({ sessionID, userID }) => {
      setSessionID(sessionID);
      newSocket.auth = { ...newSocket.auth, sessionID };
    });

    newSocket.on("init-chats", (chatHistory: { from: string; message: string; to: string; timestamp: string }[]) => {
      const formattedMessages = chatHistory.map((msg) => ({
        from: msg.from,
        to: msg.to,
        content: msg.message,
        timestamp: msg.timestamp,
      }));
      setMessages(formattedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    });

    newSocket.on("private-message", (message: { from: string; message: string; to: string; timestamp: string }) => {
      const formattedMessage = {
        from: message.from,
        to: message.to,
        content: message.message,
        timestamp: message.timestamp,
      };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, formattedMessage];
        return updatedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      });
    });

    newSocket.on("all-users", (allUsers: UserStatus[]) => {
      setChatUsers((prevUsers) =>
      prevUsers.map((u) => {
        const user = allUsers.find((user) => user.userName === u.name);
        return user ? { ...u, status: user.connected ? "online" : "offline" } : u;
      })
    );
  });

    newSocket.on("user-connected", (user) => {
      const userName = user.userName;
      setChatUsers((prevUsers) =>
        prevUsers.map((u) => {
          return u.name === userName ? { ...u, status: "online" } : u;
        })
      );
    });

    newSocket.on("user-disconnected", (userName) => {
      setChatUsers((prevUsers) =>
        prevUsers.map((u) => {
          return u.name === userName ? { ...u, status: "offline" } : u;
        })
      );
    });

    newSocket.on("disconnect", () => {
      removeSessionID();
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (message: string, to: string) => {
    if (socket) {
      const userName = getUserName();
      if (userName) {
        const timestamp = new Date().toISOString();
        socket.emit("private-message", { content: message, to, timestamp });
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, { from: userName, to, content: message, timestamp }];
          return updatedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        });
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