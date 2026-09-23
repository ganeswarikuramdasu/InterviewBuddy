package com.interviewbuddy.service.impl;

import com.interviewbuddy.dto.request.InterviewAnswerRequest;
import com.interviewbuddy.dto.request.InterviewStartRequest;
import com.interviewbuddy.dto.response.*;
import com.interviewbuddy.entity.*;
import com.interviewbuddy.exception.BadRequestException;
import com.interviewbuddy.exception.ConflictException;
import com.interviewbuddy.exception.ResourceNotFoundException;
import com.interviewbuddy.repository.*;
import com.interviewbuddy.service.AIInterviewService;
import com.interviewbuddy.service.InterviewEvaluationResult;
import com.interviewbuddy.service.InterviewSessionService;
import com.interviewbuddy.service.InterviewStreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewSessionServiceImpl implements InterviewSessionService {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final InterviewEvaluationRepository evaluationRepository;
    private final AIInterviewService aiInterviewService;
    private final InterviewStreakService interviewStreakService;

    @Override
    @Transactional
    public InterviewSessionStartResponse startSession(Long userId, InterviewStartRequest request) {
        int count = request.getNumberOfQuestions() != null ? request.getNumberOfQuestions() : 5;
        List<InterviewQuestion> questions = aiInterviewService.selectQuestions(
                request.getRole(), request.getInterviewType(), request.getDifficulty(), count);

        if (questions.isEmpty()) {
            throw new BadRequestException("No interview questions are available for this role yet. Please try a different role or ask an admin to add questions.");
        }

        InterviewSession session = InterviewSession.builder()
                .userId(userId)
                .role(request.getRole())
                .interviewType(request.getInterviewType())
                .difficulty(request.getDifficulty())
                .totalQuestions(questions.size())
                .topics(request.getTopics() == null ? null : String.join(", ", request.getTopics()))
                .durationMinutes(request.getDurationMinutes())
                .status(SessionStatus.IN_PROGRESS)
                .build();
        session = sessionRepository.save(session);

        List<InterviewQuestionDto> questionDtos = new java.util.ArrayList<>();
        int order = 1;
        for (InterviewQuestion q : questions) {
            InterviewAnswer answer = InterviewAnswer.builder()
                    .sessionId(session.getId())
                    .questionText(q.getQuestionText())
                    .displayOrder(order)
                    .build();
            answer = answerRepository.save(answer);
            questionDtos.add(InterviewQuestionDto.builder()
                    .answerId(answer.getId())
                    .order(order)
                    .questionText(q.getQuestionText())
                    .build());
            order++;
        }

        return InterviewSessionStartResponse.builder()
                .sessionId(session.getId())
                .role(session.getRole())
                .interviewType(session.getInterviewType().name())
                .difficulty(session.getDifficulty().name())
                .topics(parseTopics(session.getTopics()))
                .durationMinutes(session.getDurationMinutes())
                .questions(questionDtos)
                .build();
    }

    @Override
    @Transactional
    public InterviewSessionResultResponse submitAnswer(Long userId, Long sessionId, InterviewAnswerRequest request) {
        InterviewSession session = findSession(sessionId, userId);
        if (session.getStatus() == SessionStatus.COMPLETED) {
            throw new ConflictException("This interview session has already been completed");
        }

        InterviewAnswer answer = answerRepository.findById(request.getAnswerId())
                .orElseThrow(() -> new ResourceNotFoundException("Answer slot not found"));
        if (!answer.getSessionId().equals(sessionId)) {
            throw new BadRequestException("This answer does not belong to the given session");
        }

        answer.setAnswerText(request.getAnswerText());
        answerRepository.save(answer);

        InterviewEvaluationResult result = aiInterviewService.evaluateAnswer(
                session.getRole(), session.getInterviewType(), answer.getQuestionText(), request.getAnswerText());

        InterviewEvaluation evaluation = evaluationRepository.findByAnswerId(answer.getId())
                .orElse(InterviewEvaluation.builder().answerId(answer.getId()).build());
        evaluation.setRelevanceScore(result.getRelevanceScore());
        evaluation.setTechnicalScore(result.getTechnicalScore());
        evaluation.setCommunicationScore(result.getCommunicationScore());
        evaluation.setClarityScore(result.getClarityScore());
        evaluation.setFeedback(result.getFeedback());
        evaluation.setImprovementSuggestions(result.getImprovementSuggestions());
        evaluationRepository.save(evaluation);

        return buildResult(session);
    }

    @Override
    @Transactional
    public InterviewSessionResultResponse finishSession(Long userId, Long sessionId) {
        InterviewSession session = findSession(sessionId, userId);
        if (session.getStatus() == SessionStatus.COMPLETED) {
            return buildResult(session);
        }

        List<InterviewAnswer> answers = answerRepository.findBySessionIdOrderByDisplayOrderAsc(sessionId);
        List<InterviewEvaluation> evaluations = answers.stream()
                .map(a -> evaluationRepository.findByAnswerId(a.getId()).orElse(null))
                .filter(java.util.Objects::nonNull)
                .toList();

        session.setOverallScore(average(evaluations.stream().map(this::overallOf).toList()));
        session.setRelevanceScore(average(evaluations.stream().map(InterviewEvaluation::getRelevanceScore).toList()));
        session.setTechnicalScore(average(evaluations.stream().map(InterviewEvaluation::getTechnicalScore).toList()));
        session.setCommunicationScore(average(evaluations.stream().map(InterviewEvaluation::getCommunicationScore).toList()));
        session.setClarityScore(average(evaluations.stream().map(InterviewEvaluation::getClarityScore).toList()));
        session.setSummaryFeedback(buildSummary(session, evaluations.size(), answers.size()));
        session.setStatus(SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());
        sessionRepository.save(session);

        // Mark this calendar day as a practice day for the user's InterviewStreak.
        // Idempotent: multiple completions on the same day still count once.
        interviewStreakService.recordCompletedSession(userId, session.getId(), session.getCompletedAt().toLocalDate());

        return buildResult(session);
    }

    @Override
    public List<InterviewSessionResultResponse> listHistory(Long userId) {
        return sessionRepository.findByUserIdOrderByStartedAtDesc(userId).stream()
                .map(this::buildResult)
                .toList();
    }

    @Override
    public InterviewSessionResultResponse getSession(Long userId, Long sessionId) {
        return buildResult(findSession(sessionId, userId));
    }

    private InterviewSession findSession(Long sessionId, Long userId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview session not found"));
        if (!session.getUserId().equals(userId)) {
            throw new BadRequestException("This session does not belong to the current user");
        }
        return session;
    }

    private InterviewSessionResultResponse buildResult(InterviewSession session) {
        List<InterviewAnswer> answers = answerRepository.findBySessionIdOrderByDisplayOrderAsc(session.getId());
        List<InterviewSessionResultResponse.AnswerReview> reviews = answers.stream()
                .map(a -> {
                    InterviewEvaluation eval = evaluationRepository.findByAnswerId(a.getId()).orElse(null);
                    InterviewEvaluationResponse evalDto = eval == null ? null : InterviewEvaluationResponse.builder()
                            .answerId(a.getId())
                            .relevanceScore(eval.getRelevanceScore())
                            .technicalScore(eval.getTechnicalScore())
                            .communicationScore(eval.getCommunicationScore())
                            .clarityScore(eval.getClarityScore())
                            .feedback(eval.getFeedback())
                            .improvementSuggestions(eval.getImprovementSuggestions())
                            .build();
                    return InterviewSessionResultResponse.AnswerReview.builder()
                            .answerId(a.getId())
                            .questionText(a.getQuestionText())
                            .answerText(a.getAnswerText())
                            .evaluation(evalDto)
                            .build();
                })
                .toList();

        return InterviewSessionResultResponse.builder()
                .sessionId(session.getId())
                .role(session.getRole())
                .interviewType(session.getInterviewType().name())
                .difficulty(session.getDifficulty().name())
                .topics(parseTopics(session.getTopics()))
                .durationMinutes(session.getDurationMinutes())
                .status(session.getStatus().name())
                .overallScore(session.getOverallScore())
                .relevanceScore(session.getRelevanceScore())
                .technicalScore(session.getTechnicalScore())
                .communicationScore(session.getCommunicationScore())
                .clarityScore(session.getClarityScore())
                .summaryFeedback(session.getSummaryFeedback())
                .startedAt(session.getStartedAt())
                .completedAt(session.getCompletedAt())
                .answers(reviews)
                .build();
    }

    private BigDecimal overallOf(InterviewEvaluation e) {
        return average(List.of(e.getRelevanceScore(), e.getTechnicalScore(), e.getCommunicationScore(), e.getClarityScore()));
    }

    private BigDecimal average(List<BigDecimal> values) {
        List<BigDecimal> nonNull = values.stream().filter(java.util.Objects::nonNull).toList();
        if (nonNull.isEmpty()) return BigDecimal.ZERO;
        BigDecimal sum = nonNull.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        return sum.divide(BigDecimal.valueOf(nonNull.size()), 2, RoundingMode.HALF_UP);
    }

    private String buildSummary(InterviewSession session, int evaluatedCount, int totalCount) {
        boolean aiPowered = aiInterviewService.isAiPowered();
        String base = String.format("Completed %d/%d questions for the %s %s interview. Overall score: %s/100.",
                evaluatedCount, totalCount, session.getRole(), session.getInterviewType(), session.getOverallScore());
        return aiPowered ? base : base + " (Note: scored using the non-AI heuristic evaluator because GEMINI_API_KEY is not configured on the server.)";
    }

    private List<String> parseTopics(String topics) {
        if (topics == null || topics.isBlank()) return List.of();
        return java.util.Arrays.stream(topics.split("\\s*,\\s*"))
                .filter(s -> !s.isBlank())
                .toList();
    }
}
