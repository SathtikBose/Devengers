import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: number;
  title: string;
  message?: string;
  type: ToastType;
};

type ToastState = {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => number;
  dismissToast: (id: number) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: ({ title, message, type }) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);

    set((state) => ({
      toasts: [...state.toasts, { id, title, message, type }],
    }));

    return id;
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
