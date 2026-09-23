package com.interviewbuddy.service;

import com.interviewbuddy.dto.request.LoginRequest;
import com.interviewbuddy.dto.request.RegisterRequest;
import com.interviewbuddy.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void verifyEmail(String token);
    void resendVerification(String email);
}
