package com.interviewbuddy.controller;

import com.interviewbuddy.dto.response.UserDashboardResponse;
import com.interviewbuddy.security.UserPrincipal;
import com.interviewbuddy.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public UserDashboardResponse getDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        return dashboardService.getUserDashboard(principal.getId());
    }
}
