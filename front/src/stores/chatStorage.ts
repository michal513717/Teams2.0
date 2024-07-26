import { ChatStore } from "@/type/stores.types";
import { create } from "zustand";

export const useChatStorage = create<ChatStore>((set) => ({
  messages: null,
  chatUsers: [],
  setChatUsers: (value) => set({ chatUsers: value }),
  setMessages: (value) => set({ messages: value })
}));
