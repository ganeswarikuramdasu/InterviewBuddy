package com.interviewbuddy.service;

import com.interviewbuddy.entity.SubmissionStatus;
import com.interviewbuddy.entity.TestCase;
import com.interviewbuddy.service.impl.DevModeCodeExecutionService;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class DevModeCodeExecutionServiceTest {

    private final DevModeCodeExecutionService service = new DevModeCodeExecutionService(20);

    @Test
    void run_rejectsEmptySubmission_asWrongAnswer() {
        TestCase tc = TestCase.builder().id(1L).problemId(1L).inputData("in").expectedOutput("42").isSample(true).build();

        CodeExecutionResult result = service.run("javascript", "", List.of(tc));

        assertEquals(SubmissionStatus.WRONG_ANSWER, result.getStatus());
        assertEquals(0, result.getPassedTestCases());
        assertFalse(service.isRealExecution());
    }

    @Test
    void run_acceptsSubmission_whenAllExpectedOutputsPresentInSource() {
        TestCase tc1 = TestCase.builder().id(1L).problemId(1L).inputData("in1").expectedOutput("[0,1]").isSample(true).build();
        TestCase tc2 = TestCase.builder().id(2L).problemId(1L).inputData("in2").expectedOutput("[1,2]").isSample(false).build();

        String fakeSolution = "function twoSum(nums, target) { /* returns [0,1] or [1,2] depending on input */ return [0,1]; }";

        CodeExecutionResult result = service.run("javascript", fakeSolution, List.of(tc1, tc2));

        // Only tc1's expected output literally appears in the source, so only 1/2 should pass.
        assertEquals(1, result.getPassedTestCases());
        assertEquals(2, result.getTotalTestCases());
        assertEquals(SubmissionStatus.WRONG_ANSWER, result.getStatus());
    }
}
