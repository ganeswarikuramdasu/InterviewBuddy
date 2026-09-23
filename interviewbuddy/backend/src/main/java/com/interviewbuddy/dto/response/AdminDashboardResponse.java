package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalUsers;
    private long totalAdmins;
    private long totalCodingProblems;
    private long totalCrtQuestions;
    private long totalInterviewSessions;
    private long totalLearningResources;
    private long totalSubmissions;
    private List<RecentUser> recentRegistrations;

    @Data
    @Builder
    @AllArgsConstructor
    public static class RecentUser {
        private Long id;
        private String fullName;
        private String email;
        private String createdAt;
    }
}
