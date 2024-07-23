import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '@/stores/localStorage';
import { CONFIG } from '@/utils/config';

export interface ChatUser {
  name: string;
  status: 'online' | 'offline';
}

export interface ChatContextType {
  chatUsers: ChatUser[];
}

export const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
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
    const connectionSocket = io(CONFIG.SERVER_URL);

    setSocket(connectionSocket);


  }, [])

  return <ChatContext.Provider value={{ chatUsers }}>{children}</ChatContext.Provider>;
};

export default ChatProvider;