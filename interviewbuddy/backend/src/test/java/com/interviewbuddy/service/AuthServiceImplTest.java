package com.interviewbuddy.service;

import com.interviewbuddy.dto.request.LoginRequest;
import com.interviewbuddy.dto.request.RegisterRequest;
import com.interviewbuddy.dto.response.AuthResponse;
import com.interviewbuddy.entity.User;
import com.interviewbuddy.exception.DuplicateResourceException;
import com.interviewbuddy.repository.UserRepository;
import com.interviewbuddy.security.JwtService;
import com.interviewbuddy.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private EmailService emailService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setFullName("Test User");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("Passw0rd!");
    }

    @Test
    void register_savesNewUser_andReturnsToken() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Passw0rd!")).thenReturn("hashed-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });
        when(jwtService.generateToken(any(UserDetails.class), eq(1L), eq("USER"))).thenReturn("fake-jwt-token");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("fake-jwt-token", response.getToken());
        assertEquals("test@example.com", response.getUser().getEmail());
        assertEquals("USER", response.getUser().getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_throwsDuplicateResourceException_whenEmailAlreadyExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_returnsToken_forValidCredentials() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("Passw0rd!");

        User user = User.builder()
                .id(1L)
                .fullName("Test User")
                .email("test@example.com")
                .passwordHash("hashed-password")
                .role(User.Role.USER)
                .enabled(true)
                .emailVerified(true)
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(UserDetails.class), eq(1L), eq("USER"))).thenReturn("fake-jwt-token");

        AuthResponse response = authService.login(loginRequest);

        assertEquals("fake-jwt-token", response.getToken());
        verify(authenticationManager).authenticate(any());
    }
}
