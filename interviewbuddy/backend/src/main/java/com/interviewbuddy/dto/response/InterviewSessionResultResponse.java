package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class InterviewSessionResultResponse {
    private Long sessionId;
    private String role;
    private String interviewType;
    private String difficulty;
    private List<String> topics;
    private Integer durationMinutes;
    private String status;
    private BigDecimal overallScore;
    private BigDecimal relevanceScore;
    private BigDecimal technicalScore;
    private BigDecimal communicationScore;
    private BigDecimal clarityScore;
    private String summaryFeedback;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private List<AnswerReview> answers;

    @Data
    @Builder
    @AllArgsConstructor
    public static class AnswerReview {
        private Long answerId;
        private String questionText;
        private String answerText;
        private InterviewEvaluationResponse evaluation;
    }
}
