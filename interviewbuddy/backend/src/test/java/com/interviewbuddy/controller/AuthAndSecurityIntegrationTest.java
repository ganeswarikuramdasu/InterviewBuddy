package com.interviewbuddy.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewbuddy.dto.request.LoginRequest;
import com.interviewbuddy.dto.request.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-end test through the real Spring context (H2 in-memory DB) covering:
 *  - Registration + login issue a usable JWT
 *  - A USER-role token cannot access admin-only endpoints (proves role-based
 *    authorization is enforced at the backend, not just hidden in the UI)
 *  - Unauthenticated requests to protected endpoints are rejected
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthAndSecurityIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Test
    void register_thenLogin_thenAccessProfile_succeeds() throws Exception {
        RegisterRequest register = new RegisterRequest();
        register.setFullName("Integration Test User");
        register.setEmail("integration.test@example.com");
        register.setPassword("Passw0rd!");

        String registerResponse = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.role").value("USER"))
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(registerResponse).get("token").asText();

        mockMvc.perform(get("/api/user/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("integration.test@example.com"));
    }

    @Test
    void duplicateRegistration_returnsConflict() throws Exception {
        RegisterRequest register = new RegisterRequest();
        register.setFullName("Dup User");
        register.setEmail("duplicate@example.com");
        register.setPassword("Passw0rd!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isConflict());
    }

    @Test
    void userToken_cannotAccessAdminEndpoint() throws Exception {
        RegisterRequest register = new RegisterRequest();
        register.setFullName("Regular User");
        register.setEmail("regular.user@example.com");
        register.setPassword("Passw0rd!");

        String registerResponse = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(registerResponse).get("token").asText();

        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void unauthenticatedRequest_toProtectedEndpoint_isRejected() throws Exception {
        mockMvc.perform(get("/api/user/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void login_withWrongPassword_returnsUnauthorized() throws Exception {
        RegisterRequest register = new RegisterRequest();
        register.setFullName("Login Test");
        register.setEmail("login.test@example.com");
        register.setPassword("Passw0rd!");
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated());

        LoginRequest login = new LoginRequest();
        login.setEmail("login.test@example.com");
        login.setPassword("WrongPassword!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized());
    }
}
