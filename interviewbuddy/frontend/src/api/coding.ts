import { apiClient } from "./client";
import type {
  CodingProblemSummary,
  CodingProblemDetail,
  CodingSheet,
  CodingPattern,
  ProblemProgress,
  Page,
  DifficultyLevel,
  CodingStatus,
} from "../types";

export const codingApi = {
  listSheets: () =>
    apiClient.get<CodingSheet[]>("/coding/sheets").then((r) => r.data),
  listPatterns: () =>
    apiClient.get<CodingPattern[]>("/coding/patterns").then((r) => r.data),
  listProgress: () =>
    apiClient.get<ProblemProgress[]>("/coding/my-progress").then((r) => r.data),

  listProblems: (params: {
    search?: string;
    difficulty?: DifficultyLevel;
    sheetId?: number;
    patternId?: number;
    page?: number;
    size?: number;
  }) =>
    apiClient
      .get<Page<CodingProblemSummary>>("/coding/problems", { params })
      .then((r) => r.data),

  getProblem: (slug: string) =>
    apiClient
      .get<CodingProblemDetail>(`/coding/problems/${slug}`)
      .then((r) => r.data),
  updateStatus: (problemId: number, status: CodingStatus) =>
    apiClient
      .put<CodingProblemDetail>(`/coding/problems/${problemId}/status`, {
        status,
      })
      .then((r) => r.data),
  start: (problemId: number) =>
    apiClient
      .post<CodingProblemDetail>(`/coding/problems/${problemId}/start`)
      .then((r) => r.data),

  // Admin - sheets
  createSheet: (payload: any) =>
    apiClient.post("/admin/coding/sheets", payload).then((r) => r.data),
  updateSheet: (id: number, payload: any) =>
    apiClient.put(`/admin/coding/sheets/${id}`, payload).then((r) => r.data),
  deleteSheet: (id: number) =>
    apiClient.delete(`/admin/coding/sheets/${id}`).then((r) => r.data),

  // Admin - patterns
  createPattern: (payload: any) =>
    apiClient.post("/admin/coding/patterns", payload).then((r) => r.data),
  updatePattern: (id: number, payload: any) =>
    apiClient.put(`/admin/coding/patterns/${id}`, payload).then((r) => r.data),
  deletePattern: (id: number) =>
    apiClient.delete(`/admin/coding/patterns/${id}`).then((r) => r.data),

  // Admin - problems
  createProblem: (payload: any) =>
    apiClient.post("/admin/coding/problems", payload).then((r) => r.data),
  updateProblem: (id: number, payload: any) =>
    apiClient.put(`/admin/coding/problems/${id}`, payload).then((r) => r.data),
  deleteProblem: (id: number) =>
    apiClient.delete(`/admin/coding/problems/${id}`).then((r) => r.data),
};
