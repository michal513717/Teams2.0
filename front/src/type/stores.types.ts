import { ChatUser, Message, UserStatus } from "./common.types";
import { Socket } from "socket.io-client";

export type AuthStore = {
  isAuthenticated: boolean;
  userName: null | string;
  setUserName: (value: null | string) => void;
  setIsAuthenticated: (value: boolean) => void;
};

export type ChatStore = {
  chatUsers: UserStatus[];
  messages: Message[] | null;
  socket: Socket | null;
  selectedUserChat: string | null;
  setSelectedUserChat: (value: string) => void;
  setChatUsers: (value: UserStatus[]) => void;
  setMessages: (value: Message[] | null) => void;
  setSocket: (value: Socket | null) => void;
  setMessagesWithFormat: (value: Message) => void;
  setChatUsersStatusWithFilter: (value: UserStatus[]) => void;
  toogleUserStatus: (userName: string) => void;
};

export type VideoStore = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}