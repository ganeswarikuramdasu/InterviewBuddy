package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * Streak statistics for the current user, calculated from their actual
 * practice days (never blindly incremented counters).
 */
@Data
@Builder
@AllArgsConstructor
public class InterviewStreakOverviewResponse {

    private int currentStreak;
    private int longestStreak;
    private int totalPracticeDays;
    private boolean todayCompleted;
    private LocalDate lastPracticeDate;
    private LocalDate today;
}