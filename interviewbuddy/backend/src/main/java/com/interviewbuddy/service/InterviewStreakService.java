package com.interviewbuddy.service;

import com.interviewbuddy.dto.response.InterviewStreakCalendarResponse;
import com.interviewbuddy.dto.response.InterviewStreakOverviewResponse;

import java.time.LocalDate;

/**
 * Daily interview practice streak logic. Streaks are derived from actual
 * practice-day records (one per user per calendar date), never from simple
 * activity counters.
 */
public interface InterviewStreakService {

    InterviewStreakOverviewResponse getOverview(Long userId);

    InterviewStreakCalendarResponse getCalendar(Long userId, int months);

    /**
     * Records a completed interview activity as a practice day for the user.
     * Idempotent: at most one practice day per user per calendar date, so
     * multiple completions on the same day never inflate the streak.
     */
    void recordCompletedSession(Long userId, Long referenceId, LocalDate completedDate);

    /**
     * Derives and stores practice days from already-completed interview
     * sessions (existing data). Idempotent - existing streak days are kept.
     *
     * @return number of new streak days created
     */
    int backfillPracticeDays();
}