package com.interviewbuddy.service;

import com.interviewbuddy.dto.response.AdminDashboardResponse;
import com.interviewbuddy.dto.response.UserDashboardResponse;

public interface DashboardService {
    UserDashboardResponse getUserDashboard(Long userId);
    AdminDashboardResponse getAdminDashboard();
}
