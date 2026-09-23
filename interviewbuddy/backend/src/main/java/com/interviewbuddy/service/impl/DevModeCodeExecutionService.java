package com.interviewbuddy.service.impl;

import com.interviewbuddy.entity.SubmissionStatus;
import com.interviewbuddy.entity.TestCase;
import com.interviewbuddy.service.CodeExecutionResult;
import com.interviewbuddy.service.CodeExecutionService;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

/**
 * DEVELOPMENT-MODE code execution fallback.
 *
 * This implementation does NOT actually compile or run the submitted source code.
 * Running arbitrary, untrusted, user-submitted code safely requires a properly
 * sandboxed execution service (containers/VMs with strict CPU, memory, network,
 * and filesystem isolation) — building that safely is out of scope for this
 * project (see CodeExecutionService javadoc and README "Known Limitations").
 *
 * Instead, this service performs a transparent, deterministic HEURISTIC check so the
 * rest of the platform (submission history, solved-problem tracking, contest scoring)
 * is fully exercisable end-to-end in local/demo environments:
 *   - Empty/starter-only submissions are rejected as WRONG_ANSWER.
 *   - Non-trivial submissions are checked against each test case's expected output
 *     using a simple substring heuristic (does the submitted source "mention" the
 *     expected output literal anywhere, e.g. because the developer hand-wrote the
 *     logic for that case). This is intentionally naive and is clearly surfaced to
 *     the user via `isRealExecution() == false` and a note in the submission response.
 *
 * To get real, secure execution: configure CODE_EXECUTION_SERVICE_URL to point at a
 * Judge0-compatible execution API; RemoteJudgeCodeExecutionService will then be used
 * automatically instead of this class (see AppExecutionConfig, which owns bean creation
 * for this class — it is intentionally NOT a @Service/@Component to avoid a duplicate
 * CodeExecutionService bean alongside RemoteJudgeCodeExecutionService).
 */
@Slf4j
public class DevModeCodeExecutionService implements CodeExecutionService {

    private final int minSolutionLength;

    public DevModeCodeExecutionService(int minSolutionLength) {
        this.minSolutionLength = minSolutionLength;
    }

    @Override
    public CodeExecutionResult run(String language, String sourceCode, List<TestCase> testCases) {
        log.warn("DevModeCodeExecutionService is being used — this is a NON-SANDBOXED, " +
                 "heuristic simulation for local development/demo only. Configure " +
                 "CODE_EXECUTION_SERVICE_URL for real, sandboxed execution.");

        List<CodeExecutionResult.TestCaseOutcome> outcomes = new ArrayList<>();

        boolean looksLikeRealAttempt = sourceCode != null
                && sourceCode.trim().length() >= minSolutionLength
                && !containsOnlyStarterComment(sourceCode);

        String cleanCode = sourceCode == null ? "" : sourceCode.replaceAll("(?m)//.*$", "")
                .replaceAll("(?s)/\\*.*?\\*/", "");

        int passed = 0;
        for (TestCase tc : testCases) {
            boolean pass = looksLikeRealAttempt
                    && cleanCode.replaceAll("\\s+", "").contains(tc.getExpectedOutput().replaceAll("\\s+", ""));
            if (pass) passed++;
            outcomes.add(CodeExecutionResult.TestCaseOutcome.builder()
                    .testCaseId(tc.getId())
                    .passed(pass)
                    .sample(Boolean.TRUE.equals(tc.getIsSample()))
                    .build());
        }

        SubmissionStatus status;
        if (!looksLikeRealAttempt) {
            status = SubmissionStatus.WRONG_ANSWER;
        } else if (passed == testCases.size() && !testCases.isEmpty()) {
            status = SubmissionStatus.ACCEPTED;
        } else {
            status = SubmissionStatus.WRONG_ANSWER;
        }

        return CodeExecutionResult.builder()
                .status(status)
                .passedTestCases(passed)
                .totalTestCases(testCases.size())
                .executionTimeMs(null)
                .memoryKb(null)
                .stdoutSnippet("[DEV MODE] Simulated evaluation — no sandboxed execution service configured. " +
                        passed + "/" + testCases.size() + " test cases matched heuristically.")
                .outcomes(outcomes)
                .build();
    }

    @Override
    public boolean isRealExecution() {
        return false;
    }

    private boolean containsOnlyStarterComment(String code) {
        String stripped = code.replaceAll("(?m)//.*$", "")
                .replaceAll("(?s)/\\*.*?\\*/", "")
                .trim();
        return stripped.isEmpty();
    }
}
