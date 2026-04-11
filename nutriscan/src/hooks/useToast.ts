import { useToastStore, type ToastType } from "../store/useToastStore";

type ToastInput = {
  title: string;
  message?: string;
};

export const useToast = () => {
  const showToast = useToastStore((state) => state.showToast);

  const show = (type: ToastType, input: ToastInput) =>
    showToast({
      type,
      title: input.title,
      message: input.message,
    });

  return {
    show,
    success: (input: ToastInput) => show("success", input),
    error: (input: ToastInput) => show("error", input),
    info: (input: ToastInput) => show("info", input),
  };
};
