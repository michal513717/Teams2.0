import { SocketStore } from "@/type/stores.types";
import { create } from "zustand";

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  setSocket: (value) => set({ socket: value }),
}));