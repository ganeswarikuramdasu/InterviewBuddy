package com.interviewbuddy.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import com.interviewbuddy.entity.SubmissionStatus;

import java.util.List;

/**
 * Internal result object returned by any CodeExecutionService implementation.
 * Not exposed directly over the API (mapped to SubmissionResponse instead).
 */
@Data
@Builder
@AllArgsConstructor
public class CodeExecutionResult {
    private SubmissionStatus status;
    private int passedTestCases;
    private int totalTestCases;
    private Integer executionTimeMs;
    private Integer memoryKb;
    private String stdoutSnippet;
    private List<TestCaseOutcome> outcomes;

    @Data
    @Builder
    @AllArgsConstructor
    public static class TestCaseOutcome {
        private Long testCaseId;
        private boolean passed;
        private boolean sample;
    }
}
