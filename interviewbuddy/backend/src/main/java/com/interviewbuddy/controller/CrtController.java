package com.interviewbuddy.controller;

import com.interviewbuddy.dto.request.CrtPracticeSubmitRequest;
import com.interviewbuddy.dto.response.*;
import com.interviewbuddy.security.UserPrincipal;
import com.interviewbuddy.service.CrtService;
import com.interviewbuddy.service.CrtTestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crt")
@RequiredArgsConstructor
public class CrtController {

    private final CrtService crtService;
    private final CrtTestService crtTestService;

    @GetMapping("/categories")
    public List<CrtCategoryResponse> listCategories() {
        return crtService.listCategories();
    }

    @GetMapping("/categories/{categoryId}/topics")
    public List<CrtTopicResponse> listTopics(@PathVariable Long categoryId) {
        return crtService.listTopics(categoryId);
    }

    @GetMapping("/topics/{topicId}")
    public CrtTopicResponse getTopic(@PathVariable Long topicId) {
        return crtService.getTopic(topicId);
    }

    @GetMapping("/topics/{topicId}/practice")
    public List<CrtQuestionPracticeResponse> getPracticeQuestions(@PathVariable Long topicId) {
        return crtService.getPracticeQuestions(topicId);
    }

    @PostMapping("/practice/submit")
    public CrtPracticeResultResponse submitPractice(@AuthenticationPrincipal UserPrincipal principal,
                                                      @Valid @RequestBody CrtPracticeSubmitRequest request) {
        return crtService.submitPractice(principal.getId(), request);
    }

    @GetMapping("/tests")
    public List<CrtTestResponse> listTests(@RequestParam(required = false) Long categoryId) {
        return crtTestService.listTests(categoryId);
    }

    @GetMapping("/tests/{testId}")
    public CrtTestResponse getTest(@PathVariable Long testId) {
        return crtTestService.getTest(testId);
    }

    @PostMapping("/tests/{testId}/start")
    public CrtTestAttemptStartResponse startTest(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long testId) {
        return crtTestService.startAttempt(principal.getId(), testId);
    }

    @PostMapping("/attempts/{attemptId}/submit")
    public CrtTestResultResponse submitTest(@AuthenticationPrincipal UserPrincipal principal,
                                             @PathVariable Long attemptId,
                                             @RequestBody com.interviewbuddy.dto.request.CrtTestSubmitRequest request) {
        return crtTestService.submitAttempt(principal.getId(), attemptId, request);
    }

    @GetMapping("/attempts")
    public List<CrtTestResultResponse> listMyAttempts(@AuthenticationPrincipal UserPrincipal principal) {
        return crtTestService.listUserAttempts(principal.getId());
    }
}
