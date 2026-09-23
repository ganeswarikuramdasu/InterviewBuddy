package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class CrtTestAttemptStartResponse {
    private Long attemptId;
    private Long testId;
    private String title;
    private Integer durationMinutes;
    private List<CrtQuestionPracticeResponse> questions;
}
