package com.interviewbuddy.controller.admin;

import com.interviewbuddy.dto.response.MessageResponse;
import com.interviewbuddy.dto.response.UserResponse;
import com.interviewbuddy.entity.User;
import com.interviewbuddy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public Page<UserResponse> search(@RequestParam(required = false) String search,
                                      @RequestParam(required = false) User.Role role,
                                      @PageableDefault(size = 20) Pageable pageable) {
        return userService.searchUsers(search, role, pageable);
    }

    @PutMapping("/{userId}/enabled")
    public UserResponse setEnabled(@PathVariable Long userId, @RequestParam boolean enabled) {
        return userService.setUserEnabled(userId, enabled);
    }

    @DeleteMapping("/{userId}")
    public MessageResponse delete(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return new MessageResponse("User deleted successfully");
    }
}
