import { apiClient } from "./client";
import type { LearningCategory, LearningResource } from "../types";

export const learningApi = {
  listCategories: () =>
    apiClient
      .get<LearningCategory[]>("/learning/categories")
      .then((r) => r.data),
  createCategory: (payload: { name: string; description?: string }) =>
    apiClient.post("/learning/categories", payload).then((r) => r.data),
  updateCategory: (
    id: number,
    payload: { name: string; description?: string },
  ) => apiClient.put(`/learning/categories/${id}`, payload).then((r) => r.data),
  deleteCategory: (id: number) =>
    apiClient.delete(`/learning/categories/${id}`).then((r) => r.data),
  listResources: (categoryId: number) =>
    apiClient
      .get<LearningResource[]>(`/learning/categories/${categoryId}/resources`)
      .then((r) => r.data),
  getResource: (id: number) =>
    apiClient
      .get<LearningResource>(`/learning/resources/${id}`)
      .then((r) => r.data),
  markCompleted: (id: number) =>
    apiClient.post(`/learning/resources/${id}/complete`).then((r) => r.data),

  // User-managed resources (users add and maintain their own learning links)
  createResource: (payload: any) =>
    apiClient.post("/learning/resources", payload).then((r) => r.data),
  updateResource: (id: number, payload: any) =>
    apiClient.put(`/learning/resources/${id}`, payload).then((r) => r.data),
  deleteResource: (id: number) =>
    apiClient.delete(`/learning/resources/${id}`).then((r) => r.data),
};
