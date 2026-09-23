package com.interviewbuddy.service;

import com.interviewbuddy.dto.request.ChangePasswordRequest;
import com.interviewbuddy.dto.request.UpdateProfileRequest;
import com.interviewbuddy.dto.response.UserResponse;
import com.interviewbuddy.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserResponse getProfile(Long userId);
    UserResponse updateProfile(Long userId, UpdateProfileRequest request);
    void changePassword(Long userId, ChangePasswordRequest request);

    // Admin operations
    Page<UserResponse> searchUsers(String search, User.Role role, Pageable pageable);
    UserResponse setUserEnabled(Long userId, boolean enabled);
    void deleteUser(Long userId);
}
