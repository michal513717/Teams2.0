import { UserStatus } from "@/type/common.types";
import { ChatStore } from "@/type/stores.types";
import { create } from "zustand";

export const useChatStorage = create<ChatStore>((set) => ({
  messages: null,
  chatUsers: [],
  socket: null,
  setChatUsers: (value) => set({ chatUsers: value }),
  setMessages: (value) => set({ messages: value }),
  setSocket: (value) => set({ socket: value }),
  toogleUserStatus: (value) => 
    set((state) => {
      state.chatUsers.forEach((item) => {
        if(item.userName === value){
          item.connected = !item.connected
        }
      });

      return {
        ...state
      }
    }),
  setMessagesWithFormat: (value) => 
    set((state) => {
      let prevMessages = state.messages || [];

      if(state.messages === null) prevMessages = []

      const updatedMessages = [...prevMessages, value];
      const sorted = updatedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      return {
        ...state,
        messages: sorted,
      }
  }),
  setChatUsersStatusWithFilter: (value) => // TODO refactor
    set((state) => {
      const users = state.chatUsers || [];
      const newStatus = users.map((u) => {
        const user = value.find((user) => user.userName === u.userName);
        return user ? { ...u, status: user.connected } : u;
      });
      
      return {
        ...state,
        chatUsers: newStatus
      }
    }),
}))
