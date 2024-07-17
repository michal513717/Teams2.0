import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import {
  setAccessToken,
  setRefreshToken,
  setUserName,
  removeAccessToken,
  removeRefreshToken,
  removeUserName,
  getUserName,
  getAccessToken,
  getRefreshToken,
} from "@/stores/localStorage";

interface UserContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  registerUser: (
    userName: string,
    password: string,
    confirmPassword: string
  ) => Promise<number>;
  loginUser: (userName: string, password: string) => Promise<number>;
  logoutUser: () => void;
  authCheck: () => Promise<number>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<string | null>(null);

  const registerUser = async (
    userName: string,
    password: string,
    confirmPassword: string
  ): Promise<number> => {
    try {
      const data = { userName, password, confirmPassword };
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        data
      );
      const loginStatus = await loginUser(userName, password);
      return loginStatus;
    } catch (error: any) {
      console.error("Registration failed:", error);
      return error.response?.status || 500;
    }
  };

  const loginUser = async (
    userName: string,
    password: string
  ): Promise<number> => {
    try {
      const data = { userName, password };
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        data
      );
      const { accessToken, refreshToken } = response.data.result;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUserName(userName);
      setUser(userName);
      return response.status;
    } catch (error: any) {
      console.error("Login failed:", error);
      return error.response?.status || 500;
    }
  };

  const logoutUser = (): void => {
    removeAccessToken();
    removeRefreshToken();
    removeUserName();
  };

  const authCheck = async (): Promise<number> => {
    try {
      const userName = getUserName();
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      const response = await axios.get("http://localhost:8080/info/allUsers", {
        headers: { Authorization: `Bearer: ${accessToken}` },
      });

      if (response.status == 200) {
        setUser(userName);
      }

      return response.status;
    } catch (error: any) {
      return 500;
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, registerUser, loginUser, logoutUser, authCheck }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
