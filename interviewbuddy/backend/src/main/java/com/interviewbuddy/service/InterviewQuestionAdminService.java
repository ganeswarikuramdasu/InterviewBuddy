package com.interviewbuddy.service;

import com.interviewbuddy.dto.request.InterviewQuestionAdminRequest;
import com.interviewbuddy.entity.InterviewQuestion;

import java.util.List;

public interface InterviewQuestionAdminService {
    List<InterviewQuestion> list(String role);
    InterviewQuestion create(InterviewQuestionAdminRequest request);
    InterviewQuestion update(Long id, InterviewQuestionAdminRequest request);
    void delete(Long id);
}
