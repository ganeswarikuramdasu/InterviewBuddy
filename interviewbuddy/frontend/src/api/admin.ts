import { apiClient } from "./client";
import type { UserResponse, Page, Role } from "../types";

export const adminApi = {
  searchUsers: (params: {
    search?: string;
    role?: Role;
    page?: number;
    size?: number;
  }) =>
    apiClient
      .get<Page<UserResponse>>("/admin/users", { params })
      .then((r) => r.data),
  setUserEnabled: (userId: number, enabled: boolean) =>
    apiClient
      .put(`/admin/users/${userId}/enabled`, null, { params: { enabled } })
      .then((r) => r.data),
  deleteUser: (userId: number) =>
    apiClient.delete(`/admin/users/${userId}`).then((r) => r.data),

  listInterviewQuestions: (role?: string) =>
    apiClient
      .get("/admin/interviews/questions", { params: role ? { role } : {} })
      .then((r) => r.data),
  createInterviewQuestion: (payload: any) =>
    apiClient.post("/admin/interviews/questions", payload).then((r) => r.data),
  updateInterviewQuestion: (id: number, payload: any) =>
    apiClient
      .put(`/admin/interviews/questions/${id}`, payload)
      .then((r) => r.data),
  deleteInterviewQuestion: (id: number) =>
    apiClient.delete(`/admin/interviews/questions/${id}`).then((r) => r.data),
};
