package com.interviewbuddy.service;

import com.interviewbuddy.entity.DifficultyLevel;
import com.interviewbuddy.entity.InterviewQuestion;
import com.interviewbuddy.entity.InterviewType;

import java.util.List;

/**
 * Abstraction for AI-driven interview question selection/generation and answer evaluation.
 *
 * Two implementations are provided (see AppAiConfig for bean selection):
 *  - GeminiAIInterviewService: calls the Google Gemini API when GEMINI_API_KEY is configured.
 *  - HeuristicAIInterviewService: a transparent, clearly-labelled fallback used when no key is
 *    configured, so the Interview module remains usable (question bank + simple heuristic
 *    scoring) without ever pretending to be real AI evaluation. See its javadoc.
 */
public interface AIInterviewService {

    List<InterviewQuestion> selectQuestions(String role, InterviewType type, DifficultyLevel difficulty, int count);

    InterviewEvaluationResult evaluateAnswer(String role, InterviewType type, String questionText, String answerText);

    /** Whether this implementation is backed by a real AI model call. */
    boolean isAiPowered();
}
