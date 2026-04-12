import { create } from "zustand";

interface LoadingState {
  loading: boolean;
  message?: string;
  show: (message?: string) => void;
  hide: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  loading: false,
  message: undefined,
  show: (message) => set({ loading: true, message }),
  hide: () => set({ loading: false, message: undefined }),
}));
