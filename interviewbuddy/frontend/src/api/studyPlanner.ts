import { apiClient } from "./client";
import type { StudyPlan, StudyPlanItem, StudyPlanType } from "../types";

export interface StudyPlanItemPayload {
  title: string;
  type: StudyPlanType;
  dayOfWeek: number;
  time?: string | null;
  durationMinutes?: number | null;
}

export const studyPlannerApi = {
  getPlan: () => apiClient.get<StudyPlan>("/study-plan").then((r) => r.data),
  updateGoals: (payload: {
    codingPerWeek?: number;
    interviewsPerWeek?: number;
    learningPerWeek?: number;
  }) =>
    apiClient.put<StudyPlan>("/study-plan/goals", payload).then((r) => r.data),
  createItem: (payload: StudyPlanItemPayload) =>
    apiClient.post<StudyPlan>("/study-plan/items", payload).then((r) => r.data),
  updateItem: (itemId: number, payload: StudyPlanItemPayload) =>
    apiClient
      .put<StudyPlan>(`/study-plan/items/${itemId}`, payload)
      .then((r) => r.data),
  toggleItem: (itemId: number) =>
    apiClient
      .patch<StudyPlan>(`/study-plan/items/${itemId}/toggle`)
      .then((r) => r.data),
  deleteItem: (itemId: number) =>
    apiClient
      .delete<StudyPlan>(`/study-plan/items/${itemId}`)
      .then((r) => r.data),
};
