package com.interviewbuddy.controller.admin;

import com.interviewbuddy.dto.response.AdminDashboardResponse;
import com.interviewbuddy.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public AdminDashboardResponse getAdminDashboard() {
        return dashboardService.getAdminDashboard();
    }
}
