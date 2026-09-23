package com.interviewbuddy.controller;

import com.interviewbuddy.dto.request.ChangePasswordRequest;
import com.interviewbuddy.dto.request.UpdateProfileRequest;
import com.interviewbuddy.dto.response.MessageResponse;
import com.interviewbuddy.dto.response.UserResponse;
import com.interviewbuddy.security.UserPrincipal;
import com.interviewbuddy.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public UserResponse getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return userService.getProfile(principal.getId());
    }

    @PutMapping("/profile")
    public UserResponse updateProfile(@AuthenticationPrincipal UserPrincipal principal,
                                       @Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(principal.getId(), request);
    }

    @PutMapping("/password")
    public MessageResponse changePassword(@AuthenticationPrincipal UserPrincipal principal,
                                           @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getId(), request);
        return new MessageResponse("Password updated successfully");
    }
}
