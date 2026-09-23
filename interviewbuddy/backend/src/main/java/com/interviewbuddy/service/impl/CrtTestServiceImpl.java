package com.interviewbuddy.service.impl;

import com.interviewbuddy.dto.request.CrtTestRequest;
import com.interviewbuddy.dto.request.CrtTestSubmitRequest;
import com.interviewbuddy.dto.response.*;
import com.interviewbuddy.entity.*;
import com.interviewbuddy.exception.BadRequestException;
import com.interviewbuddy.exception.ConflictException;
import com.interviewbuddy.exception.ResourceNotFoundException;
import com.interviewbuddy.repository.*;
import com.interviewbuddy.service.CrtTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CrtTestServiceImpl implements CrtTestService {

    private final CrtTestRepository testRepository;
    private final CrtTestQuestionRepository testQuestionRepository;
    private final CrtQuestionRepository questionRepository;
    private final CrtCategoryRepository categoryRepository;
    private final CrtTestAttemptRepository attemptRepository;
    private final CrtTestAttemptAnswerRepository attemptAnswerRepository;

    @Override
    public List<CrtTestResponse> listTests(Long categoryId) {
        List<CrtTest> tests = categoryId != null
                ? testRepository.findByCategoryIdAndIsPublishedTrue(categoryId)
                : testRepository.findAll().stream().filter(CrtTest::getIsPublished).toList();
        return tests.stream().map(this::toResponse).toList();
    }

    @Override
    public CrtTestResponse getTest(Long testId) {
        return toResponse(findTest(testId));
    }

    @Override
    @Transactional
    public CrtTestAttemptStartResponse startAttempt(Long userId, Long testId) {
        CrtTest test = findTest(testId);
        List<CrtTestQuestion> links = testQuestionRepository.findByTestIdOrderByDisplayOrderAsc(testId);
        if (links.isEmpty()) {
            throw new BadRequestException("This test has no questions configured yet");
        }

        CrtTestAttempt attempt = CrtTestAttempt.builder()
                .testId(testId)
                .userId(userId)
                .totalQuestions(links.size())
                .status(AttemptStatus.IN_PROGRESS)
                .build();
        attempt = attemptRepository.save(attempt);

        List<CrtQuestionPracticeResponse> questions = links.stream()
                .map(l -> questionRepository.findById(l.getQuestionId()).orElseThrow())
                .map(q -> CrtQuestionPracticeResponse.builder()
                        .id(q.getId())
                        .topicId(q.getTopicId())
                        .questionText(q.getQuestionText())
                        .optionA(q.getOptionA())
                        .optionB(q.getOptionB())
                        .optionC(q.getOptionC())
                        .optionD(q.getOptionD())
                        .difficulty(q.getDifficulty().name())
                        .build())
                .toList();

        return CrtTestAttemptStartResponse.builder()
                .attemptId(attempt.getId())
                .testId(test.getId())
                .title(test.getTitle())
                .durationMinutes(test.getDurationMinutes())
                .questions(questions)
                .build();
    }

    @Override
    @Transactional
    public CrtTestResultResponse submitAttempt(Long userId, Long attemptId, CrtTestSubmitRequest request) {
        CrtTestAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));

        if (!attempt.getUserId().equals(userId)) {
            throw new BadRequestException("This attempt does not belong to the current user");
        }
        if (attempt.getStatus() == AttemptStatus.SUBMITTED) {
            throw new ConflictException("This test attempt has already been submitted");
        }

        CrtTest test = findTest(attempt.getTestId());
        List<CrtTestQuestion> links = testQuestionRepository.findByTestIdOrderByDisplayOrderAsc(test.getId());

        Map<Long, String> answerMap = new HashMap<>();
        if (request.getAnswers() != null) {
            request.getAnswers().forEach(a -> answerMap.put(a.getQuestionId(), a.getSelectedOption()));
        }

        int correct = 0, incorrect = 0, unanswered = 0;
        List<CrtTestResultResponse.QuestionReview> reviews = new java.util.ArrayList<>();

        for (CrtTestQuestion link : links) {
            CrtQuestion question = questionRepository.findById(link.getQuestionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
            String selected = answerMap.get(question.getId());

            Boolean isCorrect = null;
            if (selected == null || selected.isBlank()) {
                unanswered++;
            } else {
                isCorrect = question.getCorrectOption().equalsIgnoreCase(selected);
                if (isCorrect) correct++; else incorrect++;
            }

            attemptAnswerRepository.save(CrtTestAttemptAnswer.builder()
                    .attemptId(attempt.getId())
                    .questionId(question.getId())
                    .selectedOption(selected)
                    .isCorrect(isCorrect)
                    .build());

            reviews.add(CrtTestResultResponse.QuestionReview.builder()
                    .questionId(question.getId())
                    .questionText(question.getQuestionText())
                    .selectedOption(selected)
                    .correctOption(question.getCorrectOption())
                    .correct(Boolean.TRUE.equals(isCorrect))
                    .explanation(question.getExplanation())
                    .build());
        }

        int total = links.size();
        int score = total == 0 ? 0 : Math.round((correct * 100f) / total);
        int timeTaken = request.getTimeTakenSeconds() != null
                ? request.getTimeTakenSeconds()
                : (int) ChronoUnit.SECONDS.between(attempt.getStartedAt(), LocalDateTime.now());

        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setCorrectCount(correct);
        attempt.setIncorrectCount(incorrect);
        attempt.setUnansweredCount(unanswered);
        attempt.setScore(score);
        attempt.setTimeTakenSeconds(timeTaken);
        attempt.setStatus(AttemptStatus.SUBMITTED);
        attemptRepository.save(attempt);

        double accuracy = total == 0 ? 0 : Math.round(((double) correct / total) * 10000) / 100.0;

        return CrtTestResultResponse.builder()
                .attemptId(attempt.getId())
                .testId(test.getId())
                .testTitle(test.getTitle())
                .score(score)
                .totalQuestions(total)
                .correctCount(correct)
                .incorrectCount(incorrect)
                .unansweredCount(unanswered)
                .accuracy(accuracy)
                .timeTakenSeconds(timeTaken)
                .questionReviews(reviews)
                .build();
    }

    @Override
    public List<CrtTestResultResponse> listUserAttempts(Long userId) {
        return attemptRepository.findByUserIdOrderByStartedAtDesc(userId).stream()
                .filter(a -> a.getStatus() == AttemptStatus.SUBMITTED)
                .map(a -> {
                    CrtTest test = testRepository.findById(a.getTestId()).orElse(null);
                    double accuracy = a.getTotalQuestions() == 0 ? 0 :
                            Math.round(((double) a.getCorrectCount() / a.getTotalQuestions()) * 10000) / 100.0;
                    return CrtTestResultResponse.builder()
                            .attemptId(a.getId())
                            .testId(a.getTestId())
                            .testTitle(test != null ? test.getTitle() : "Unknown Test")
                            .score(a.getScore())
                            .totalQuestions(a.getTotalQuestions())
                            .correctCount(a.getCorrectCount())
                            .incorrectCount(a.getIncorrectCount())
                            .unansweredCount(a.getUnansweredCount())
                            .accuracy(accuracy)
                            .timeTakenSeconds(a.getTimeTakenSeconds())
                            .questionReviews(List.of())
                            .build();
                })
                .toList();
    }

    @Override
    @Transactional
    public CrtTestResponse createTest(CrtTestRequest request) {
        categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        CrtTest test = CrtTest.builder()
                .categoryId(request.getCategoryId())
                .title(request.getTitle())
                .description(request.getDescription())
                .durationMinutes(request.getDurationMinutes())
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : DifficultyLevel.MEDIUM)
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : true)
                .build();
        test = testRepository.save(test);
        linkQuestions(test.getId(), request.getQuestionIds());
        return toResponse(test);
    }

    @Override
    @Transactional
    public CrtTestResponse updateTest(Long testId, CrtTestRequest request) {
        CrtTest test = findTest(testId);
        test.setCategoryId(request.getCategoryId());
        test.setTitle(request.getTitle());
        test.setDescription(request.getDescription());
        test.setDurationMinutes(request.getDurationMinutes());
        if (request.getDifficulty() != null) test.setDifficulty(request.getDifficulty());
        if (request.getIsPublished() != null) test.setIsPublished(request.getIsPublished());
        testRepository.save(test);

        testQuestionRepository.deleteByTestId(testId);
        linkQuestions(testId, request.getQuestionIds());
        return toResponse(test);
    }

    @Override
    @Transactional
    public void deleteTest(Long testId) {
        findTest(testId);
        testQuestionRepository.deleteByTestId(testId);
        testRepository.deleteById(testId);
    }

    private void linkQuestions(Long testId, List<Long> questionIds) {
        if (questionIds == null) return;
        int order = 1;
        for (Long qid : questionIds) {
            if (!questionRepository.existsById(qid)) {
                throw new ResourceNotFoundException("Question not found with id: " + qid);
            }
            testQuestionRepository.save(CrtTestQuestion.builder()
                    .testId(testId)
                    .questionId(qid)
                    .displayOrder(order++)
                    .build());
        }
    }

    private CrtTest findTest(Long testId) {
        return testRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + testId));
    }

    private CrtTestResponse toResponse(CrtTest t) {
        CrtCategory category = categoryRepository.findById(t.getCategoryId()).orElse(null);
        return CrtTestResponse.builder()
                .id(t.getId())
                .categoryId(t.getCategoryId())
                .categoryName(category != null ? category.getDisplayName() : "Unknown")
                .title(t.getTitle())
                .description(t.getDescription())
                .durationMinutes(t.getDurationMinutes())
                .difficulty(t.getDifficulty().name())
                .isPublished(t.getIsPublished())
                .questionCount(testQuestionRepository.findByTestIdOrderByDisplayOrderAsc(t.getId()).size())
                .build();
    }
}
