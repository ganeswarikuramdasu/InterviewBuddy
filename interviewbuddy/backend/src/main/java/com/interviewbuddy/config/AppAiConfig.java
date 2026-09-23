package com.interviewbuddy.config;

import com.interviewbuddy.repository.InterviewQuestionRepository;
import com.interviewbuddy.service.AIInterviewService;
import com.interviewbuddy.service.impl.GeminiAIInterviewService;
import com.interviewbuddy.service.impl.HeuristicAIInterviewService;
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
 * Wires up exactly one AIInterviewService bean:
 *  - GeminiAIInterviewService when GEMINI_API_KEY is a non-blank value.
 *  - HeuristicAIInterviewService (graceful, clearly-labelled fallback) otherwise.
 *
 * As with AppExecutionConfig, explicit Condition classes are used instead of
 * @ConditionalOnProperty because application.yml always defines app.ai.gemini.api-key
 * (defaulting to an empty string), which @ConditionalOnProperty would treat as "present".
 */
@Configuration
@Slf4j
public class AppAiConfig {

    static class GeminiConfiguredCondition implements Condition {
        @Override
        public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
            return StringUtils.hasText(context.getEnvironment().getProperty("app.ai.gemini.api-key"));
        }
    }

    static class GeminiNotConfiguredCondition implements Condition {
        @Override
        public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
            return !StringUtils.hasText(context.getEnvironment().getProperty("app.ai.gemini.api-key"));
        }
    }

    @Bean
    @Conditional(GeminiConfiguredCondition.class)
    public AIInterviewService geminiAIInterviewService(
            WebClient.Builder builder,
            InterviewQuestionRepository questionRepository,
            @Value("${app.ai.gemini.base-url}") String baseUrl,
            @Value("${app.ai.gemini.api-key}") String apiKey,
            @Value("${app.ai.gemini.model}") String model) {
        log.info("Configuring GeminiAIInterviewService (model: {})", model);
        return new GeminiAIInterviewService(builder, questionRepository, baseUrl, apiKey, model);
    }

    @Bean
    @Conditional(GeminiNotConfiguredCondition.class)
    public AIInterviewService heuristicAIInterviewService(InterviewQuestionRepository questionRepository) {
        log.warn("No GEMINI_API_KEY configured - using HeuristicAIInterviewService " +
                 "(non-AI heuristic fallback). See README 'Gemini API Setup' to enable real AI evaluation.");
        return new HeuristicAIInterviewService(questionRepository);
    }
}
