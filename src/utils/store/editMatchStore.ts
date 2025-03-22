import { create } from "zustand";
import { TFormData } from "../validators/types";

interface EditMatchStore {
  matchData: TFormData | null;
  setMatchData: (data: any) => void;
  clearMatchData: () => void;
}

export const useEditMatchStore = create<EditMatchStore>((set) => ({
  // 초기 상태
  matchData: null,

  // 액션 (상태를 변경하는 함수들)
  setMatchData: (data) => set({ matchData: data }),
  clearMatchData: () => set({ matchData: null }),
}));
