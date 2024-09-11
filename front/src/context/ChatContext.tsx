import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { getAccessToken } from "@/stores/localStorage";
import { io } from "socket.io-client";
import { CONFIG } from "@/utils/config";
import { useAuthStore } from "@/stores/authStorage";
import { GLOBAL_CONFIG } from "./../../../config.global";
import { useSocketStore } from "@/stores/socketStorage";
import { ChatUser, Message, UserStatus } from "@/type/common.types";

export interface ChatContextType {
  chatUsers: ChatUser[];
  messages: Message[];
  unreadMessages: string[];
  getUnreadMessages: () => void;
  sendMessage: (message: string, to: string) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userName } = useAuthStore();
  const { setSocket, socket } = useSocketStore();
  const [unreadMessages, setUnreadMessages] = useState<string[]>([]);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchUsers = async () => {
    try {
      const accessToken = getAccessToken();
      const response = await axios({
        url: CONFIG.SERVER_URL + CONFIG.END_POINTS.ALL_USERS,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const users = response.data.result.map((user: UserStatus) => ({
        userName: user.userName,
        connected: user.connected
      }));
      setChatUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getUnreadMessages = async () => {
    try {
      const accessToken = getAccessToken();

      const response = await axios({
        url: CONFIG.SERVER_URL + CONFIG.END_POINTS.UNREAD_MESSAGES,
        method: "GET",
        params: { userName },
        headers: { Authorization: `Bearer ${accessToken}`}
      });

      setUnreadMessages(response.data.result as string []);
    } catch (error) {
      console.error("Error fetching unread messages", error);
    }
  }

  useEffect(() => {

    const accessToken = getAccessToken();

    if (!accessToken || !userName) {
      console.error("Access token or username is missing");
      return;
    }

    fetchUsers();

    //TODO specify types eg.
    // please note that the types are reversed
    // const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

    const newSocket = io(CONFIG.SERVER_URL, {
      auth: {
        token: accessToken
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.info("Connected to WebSocket server");
    });

    newSocket.on(GLOBAL_CONFIG.SOCKET_EVENTS.INIT_CHATS, (chatHistory: Message[]) => {

      const formattedMessages = chatHistory.map((msg) => ({
        from: msg.from,
        to: msg.to,
        content: msg.message,
        timestamp: msg.timestamp,
      }));
      setMessages(formattedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    });

    
    newSocket.on(GLOBAL_CONFIG.SOCKET_EVENTS.PRIVATE_MESSAGE, (message: Message) => {
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

    newSocket.on(GLOBAL_CONFIG.SOCKET_EVENTS.ALL_USERS, (allUsers: UserStatus[]) => {
      setChatUsers((prevUsers) =>
        prevUsers.map((u) => {
          const user = allUsers.find((user) => user.userName === u.userName);
          return user ? { ...u, connected: user.connected ? true : false } : u;
        })
      );
    });

    newSocket.on(GLOBAL_CONFIG.SOCKET_EVENTS.USER_CONNECTED, (user: UserStatus) => {
      const userName = user.userName;
      setChatUsers((prevUsers) =>
        prevUsers.map((u) => {
          return u.userName === userName ? { ...u, connected: true } : u;
        })
      );
    });

    newSocket.on(GLOBAL_CONFIG.SOCKET_EVENTS.USER_DISCONNECTED, (userName: string) => {
      setChatUsers((prevUsers) =>
        prevUsers.map((u) => {
          return u.userName === userName ? { ...u, connected: false } : u;
        })
      );
    });

    newSocket.on(GLOBAL_CONFIG.SOCKET_EVENTS.USER_DISCONNECT, () => {
      // removeSessionID();
      // TODO remove user
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (message: string, to: string) => {
    if (socket) {
      if (userName) {
        const timestamp = new Date().toISOString();
        
        socket.emit(GLOBAL_CONFIG.SOCKET_EVENTS.PRIVATE_MESSAGE, { content: message, to, timestamp });
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
    <ChatContext.Provider value={{ chatUsers, messages, sendMessage, getUnreadMessages, unreadMessages }}>
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