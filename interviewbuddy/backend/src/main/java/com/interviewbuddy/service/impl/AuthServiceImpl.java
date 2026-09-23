package com.interviewbuddy.service.impl;

import com.interviewbuddy.dto.request.LoginRequest;
import com.interviewbuddy.dto.request.RegisterRequest;
import com.interviewbuddy.dto.response.AuthResponse;
import com.interviewbuddy.dto.response.UserResponse;
import com.interviewbuddy.entity.User;
import com.interviewbuddy.exception.BadRequestException;
import com.interviewbuddy.exception.DuplicateResourceException;
import com.interviewbuddy.repository.UserRepository;
import com.interviewbuddy.security.JwtService;
import com.interviewbuddy.security.UserPrincipal;
import com.interviewbuddy.service.AuthService;
import com.interviewbuddy.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final long VERIFICATION_EXPIRY_HOURS = 24;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .phone(request.getPhone())
                .college(request.getCollege())
                .branch(request.getBranch())
                .graduationYear(request.getGraduationYear())
                .enabled(true)
                .emailVerified(false)
                .emailVerificationToken(verificationToken)
                .emailVerificationExpiry(LocalDateTime.now().plusHours(VERIFICATION_EXPIRY_HOURS))
                .build();

        user = userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), verificationToken);

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtService.generateToken(principal, user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.from(user))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("Invalid email or password"));

        if (user.getRole() != User.Role.ADMIN
                && (user.getEmailVerified() == null || !user.getEmailVerified())) {
            throw new BadRequestException("Please verify your email before logging in. Check your inbox (and spam) for the verification link, or use 'Resend' to get a new one.");
        }

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtService.generateToken(principal, user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.from(user))
                .build();
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        if (token == null || token.isBlank()) {
            throw new BadRequestException("Missing verification token");
        }

        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or already used verification token"));

        if (user.getEmailVerified()) {
            throw new BadRequestException("Email is already verified");
        }
        if (user.getEmailVerificationExpiry() != null
                && user.getEmailVerificationExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification link has expired. Please request a new one.");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationExpiry(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void resendVerification(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Email is required");
        }

        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("No account found for this email"));

        if (user.getEmailVerified() != null && user.getEmailVerified()) {
            throw new BadRequestException("Email is already verified");
        }

        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        user.setEmailVerificationExpiry(LocalDateTime.now().plusHours(VERIFICATION_EXPIRY_HOURS));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), verificationToken);
    }
}
