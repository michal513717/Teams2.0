

import { VideoStore } from "@/type/stores.types";
import { create } from "zustand";

export const useVideoStore = create<VideoStore>((set) => ({
  isVideoModalOpen: false,
  isRequestCallModalOpen: false,
  isCallAccepted: null,
  callerUserName: null,
  setIsCallAccepted: (value) => set({ isCallAccepted: value }),
  setCallerUserName: (value) => set({ callerUserName: value }),
  setIsVideoModalOpen: (value) => set({ isVideoModalOpen: value }),
  setIsRequestCallModalOpen: (value) => set({ isRequestCallModalOpen: value })
}));