package com.interviewbuddy.controller;

import com.interviewbuddy.dto.request.InterviewAnswerRequest;
import com.interviewbuddy.dto.request.InterviewStartRequest;
import com.interviewbuddy.dto.response.InterviewSessionResultResponse;
import com.interviewbuddy.dto.response.InterviewSessionStartResponse;
import com.interviewbuddy.security.UserPrincipal;
import com.interviewbuddy.service.InterviewSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewSessionService interviewSessionService;

    @PostMapping("/start")
    public InterviewSessionStartResponse start(@AuthenticationPrincipal UserPrincipal principal,
                                                @Valid @RequestBody InterviewStartRequest request) {
        return interviewSessionService.startSession(principal.getId(), request);
    }

    @PostMapping("/{sessionId}/answer")
    public InterviewSessionResultResponse answer(@AuthenticationPrincipal UserPrincipal principal,
                                                  @PathVariable Long sessionId,
                                                  @Valid @RequestBody InterviewAnswerRequest request) {
        return interviewSessionService.submitAnswer(principal.getId(), sessionId, request);
    }

    @PostMapping("/{sessionId}/finish")
    public InterviewSessionResultResponse finish(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long sessionId) {
        return interviewSessionService.finishSession(principal.getId(), sessionId);
    }

    @GetMapping("/{sessionId}")
    public InterviewSessionResultResponse getSession(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long sessionId) {
        return interviewSessionService.getSession(principal.getId(), sessionId);
    }

    @GetMapping("/history")
    public List<InterviewSessionResultResponse> history(@AuthenticationPrincipal UserPrincipal principal) {
        return interviewSessionService.listHistory(principal.getId());
    }
}
