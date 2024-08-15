import { ChatUser, Message, UserStatus } from "./common.types";
import { Socket } from "socket.io-client";

// TODO clean unused stores

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
  setSelectedUserChat: (value: string | null) => void;
  setChatUsers: (value: UserStatus[]) => void;
  setMessages: (value: Message[] | null) => void;
  setSocket: (value: Socket | null) => void;
  setMessagesWithFormat: (value: Message) => void;
  setChatUsersStatusWithFilter: (value: UserStatus[]) => void;
  toogleUserStatus: (userName: string) => void;
};

export type VideoStore = {
  isVideoModalOpen: boolean;
  isRequestCallModalOpen: boolean;
  callerUserName: string | null;
  setCallerUserName: (value: string | null) => void;
  setIsVideoModalOpen: (value: boolean) => void;
  setIsRequestCallModalOpen: (value: boolean) => void;
}

export type SocketStore = {
  socket: Socket | null;
  setSocket: (value: Socket | null) => void;
}