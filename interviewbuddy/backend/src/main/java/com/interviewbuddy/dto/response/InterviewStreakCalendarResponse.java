package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

/**
 * Calendar data for the InterviewStreak heatmap/history: the server's
 * reference "today" plus the distinct days on which the user practiced.
 */
@Data
@Builder
@AllArgsConstructor
public class InterviewStreakCalendarResponse {

    private LocalDate today;
    private List<PracticeDay> practiceDays;

    @Data
    @Builder
    @AllArgsConstructor
    public static class PracticeDay {
        private LocalDate date;
        private Long referenceId;
    }
}