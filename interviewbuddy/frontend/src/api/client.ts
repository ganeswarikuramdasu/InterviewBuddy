import axios, { AxiosError } from "axios";
import type { ApiError } from "../types";

const baseURL =
  (import.meta.env.VITE_APP_URL as string | undefined)?.replace(/\/+$/, "") ??
  "/api";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("interviewbuddy_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Token invalid/expired: clear local session so the UI falls back to logged-out state.
      localStorage.removeItem("interviewbuddy_token");
      localStorage.removeItem("interviewbuddy_user");
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;
    if (apiError?.details && apiError.details.length > 0) {
      return apiError.details.join(", ");
    }
    if (apiError?.message) return apiError.message;
    if (error.message) return error.message;
  }
  return "Something went wrong. Please try again.";
}
