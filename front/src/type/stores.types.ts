import { ChatUser, Message } from "./common.types";

export type AuthStore = {
  isAuthenticated: boolean;
  userName: null | string;
  setUserName: (value: null | string) => void;
  setIsAuthenticated: (value: boolean) => void;
};

export type ChatStore = {
  chatUsers: ChatUser[];
  messages: Message[] | null;
  setChatUsers: (value: ChatUser[]) => void;
  setMessages: (value: Message[] | null) => void;
};

