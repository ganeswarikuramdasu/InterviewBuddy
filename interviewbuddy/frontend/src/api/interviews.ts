import { apiClient } from "./client";
import type {
  InterviewSessionStart,
  InterviewSessionResult,
  DifficultyLevel,
  InterviewType,
} from "../types";

export const interviewsApi = {
  start: (payload: {
    role: string;
    interviewType: InterviewType;
    difficulty: DifficultyLevel;
    numberOfQuestions: number;
    topics?: string[];
    durationMinutes?: number;
  }) =>
    apiClient
      .post<InterviewSessionStart>("/interviews/start", payload)
      .then((r) => r.data),
  answer: (sessionId: number, answerId: number, answerText: string) =>
    apiClient
      .post<InterviewSessionResult>(`/interviews/${sessionId}/answer`, {
        answerId,
        answerText,
      })
      .then((r) => r.data),
  finish: (sessionId: number) =>
    apiClient
      .post<InterviewSessionResult>(`/interviews/${sessionId}/finish`)
      .then((r) => r.data),
  getSession: (sessionId: number) =>
    apiClient
      .get<InterviewSessionResult>(`/interviews/${sessionId}`)
      .then((r) => r.data),
  history: () =>
    apiClient
      .get<InterviewSessionResult[]>("/interviews/history")
      .then((r) => r.data),
};
