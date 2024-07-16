import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  registerUser: (username: string, password: string) => number,
  loginUser: (username: string, password: string) => number,
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const registerUser = (username: string, password: string) => {
    return 200;
  }

  const loginUser = (username: string, password: string) => {
    return 200;
  }

  return (
    <UserContext.Provider value={{ user, setUser, registerUser, loginUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};