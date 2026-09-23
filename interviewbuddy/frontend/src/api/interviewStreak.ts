import { apiClient } from "./client";
import type {
  InterviewStreakCalendar,
  InterviewStreakOverview,
} from "../types";

export const interviewStreakApi = {
  overview: () =>
    apiClient
      .get<InterviewStreakOverview>("/interview-streak")
      .then((r) => r.data),
  calendar: (months = 6) =>
    apiClient
      .get<InterviewStreakCalendar>("/interview-streak/calendar", {
        params: { months },
      })
      .then((r) => r.data),
};