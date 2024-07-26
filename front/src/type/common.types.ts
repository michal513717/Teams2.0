
export interface ChatUser {
  name: string;
  status: "online" | "offline";
};

export interface Message {
  from: string;
  to: string;
  content: string;
  timestamp: string;
};