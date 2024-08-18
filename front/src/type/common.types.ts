
export type StatusType = "online" | "offline";

//TODO fix types

export type Message = {
  from: string;
  to: string;
  content?: string;
  message?: string;
  timestamp: string;
};

export type ChatUser = {
  userName: string;
  connected: boolean;
};

export type UserStatus = {
  userName: string;
  connected: boolean;
};

export type ChatHistory = {
  time: Date;
  message: string;
  sender: string;
};
