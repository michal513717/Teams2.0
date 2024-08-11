import { AuthStore } from "@/type/stores.types";
import { create } from "zustand";

export const useAuthStore = create<AuthStore>((set) => ({
  userName: null,
  isAuthenticated: false,
  setUserName: (value) => set({ userName: value }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
}));