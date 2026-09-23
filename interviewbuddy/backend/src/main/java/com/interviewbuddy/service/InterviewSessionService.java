package com.interviewbuddy.service;

import com.interviewbuddy.dto.request.InterviewAnswerRequest;
import com.interviewbuddy.dto.request.InterviewStartRequest;
import com.interviewbuddy.dto.response.InterviewSessionResultResponse;
import com.interviewbuddy.dto.response.InterviewSessionStartResponse;

import java.util.List;

public interface InterviewSessionService {
    InterviewSessionStartResponse startSession(Long userId, InterviewStartRequest request);
    InterviewSessionResultResponse submitAnswer(Long userId, Long sessionId, InterviewAnswerRequest request);
    InterviewSessionResultResponse finishSession(Long userId, Long sessionId);
    List<InterviewSessionResultResponse> listHistory(Long userId);
    InterviewSessionResultResponse getSession(Long userId, Long sessionId);
}
