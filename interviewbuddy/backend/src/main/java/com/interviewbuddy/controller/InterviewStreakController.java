package com.interviewbuddy.controller;

import com.interviewbuddy.dto.response.InterviewStreakCalendarResponse;
import com.interviewbuddy.dto.response.InterviewStreakOverviewResponse;
import com.interviewbuddy.security.UserPrincipal;
import com.interviewbuddy.service.InterviewStreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/interview-streak")
@RequiredArgsConstructor
public class InterviewStreakController {

    private final InterviewStreakService interviewStreakService;

    @GetMapping
    public InterviewStreakOverviewResponse overview(@AuthenticationPrincipal UserPrincipal principal) {
        return interviewStreakService.getOverview(principal.getId());
    }

    @GetMapping("/calendar")
    public InterviewStreakCalendarResponse calendar(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(defaultValue = "6") int months) {
        return interviewStreakService.getCalendar(principal.getId(), months);
    }
}