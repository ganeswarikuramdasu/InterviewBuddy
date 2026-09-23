import { apiClient } from "./client";
import type { AuthResponse, UserResponse } from "../types";

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  college?: string;
  branch?: string;
  graduationYear?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>("/auth/register", payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

  getProfile: () =>
    apiClient.get<UserResponse>("/user/profile").then((r) => r.data),

  updateProfile: (payload: Partial<UserResponse>) =>
    apiClient.put<UserResponse>("/user/profile", payload).then((r) => r.data),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiClient.put("/user/password", payload).then((r) => r.data),

  verifyEmail: (token: string) =>
    apiClient
      .get("/auth/verify-email", { params: { token } })
      .then((r) => r.data),

  resendVerification: (email: string) =>
    apiClient
      .post("/auth/resend-verification", null, { params: { email } })
      .then((r) => r.data),
};
