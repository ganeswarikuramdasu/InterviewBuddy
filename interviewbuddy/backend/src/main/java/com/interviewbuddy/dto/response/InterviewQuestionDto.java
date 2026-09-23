package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class InterviewQuestionDto {
    private Long answerId;
    private int order;
    private String questionText;
}
