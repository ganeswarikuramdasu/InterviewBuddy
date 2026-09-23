package com.interviewbuddy.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewbuddy.dto.request.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * End-to-end test for the InterviewStreak endpoints (H2 in-memory DB):
 *  - authenticated user can read their own (empty) streak statistics
 *  - the streak routes are protected and reject unauthenticated requests
 */
@SpringBootTest
@AutoConfigureMockMvc
class InterviewStreakIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Test
    void authenticatedUser_canReadTheirOwnEmptyStreak() throws Exception {
        String token = registerAndGetToken("streak.user@example.com", "Streak User");

        mockMvc.perform(get("/api/interview-streak")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentStreak").value(0))
                .andExpect(jsonPath("$.longestStreak").value(0))
                .andExpect(jsonPath("$.totalPracticeDays").value(0))
                .andExpect(jsonPath("$.todayCompleted").value(false))
                .andExpect(jsonPath("$.today").exists());

        mockMvc.perform(get("/api/interview-streak/calendar")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.today").exists())
                .andExpect(jsonPath("$.practiceDays").isArray());
    }

    @Test
    void unauthenticatedRequest_toStreakEndpoints_isRejected() throws Exception {
        mockMvc.perform(get("/api/interview-streak"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/interview-streak/calendar"))
                .andExpect(status().isUnauthorized());
    }

    private String registerAndGetToken(String email, String name) throws Exception {
        RegisterRequest register = new RegisterRequest();
        register.setFullName(name);
        register.setEmail(email);
        register.setPassword("Passw0rd!");

        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        return objectMapper.readTree(response).get("token").asText();
    }
}