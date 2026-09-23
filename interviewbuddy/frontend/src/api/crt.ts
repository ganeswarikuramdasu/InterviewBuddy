import { apiClient } from "./client";
import type {
  CrtCategory,
  CrtTopic,
  CrtQuestionPractice,
  CrtPracticeResult,
  CrtTest,
  CrtTestAttemptStart,
  CrtTestResult,
  CrtQuestionAdmin,
} from "../types";

export const crtApi = {
  listCategories: () =>
    apiClient.get<CrtCategory[]>("/crt/categories").then((r) => r.data),
  listTopics: (categoryId: number) =>
    apiClient
      .get<CrtTopic[]>(`/crt/categories/${categoryId}/topics`)
      .then((r) => r.data),
  getTopic: (topicId: number) =>
    apiClient.get<CrtTopic>(`/crt/topics/${topicId}`).then((r) => r.data),
  getPracticeQuestions: (topicId: number) =>
    apiClient
      .get<CrtQuestionPractice[]>(`/crt/topics/${topicId}/practice`)
      .then((r) => r.data),
  submitPractice: (questionId: number, selectedOption: string) =>
    apiClient
      .post<CrtPracticeResult>("/crt/practice/submit", {
        questionId,
        selectedOption,
      })
      .then((r) => r.data),

  listTests: (categoryId?: number) =>
    apiClient
      .get<CrtTest[]>("/crt/tests", {
        params: categoryId ? { categoryId } : {},
      })
      .then((r) => r.data),
  getTest: (testId: number) =>
    apiClient.get<CrtTest>(`/crt/tests/${testId}`).then((r) => r.data),
  startTest: (testId: number) =>
    apiClient
      .post<CrtTestAttemptStart>(`/crt/tests/${testId}/start`)
      .then((r) => r.data),
  submitTest: (
    attemptId: number,
    answers: { questionId: number; selectedOption: string | null }[],
    timeTakenSeconds: number,
  ) =>
    apiClient
      .post<CrtTestResult>(`/crt/attempts/${attemptId}/submit`, {
        answers,
        timeTakenSeconds,
      })
      .then((r) => r.data),
  listMyAttempts: () =>
    apiClient.get<CrtTestResult[]>("/crt/attempts").then((r) => r.data),

  // Admin
  createTopic: (payload: Partial<CrtTopic>) =>
    apiClient.post("/admin/crt/topics", payload).then((r) => r.data),
  updateTopic: (id: number, payload: Partial<CrtTopic>) =>
    apiClient.put(`/admin/crt/topics/${id}`, payload).then((r) => r.data),
  deleteTopic: (id: number) =>
    apiClient.delete(`/admin/crt/topics/${id}`).then((r) => r.data),
  listQuestionsAdmin: (topicId: number) =>
    apiClient
      .get<CrtQuestionAdmin[]>(`/admin/crt/topics/${topicId}/questions`)
      .then((r) => r.data),
  createQuestion: (payload: Partial<CrtQuestionAdmin>) =>
    apiClient.post("/admin/crt/questions", payload).then((r) => r.data),
  updateQuestion: (id: number, payload: Partial<CrtQuestionAdmin>) =>
    apiClient.put(`/admin/crt/questions/${id}`, payload).then((r) => r.data),
  deleteQuestion: (id: number) =>
    apiClient.delete(`/admin/crt/questions/${id}`).then((r) => r.data),
  createTest: (payload: any) =>
    apiClient.post("/admin/crt/tests", payload).then((r) => r.data),
  updateTest: (id: number, payload: any) =>
    apiClient.put(`/admin/crt/tests/${id}`, payload).then((r) => r.data),
  deleteTest: (id: number) =>
    apiClient.delete(`/admin/crt/tests/${id}`).then((r) => r.data),
};
