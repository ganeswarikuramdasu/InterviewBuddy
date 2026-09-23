package com.interviewbuddy.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewbuddy.entity.DifficultyLevel;
import com.interviewbuddy.entity.InterviewQuestion;
import com.interviewbuddy.entity.InterviewType;
import com.interviewbuddy.repository.InterviewQuestionRepository;
import com.interviewbuddy.service.AIInterviewService;
import com.interviewbuddy.service.InterviewEvaluationResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Real AI-powered implementation backed by the Google Gemini API.
 * Only activated when GEMINI_API_KEY is configured (see AppAiConfig).
 *
 * Question selection still draws from the curated interview_questions bank (kept
 * consistent and moderated by admins) rather than freely generating arbitrary
 * questions, but answer evaluation is delegated to Gemini for genuine AI feedback.
 *
 * This class performs real network calls and has not been exercised against the
 * live Gemini API in this development environment (no outbound network access
 * here) — verify against your own API key before relying on it in production.
 */
@Slf4j
public class GeminiAIInterviewService implements AIInterviewService {

    private final WebClient webClient;
    private final InterviewQuestionRepository questionRepository;
    private final String apiKey;
    private final String model;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GeminiAIInterviewService(WebClient.Builder builder, InterviewQuestionRepository questionRepository,
                                     String baseUrl, String apiKey, String model) {
        this.webClient = builder.baseUrl(baseUrl).build();
        this.questionRepository = questionRepository;
        this.apiKey = apiKey;
        this.model = model;
    }

    @Override
    public List<InterviewQuestion> selectQuestions(String role, InterviewType type, DifficultyLevel difficulty, int count) {
        List<InterviewQuestion> pool = questionRepository.findByRoleAndInterviewType(role, type);
        if (pool.isEmpty()) pool = questionRepository.findByRole(role);
        if (pool.isEmpty()) pool = questionRepository.findAll();
        java.util.List<InterviewQuestion> shuffled = new java.util.ArrayList<>(pool);
        java.util.Collections.shuffle(shuffled);
        return shuffled.stream().limit(Math.max(count, 1)).toList();
    }

    @Override
    public InterviewEvaluationResult evaluateAnswer(String role, InterviewType type, String questionText, String answerText) {
        try {
            String prompt = buildPrompt(role, type, questionText, answerText);

            Map<String, Object> body = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
            );

            String response = webClient.post()
                    .uri("/models/{model}:generateContent?key={key}", model, apiKey)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return parseResponse(response);
        } catch (Exception ex) {
            log.error("Gemini evaluation call failed, falling back to a neutral score: {}", ex.getMessage());
            return InterviewEvaluationResult.builder()
                    .relevanceScore(BigDecimal.ZERO)
                    .technicalScore(BigDecimal.ZERO)
                    .communicationScore(BigDecimal.ZERO)
                    .clarityScore(BigDecimal.ZERO)
                    .feedback("AI evaluation temporarily unavailable (the Gemini API call failed). Please try again shortly.")
                    .improvementSuggestions("N/A")
                    .build();
        }
    }

    @Override
    public boolean isAiPowered() {
        return true;
    }

    private String buildPrompt(String role, InterviewType type, String questionText, String answerText) {
        return "You are an expert technical interviewer evaluating a candidate's answer for a " + role +
                " " + type + " interview. Question: \"" + questionText + "\". Candidate answer: \"" +
                (answerText == null ? "" : answerText) + "\". " +
                "Score the answer from 0-100 on: relevance, technical correctness (if applicable), " +
                "communication clarity, and overall clarity. Respond ONLY with strict JSON in this exact shape: " +
                "{\"relevanceScore\":0,\"technicalScore\":0,\"communicationScore\":0,\"clarityScore\":0," +
                "\"feedback\":\"...\",\"improvementSuggestions\":\"...\"}. Do not include markdown fences.";
    }

    private InterviewEvaluationResult parseResponse(String rawResponse) throws Exception {
        JsonNode root = objectMapper.readTree(rawResponse);
        String text = root.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText("{}");
        text = text.replaceAll("```json", "").replaceAll("```", "").trim();

        JsonNode json = objectMapper.readTree(text);
        return InterviewEvaluationResult.builder()
                .relevanceScore(BigDecimal.valueOf(json.path("relevanceScore").asDouble(0)))
                .technicalScore(BigDecimal.valueOf(json.path("technicalScore").asDouble(0)))
                .communicationScore(BigDecimal.valueOf(json.path("communicationScore").asDouble(0)))
                .clarityScore(BigDecimal.valueOf(json.path("clarityScore").asDouble(0)))
                .feedback(json.path("feedback").asText(""))
                .improvementSuggestions(json.path("improvementSuggestions").asText(""))
                .build();
    }
}
