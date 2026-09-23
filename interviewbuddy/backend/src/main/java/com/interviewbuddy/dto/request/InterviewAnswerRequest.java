package com.interviewbuddy.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InterviewAnswerRequest {
    @NotNull(message = "Answer id is required")
    private Long answerId;

    private String answerText;
}
