import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { getAccessToken, getRefreshToken } from '@/stores/localStorage';
import { CONFIG } from '@/utils/config';

export interface ChatUser {
  name: string;
  status: 'online' | 'offline';
}

export type ChatHistory = {
  time: Date;
  message: string;
  sender: string;
}

export interface ChatContextType {
  chatUsers: ChatUser[];
}

export const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [chatHistory, setChatHistory] = useState<Record<string, ChatHistory>>();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = getAccessToken();
        const response = await axios.get(
          CONFIG.SERVER_URL + CONFIG.END_POINTS.ALL_USERS, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });


        //TODO set chat history to type Record<UserName, ChatHistory>;


        const users = response.data.result.map((name: string) => ({
          name,
          status: 'offline', // default
        }));
        setChatUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("dada")
    const connectionSocket = io(CONFIG.SERVER_URL, {
      auth: {
        token: getAccessToken()
      }
    });
    setSocket(connectionSocket);
    onUserConnect();
    onUserDisconnect();
    onPrivateMessage();
    onCallMadeMessage();
    onSessionInfo();

    return () => { connectionSocket.close() };
  }, [])

  const onUserConnect = useCallback(() => {
    if (socket) {
      socket.on(CONFIG.SOCKET_LISTENERS.USER_CONNECTED, (socket) => { console.log(socket) });
    }
  }, [socket]);

  const onUserDisconnect = useCallback(() => {
    if (socket) {
      socket.on(CONFIG.SOCKET_LISTENERS.USER_DISCONNECT, (socket) => { console.log(socket) });
    }
  }, [socket]);

  const onPrivateMessage = useCallback(() => {
    if (socket) {
      socket.on(CONFIG.SOCKET_LISTENERS.RECIVE_PRIVATE_MESSAGE, (socket) => { console.log(socket) });
    }
  }, [socket]);

  const onCallMadeMessage = useCallback(() => {
    if (socket) {
      socket.on(CONFIG.SOCKET_LISTENERS.RECIVE_WEBRTC_SETTINS, (socket) => { console.log(socket) });
    }
  }, [socket]);

  const onSessionInfo = useCallback(() => {
    if (socket) {
      socket.on(CONFIG.SOCKET_LISTENERS.SESSION_INFO, (socket) => { console.log(socket) });
    }
  }, [socket]);

  // EMITERS
  const makeCallEvent = useCallback(() => {
    if (socket) {
      socket.emit(CONFIG.SOCKET_EVENTS.CONNECT_WEBRTC)
    }
  }, [socket]);

  const sendPrivateMessageEvent = useCallback(() => {
    if (socket) {
      socket.emit(CONFIG.SOCKET_EVENTS.SEND_PRIVATE_MESSAGE)
    }
  }, [socket]);

  return <ChatContext.Provider value={{ chatUsers }}>{children}</ChatContext.Provider>;
};

export default ChatProvider;