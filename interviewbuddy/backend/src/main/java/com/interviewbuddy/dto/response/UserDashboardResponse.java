package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
public class UserDashboardResponse {
    private String fullName;

    // CRT
    private long crtPracticeAttempts;
    private long crtPracticeCorrect;
    private double crtAccuracy;
    private long crtTestsTaken;
    private double crtAverageTestScore;

    // Coding
    private long problemsSolved;
    private long totalSubmissions;
    private Map<String, Long> solvedByDifficulty;

    // Interview
    private long interviewsCompleted;
    private double averageInterviewScore;

    // Learning
    private long learningResourcesCompleted;
    private long totalLearningResources;

    private List<RecentActivity> recentActivity;

    @Data
    @Builder
    @AllArgsConstructor
    public static class RecentActivity {
        private String type;       // CRT_TEST, SUBMISSION, CONTEST, INTERVIEW, LEARNING
        private String description;
        private String timestamp;
    }
}
