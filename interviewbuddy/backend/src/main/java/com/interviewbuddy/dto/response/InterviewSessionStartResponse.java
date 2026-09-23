package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class InterviewSessionStartResponse {
    private Long sessionId;
    private String role;
    private String interviewType;
    private String difficulty;
    private List<String> topics;
    private Integer durationMinutes;
    private List<InterviewQuestionDto> questions;
}
