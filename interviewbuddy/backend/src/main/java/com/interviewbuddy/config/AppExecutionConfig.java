package com.interviewbuddy.config;

import com.interviewbuddy.service.CodeExecutionService;
import com.interviewbuddy.service.impl.DevModeCodeExecutionService;
import com.interviewbuddy.service.impl.RemoteJudgeCodeExecutionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.type.AnnotatedTypeMetadata;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Wires up exactly one CodeExecutionService bean based on configuration:
 *  - If CODE_EXECUTION_SERVICE_URL (app.code-execution.base-url) is a non-blank value,
 *    submissions go to a real, sandboxed remote judge (Judge0-compatible API).
 *  - Otherwise, the dev-mode fallback is used (see DevModeCodeExecutionService javadoc).
 *
 * Plain string @ConditionalOnProperty is not used here because application.yml always
 * defines app.code-execution.base-url (defaulting to an empty string via
 * ${CODE_EXECUTION_SERVICE_URL:}), which @ConditionalOnProperty would treat as "present"
 * even when blank. The two Condition classes below explicitly check for a non-blank value.
 */
@Configuration
@Slf4j
public class AppExecutionConfig {

    static class BaseUrlConfiguredCondition implements Condition {
        @Override
        public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
            String url = context.getEnvironment().getProperty("app.code-execution.base-url");
            return StringUtils.hasText(url);
        }
    }

    static class BaseUrlNotConfiguredCondition implements Condition {
        @Override
        public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
            String url = context.getEnvironment().getProperty("app.code-execution.base-url");
            return !StringUtils.hasText(url);
        }
    }

    @Bean
    @Conditional(BaseUrlConfiguredCondition.class)
    public CodeExecutionService remoteJudgeCodeExecutionService(
            WebClient.Builder builder,
            @Value("${app.code-execution.base-url}") String baseUrl) {
        log.info("Configuring RemoteJudgeCodeExecutionService with base URL: {}", baseUrl);
        return new RemoteJudgeCodeExecutionService(builder, baseUrl);
    }

    @Bean
    @Conditional(BaseUrlNotConfiguredCondition.class)
    public CodeExecutionService devModeCodeExecutionService(
            @Value("${app.code-execution.min-solution-length:20}") int minSolutionLength) {
        log.warn("No CODE_EXECUTION_SERVICE_URL configured - using DevModeCodeExecutionService " +
                 "(non-sandboxed heuristic simulation, NOT real code execution). See README.");
        return new DevModeCodeExecutionService(minSolutionLength);
    }
}
