package com.interviewbuddy.service;

import com.interviewbuddy.entity.TestCase;

import java.util.List;

/**
 * Abstraction over "run this submitted source code against these test cases".
 *
 * IMPORTANT (see project spec / README "Known Limitations"):
 * This project intentionally does NOT implement an in-process arbitrary code execution
 * sandbox inside the Spring Boot application — running untrusted user-submitted code
 * in the same JVM/process as the rest of the platform is a serious security risk
 * (arbitrary file/network/system access, resource exhaustion, etc.).
 *
 * Two implementations are provided:
 *  - RemoteJudgeCodeExecutionService: sends code to an external, sandboxed execution
 *    service (Judge0-compatible REST API) when CODE_EXECUTION_SERVICE_URL is configured.
 *  - DevModeCodeExecutionService (default): a clearly-labelled, non-sandboxed development
 *    fallback used when no execution service is configured, so the platform remains usable
 *    for demos/local development without pretending to provide secure code execution.
 */
public interface CodeExecutionService {
    CodeExecutionResult run(String language, String sourceCode, List<TestCase> testCases);

    /** Whether this implementation performs real, sandboxed execution (vs. dev-mode simulation). */
    boolean isRealExecution();
}
