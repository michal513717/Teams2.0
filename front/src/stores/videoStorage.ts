

import { VideoStore } from "@/type/stores.types";
import { create } from "zustand";

export const useVideoStore = create<VideoStore>((set) => ({
  isModalOpen: true,
  setIsModalOpen: (value) => set({ isModalOpen: value }),
}));