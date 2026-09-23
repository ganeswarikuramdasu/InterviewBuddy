package com.interviewbuddy.service.impl;

import com.interviewbuddy.dto.request.ChangePasswordRequest;
import com.interviewbuddy.dto.request.UpdateProfileRequest;
import com.interviewbuddy.dto.response.UserResponse;
import com.interviewbuddy.entity.User;
import com.interviewbuddy.exception.BadRequestException;
import com.interviewbuddy.exception.ResourceNotFoundException;
import com.interviewbuddy.repository.UserRepository;
import com.interviewbuddy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getProfile(Long userId) {
        return UserResponse.from(findUser(userId));
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = findUser(userId);
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setCollege(request.getCollege());
        user.setBranch(request.getBranch());
        user.setGraduationYear(request.getGraduationYear());
        return UserResponse.from(userRepository.save(user));
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = findUser(userId);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public Page<UserResponse> searchUsers(String search, User.Role role, Pageable pageable) {
        return userRepository.search(search, role, pageable).map(UserResponse::from);
    }

    @Override
    @Transactional
    public UserResponse setUserEnabled(Long userId, boolean enabled) {
        User user = findUser(userId);
        user.setEnabled(enabled);
        return UserResponse.from(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = findUser(userId);
        userRepository.delete(user);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
}
