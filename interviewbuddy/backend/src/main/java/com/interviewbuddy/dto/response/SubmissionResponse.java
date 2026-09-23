package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class SubmissionResponse {
    private Long id;
    private Long problemId;
    private String problemTitle;
    private String language;
    private String status;
    private Integer passedTestCases;
    private Integer totalTestCases;
    private Integer executionTimeMs;
    private String stdoutSnippet;
    private LocalDateTime createdAt;
}
