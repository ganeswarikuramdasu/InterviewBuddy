package com.interviewbuddy.service.impl;

import com.interviewbuddy.dto.request.CrtPracticeSubmitRequest;
import com.interviewbuddy.dto.request.CrtQuestionRequest;
import com.interviewbuddy.dto.request.CrtTopicRequest;
import com.interviewbuddy.dto.response.*;
import com.interviewbuddy.entity.*;
import com.interviewbuddy.exception.ResourceNotFoundException;
import com.interviewbuddy.repository.*;
import com.interviewbuddy.service.CrtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrtServiceImpl implements CrtService {

    private final CrtCategoryRepository categoryRepository;
    private final CrtTopicRepository topicRepository;
    private final CrtQuestionRepository questionRepository;
    private final CrtPracticeAttemptRepository practiceAttemptRepository;

    @Override
    public List<CrtCategoryResponse> listCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> CrtCategoryResponse.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .displayName(c.getDisplayName())
                        .description(c.getDescription())
                        .topicCount(topicRepository.findByCategoryIdOrderByDisplayOrderAsc(c.getId()).size())
                        .questionCount(questionRepository.findAll().stream().filter(q -> q.getCategoryId().equals(c.getId())).count())
                        .build())
                .toList();
    }

    @Override
    public List<CrtTopicResponse> listTopics(Long categoryId) {
        return topicRepository.findByCategoryIdOrderByDisplayOrderAsc(categoryId).stream()
                .map(this::toTopicResponse)
                .toList();
    }

    @Override
    public CrtTopicResponse getTopic(Long topicId) {
        return toTopicResponse(findTopic(topicId));
    }

    @Override
    public List<CrtQuestionPracticeResponse> getPracticeQuestions(Long topicId) {
        return questionRepository.findByTopicId(topicId).stream()
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
    }

    @Override
    @Transactional
    public CrtPracticeResultResponse submitPractice(Long userId, CrtPracticeSubmitRequest request) {
        CrtQuestion question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        boolean correct = question.getCorrectOption().equalsIgnoreCase(request.getSelectedOption());

        CrtPracticeAttempt attempt = CrtPracticeAttempt.builder()
                .userId(userId)
                .questionId(question.getId())
                .selectedOption(request.getSelectedOption().toUpperCase())
                .isCorrect(correct)
                .build();
        practiceAttemptRepository.save(attempt);

        List<CrtPracticeAttempt> attempts = practiceAttemptRepository.findByUserId(userId).stream()
                .filter(a -> a.getQuestionId().equals(question.getId()))
                .toList();
        long userAttempts = attempts.size();
        long userCorrect = attempts.stream().filter(CrtPracticeAttempt::getIsCorrect).count();

        return CrtPracticeResultResponse.builder()
                .questionId(question.getId())
                .correct(correct)
                .correctOption(question.getCorrectOption())
                .explanation(question.getExplanation())
                .userAttempts(userAttempts)
                .userCorrectAttempts(userCorrect)
                .build();
    }

    @Override
    @Transactional
    public CrtTopicResponse createTopic(CrtTopicRequest request) {
        categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        CrtTopic topic = CrtTopic.builder()
                .categoryId(request.getCategoryId())
                .title(request.getTitle())
                .explanation(request.getExplanation())
                .concepts(request.getConcepts())
                .formulas(request.getFormulas())
                .examples(request.getExamples())
                .tips(request.getTips())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();
        return toTopicResponse(topicRepository.save(topic));
    }

    @Override
    @Transactional
    public CrtTopicResponse updateTopic(Long topicId, CrtTopicRequest request) {
        CrtTopic topic = findTopic(topicId);
        topic.setCategoryId(request.getCategoryId());
        topic.setTitle(request.getTitle());
        topic.setExplanation(request.getExplanation());
        topic.setConcepts(request.getConcepts());
        topic.setFormulas(request.getFormulas());
        topic.setExamples(request.getExamples());
        topic.setTips(request.getTips());
        if (request.getDisplayOrder() != null) topic.setDisplayOrder(request.getDisplayOrder());
        return toTopicResponse(topicRepository.save(topic));
    }

    @Override
    @Transactional
    public void deleteTopic(Long topicId) {
        findTopic(topicId);
        topicRepository.deleteById(topicId);
    }

    @Override
    public List<CrtQuestionResponse> listQuestionsForAdmin(Long topicId) {
        return questionRepository.findByTopicId(topicId).stream()
                .map(this::toQuestionResponse)
                .toList();
    }

    @Override
    @Transactional
    public CrtQuestionResponse createQuestion(CrtQuestionRequest request) {
        CrtTopic topic = findTopic(request.getTopicId());
        CrtQuestion question = CrtQuestion.builder()
                .topicId(topic.getId())
                .categoryId(topic.getCategoryId())
                .questionText(request.getQuestionText())
                .optionA(request.getOptionA())
                .optionB(request.getOptionB())
                .optionC(request.getOptionC())
                .optionD(request.getOptionD())
                .correctOption(request.getCorrectOption().toUpperCase())
                .explanation(request.getExplanation())
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : DifficultyLevel.MEDIUM)
                .build();
        return toQuestionResponse(questionRepository.save(question));
    }

    @Override
    @Transactional
    public CrtQuestionResponse updateQuestion(Long questionId, CrtQuestionRequest request) {
        CrtQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
        CrtTopic topic = findTopic(request.getTopicId());

        question.setTopicId(topic.getId());
        question.setCategoryId(topic.getCategoryId());
        question.setQuestionText(request.getQuestionText());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectOption(request.getCorrectOption().toUpperCase());
        question.setExplanation(request.getExplanation());
        if (request.getDifficulty() != null) question.setDifficulty(request.getDifficulty());
        return toQuestionResponse(questionRepository.save(question));
    }

    @Override
    @Transactional
    public void deleteQuestion(Long questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new ResourceNotFoundException("Question not found with id: " + questionId);
        }
        questionRepository.deleteById(questionId);
    }

    private CrtTopic findTopic(Long topicId) {
        return topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + topicId));
    }

    private CrtTopicResponse toTopicResponse(CrtTopic t) {
        return CrtTopicResponse.builder()
                .id(t.getId())
                .categoryId(t.getCategoryId())
                .title(t.getTitle())
                .explanation(t.getExplanation())
                .concepts(t.getConcepts())
                .formulas(t.getFormulas())
                .examples(t.getExamples())
                .tips(t.getTips())
                .displayOrder(t.getDisplayOrder())
                .questionCount(questionRepository.countByTopicId(t.getId()))
                .build();
    }

    private CrtQuestionResponse toQuestionResponse(CrtQuestion q) {
        return CrtQuestionResponse.builder()
                .id(q.getId())
                .topicId(q.getTopicId())
                .categoryId(q.getCategoryId())
                .questionText(q.getQuestionText())
                .optionA(q.getOptionA())
                .optionB(q.getOptionB())
                .optionC(q.getOptionC())
                .optionD(q.getOptionD())
                .correctOption(q.getCorrectOption())
                .explanation(q.getExplanation())
                .difficulty(q.getDifficulty().name())
                .build();
    }
}
