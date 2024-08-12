
export type ChatUser = {
  name: string;
  status: "online" | "offline" | boolean; ////TODO fix types
  connected: boolean | "online" | "offline" //TODO fix types
};

export type Message = {
  from: string;
  to: string;
  content: string;
  timestamp: string;
};

export type UserStatus = {
  userName: string;
  connected: boolean; //TODO fix types
}
