import { apiClient } from "./client";
import type { UserDashboard, AdminDashboard } from "../types";

export const dashboardApi = {
  getUserDashboard: () =>
    apiClient.get<UserDashboard>("/dashboard").then((r) => r.data),
  getAdminDashboard: () =>
    apiClient.get<AdminDashboard>("/admin/dashboard").then((r) => r.data),
};
