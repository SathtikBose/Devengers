import axios from "axios";
import { ENV } from "../config/env";
import { useAuthStore } from "../store/useAuthStore";

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
    }

    return Promise.reject(error);
  },
);
