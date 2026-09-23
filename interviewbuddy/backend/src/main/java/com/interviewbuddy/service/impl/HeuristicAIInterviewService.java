package com.interviewbuddy.service.impl;

import com.interviewbuddy.entity.DifficultyLevel;
import com.interviewbuddy.entity.InterviewQuestion;
import com.interviewbuddy.entity.InterviewType;
import com.interviewbuddy.repository.InterviewQuestionRepository;
import com.interviewbuddy.service.AIInterviewService;
import com.interviewbuddy.service.InterviewEvaluationResult;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Fallback AIInterviewService used when GEMINI_API_KEY is not configured.
 *
 * This implementation intentionally does NOT pretend to perform real AI evaluation:
 *  - Questions are selected from the curated interview_questions bank (see seed.sql /
 *    admin "Manage Interview Question Bank") rather than generated.
 *  - Answer "evaluation" uses simple, transparent heuristics (answer length, whether the
 *    answer is non-empty, basic keyword overlap with the question) purely so the rest of
 *    the interview flow (scoring UI, history, dashboards) is exercisable end to end.
 *  - Feedback text always clearly states that full AI-powered evaluation requires
 *    GEMINI_API_KEY to be configured (see README "Gemini API Setup"), per the project
 *    requirement to fail gracefully and explain the missing configuration rather than
 *    silently pretending the feature works.
 */
@Slf4j
public class HeuristicAIInterviewService implements AIInterviewService {

    private final InterviewQuestionRepository questionRepository;

    public HeuristicAIInterviewService(InterviewQuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public List<InterviewQuestion> selectQuestions(String role, InterviewType type, DifficultyLevel difficulty, int count) {
        List<InterviewQuestion> pool = new ArrayList<>(questionRepository.findByRoleAndInterviewType(role, type));

        if (pool.isEmpty()) {
            // Widen the search: any question for the role regardless of type, then any question at all.
            pool = new ArrayList<>(questionRepository.findByRole(role));
        }
        if (pool.isEmpty()) {
            pool = new ArrayList<>(questionRepository.findAll());
        }

        Collections.shuffle(pool);
        return pool.stream().limit(Math.max(count, 1)).toList();
    }

    @Override
    public InterviewEvaluationResult evaluateAnswer(String role, InterviewType type, String questionText, String answerText) {
        boolean hasAnswer = answerText != null && !answerText.isBlank();
        int wordCount = hasAnswer ? answerText.trim().split("\\s+").length : 0;

        BigDecimal relevance = hasAnswer ? overlapScore(questionText, answerText) : BigDecimal.ZERO;
        BigDecimal communication = BigDecimal.valueOf(Math.min(100, wordCount * 4L));
        BigDecimal clarity = hasAnswer ? BigDecimal.valueOf(Math.min(100, 40 + wordCount)) : BigDecimal.ZERO;
        BigDecimal technical = relevance; // no real technical correctness check available without AI

        String feedback = hasAnswer
                ? "Heuristic (non-AI) evaluation: your answer was " + wordCount + " words long and shares some " +
                  "keywords with the question. Configure GEMINI_API_KEY on the server to enable full AI-powered " +
                  "evaluation of technical correctness, communication quality, and detailed feedback."
                : "No answer was provided for this question. Configure GEMINI_API_KEY on the server to enable " +
                  "full AI-powered interview evaluation.";

        String suggestions = "AI-generated improvement suggestions require GEMINI_API_KEY to be configured. " +
                "In the meantime: aim for structured, specific answers that directly address the question asked.";

        return InterviewEvaluationResult.builder()
                .relevanceScore(relevance)
                .technicalScore(technical)
                .communicationScore(communication)
                .clarityScore(clarity)
                .feedback(feedback)
                .improvementSuggestions(suggestions)
                .build();
    }

    @Override
    public boolean isAiPowered() {
        return false;
    }

    private BigDecimal overlapScore(String question, String answer) {
        var qWords = java.util.Arrays.stream(question.toLowerCase().split("\\W+"))
                .filter(w -> w.length() > 3).collect(java.util.stream.Collectors.toSet());
        var aWords = java.util.Arrays.stream(answer.toLowerCase().split("\\W+"))
                .filter(w -> w.length() > 3).collect(java.util.stream.Collectors.toSet());
        if (qWords.isEmpty()) return BigDecimal.valueOf(50);
        long overlap = qWords.stream().filter(aWords::contains).count();
        double pct = Math.min(100, (overlap * 100.0 / qWords.size()) + 30);
        return BigDecimal.valueOf(Math.round(pct));
    }
}
