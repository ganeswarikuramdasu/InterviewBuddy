package com.interviewbuddy.service;

import com.interviewbuddy.dto.request.CrtTestRequest;
import com.interviewbuddy.dto.request.CrtTestSubmitRequest;
import com.interviewbuddy.dto.response.*;

import java.util.List;

public interface CrtTestService {
    List<CrtTestResponse> listTests(Long categoryId);
    CrtTestResponse getTest(Long testId);

    CrtTestAttemptStartResponse startAttempt(Long userId, Long testId);
    CrtTestResultResponse submitAttempt(Long userId, Long attemptId, CrtTestSubmitRequest request);
    List<CrtTestResultResponse> listUserAttempts(Long userId);

    // Admin
    CrtTestResponse createTest(CrtTestRequest request);
    CrtTestResponse updateTest(Long testId, CrtTestRequest request);
    void deleteTest(Long testId);
}
