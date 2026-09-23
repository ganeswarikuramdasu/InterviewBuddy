package com.interviewbuddy.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

/** Internal result object returned by any AIInterviewService.evaluateAnswer() implementation. */
@Data
@Builder
@AllArgsConstructor
public class InterviewEvaluationResult {
    private BigDecimal relevanceScore;      // 0-100
    private BigDecimal technicalScore;      // 0-100
    private BigDecimal communicationScore;  // 0-100
    private BigDecimal clarityScore;        // 0-100
    private String feedback;
    private String improvementSuggestions;
}
