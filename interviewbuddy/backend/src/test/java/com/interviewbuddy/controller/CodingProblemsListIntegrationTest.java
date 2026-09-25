package com.interviewbuddy.controller;

import com.interviewbuddy.entity.CodingPattern;
import com.interviewbuddy.entity.CodingProblem;
import com.interviewbuddy.entity.CodingSheet;
import com.interviewbuddy.entity.DifficultyLevel;
import com.interviewbuddy.repository.CodingPatternRepository;
import com.interviewbuddy.repository.CodingProblemRepository;
import com.interviewbuddy.repository.CodingSheetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CodingProblemsListIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private CodingProblemRepository problemRepository;
    @Autowired private CodingSheetRepository sheetRepository;
    @Autowired private CodingPatternRepository patternRepository;

    @BeforeEach
    void setUp() {
        problemRepository.deleteAll();
        sheetRepository.deleteAll();
        patternRepository.deleteAll();
    }

    @Test
    void listProblems_withSheetsAndPatterns_returnsOk() throws Exception {
        CodingSheet sheet = sheetRepository.save(CodingSheet.builder()
                .name("Test Sheet")
                .slug("test-sheet")
                .description("desc")
                .position(0)
                .build());

        CodingPattern pattern = patternRepository.save(CodingPattern.builder()
                .name("Two Pointers")
                .slug("two-pointers")
                .description("desc")
                .position(0)
                .build());

        problemRepository.save(CodingProblem.builder()
                .title("Two Sum")
                .slug("two-sum")
                .description("Find the pair.")
                .difficulty(DifficultyLevel.EASY)
                .topic("array")
                .sheets(List.of(sheet))
                .patternId(pattern.getId())
                .isPublished(true)
                .platform(com.interviewbuddy.entity.CodingPlatform.OTHER)
                .build());

        mockMvc.perform(get("/api/coding/problems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].title").value("Two Sum"));
    }
}