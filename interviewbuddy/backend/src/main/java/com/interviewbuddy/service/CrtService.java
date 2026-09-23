package com.interviewbuddy.service;

import com.interviewbuddy.dto.request.CrtPracticeSubmitRequest;
import com.interviewbuddy.dto.request.CrtQuestionRequest;
import com.interviewbuddy.dto.request.CrtTopicRequest;
import com.interviewbuddy.dto.response.*;

import java.util.List;

public interface CrtService {
    List<CrtCategoryResponse> listCategories();
    List<CrtTopicResponse> listTopics(Long categoryId);
    CrtTopicResponse getTopic(Long topicId);

    List<CrtQuestionPracticeResponse> getPracticeQuestions(Long topicId);
    CrtPracticeResultResponse submitPractice(Long userId, CrtPracticeSubmitRequest request);

    // Admin
    CrtTopicResponse createTopic(CrtTopicRequest request);
    CrtTopicResponse updateTopic(Long topicId, CrtTopicRequest request);
    void deleteTopic(Long topicId);

    List<CrtQuestionResponse> listQuestionsForAdmin(Long topicId);
    CrtQuestionResponse createQuestion(CrtQuestionRequest request);
    CrtQuestionResponse updateQuestion(Long questionId, CrtQuestionRequest request);
    void deleteQuestion(Long questionId);
}
