import axios from "axios";
import { ENV } from "../config/env";
import { useAuthStore } from "../store/useAuthStore";
import { useToastStore } from "../store/useToastStore";

/**
 * 🔗 Axios Instance
 * Centralized HTTP client
 */
export const apiClient = axios.create({
  baseURL: ENV.BASE_URL,
  timeout: 10000,
});

/**
 * 🔐 Request Interceptor
 * Attaches token to every request automatically
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * ⚠️ Response Interceptor
 * Handles global errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: auto logout on 401
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      useToastStore.getState().showToast({
        type: "error",
        title: "Session Expired",
        message: "Please log in again.",
      });
    } else if (error.message === "Network Error" || !error.response) {
      useToastStore.getState().showToast({
        type: "error",
        title: "Network Error",
        message: "Could not connect to the server. Check your connection or IP address.",
      });
    } else {
      useToastStore.getState().showToast({
        type: "error",
        title: "Error",
        message: error.response?.data?.message || error.message || "An unexpected error occurred.",
      });
    }

    return Promise.reject(error);
  },
);
