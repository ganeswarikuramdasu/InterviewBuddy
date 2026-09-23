package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CrtPracticeResultResponse {
    private Long questionId;
    private boolean correct;
    private String correctOption;
    private String explanation;
    private long userAttempts;
    private long userCorrectAttempts;
}
