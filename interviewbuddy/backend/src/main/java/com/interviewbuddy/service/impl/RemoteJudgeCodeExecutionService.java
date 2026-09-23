package com.interviewbuddy.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.interviewbuddy.entity.SubmissionStatus;
import com.interviewbuddy.entity.TestCase;
import com.interviewbuddy.service.CodeExecutionResult;
import com.interviewbuddy.service.CodeExecutionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Sends submissions to an external, sandboxed, Judge0-compatible code execution API
 * (https://github.com/judge0/judge0) when CODE_EXECUTION_SERVICE_URL is configured.
 *
 * This class performs real network calls and is only wired up as the active
 * CodeExecutionService bean when a base URL is present (see AppExecutionConfig).
 * It has not been exercised against a live Judge0 instance in this development
 * environment (no outbound network access here) — review/test against your actual
 * Judge0 deployment before relying on it in production. Language IDs below follow
 * Judge0's default language table; adjust as needed for your instance.
 */
@Slf4j
public class RemoteJudgeCodeExecutionService implements CodeExecutionService {

    private final WebClient webClient;

    public RemoteJudgeCodeExecutionService(WebClient.Builder builder,
                                            @Value("${app.code-execution.base-url}") String baseUrl) {
        this.webClient = builder.baseUrl(baseUrl).build();
    }

    private static final Map<String, Integer> LANGUAGE_IDS = Map.of(
            "javascript", 63,
            "python", 71,
            "java", 62,
            "cpp", 54,
            "c", 50
    );

    @Override
    public CodeExecutionResult run(String language, String sourceCode, List<TestCase> testCases) {
        Integer languageId = LANGUAGE_IDS.get(language.toLowerCase());
        if (languageId == null) {
            return CodeExecutionResult.builder()
                    .status(SubmissionStatus.COMPILE_ERROR)
                    .passedTestCases(0)
                    .totalTestCases(testCases.size())
                    .stdoutSnippet("Unsupported language for remote execution: " + language)
                    .outcomes(List.of())
                    .build();
        }

        List<CodeExecutionResult.TestCaseOutcome> outcomes = new ArrayList<>();
        int passed = 0;
        String lastOutput = "";

        for (TestCase tc : testCases) {
            try {
                Map<String, Object> body = Map.of(
                        "source_code", sourceCode,
                        "language_id", languageId,
                        "stdin", tc.getInputData(),
                        "expected_output", tc.getExpectedOutput()
                );

                JsonNode response = webClient.post()
                        .uri("/submissions?base64_encoded=false&wait=true")
                        .bodyValue(body)
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .block();

                boolean pass = response != null
                        && response.has("status")
                        && response.get("status").get("id").asInt() == 3; // 3 == Accepted in Judge0

                if (pass) passed++;
                lastOutput = response != null && response.has("stdout") ? response.get("stdout").asText() : "";

                outcomes.add(CodeExecutionResult.TestCaseOutcome.builder()
                        .testCaseId(tc.getId())
                        .passed(pass)
                        .sample(Boolean.TRUE.equals(tc.getIsSample()))
                        .build());
            } catch (Exception ex) {
                log.error("Remote judge call failed for test case {}: {}", tc.getId(), ex.getMessage());
                outcomes.add(CodeExecutionResult.TestCaseOutcome.builder()
                        .testCaseId(tc.getId()).passed(false).sample(Boolean.TRUE.equals(tc.getIsSample())).build());
            }
        }

        SubmissionStatus status = (passed == testCases.size() && !testCases.isEmpty())
                ? SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER;

        return CodeExecutionResult.builder()
                .status(status)
                .passedTestCases(passed)
                .totalTestCases(testCases.size())
                .stdoutSnippet(lastOutput.length() > 500 ? lastOutput.substring(0, 500) : lastOutput)
                .outcomes(outcomes)
                .build();
    }

    @Override
    public boolean isRealExecution() {
        return true;
    }
}
