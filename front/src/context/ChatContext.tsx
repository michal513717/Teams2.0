import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '@/stores/localStorage'; 

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = getAccessToken();
        const response = await axios.get('http://localhost:8080/info/allUsers', {
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

  return <ChatContext.Provider value={{ chatUsers }}>{children}</ChatContext.Provider>;
};

export default ChatProvider;