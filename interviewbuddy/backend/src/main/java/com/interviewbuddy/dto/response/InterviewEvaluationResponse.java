package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class InterviewEvaluationResponse {
    private Long answerId;
    private BigDecimal relevanceScore;
    private BigDecimal technicalScore;
    private BigDecimal communicationScore;
    private BigDecimal clarityScore;
    private String feedback;
    private String improvementSuggestions;
}
