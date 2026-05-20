import { UseStages } from "@/lib/types";
import { create } from "zustand";

export const useStages = create<UseStages>((set) => ({
  stages: [],
  setStages: (arg) => {
    set({ stages: arg });
  },
}));
