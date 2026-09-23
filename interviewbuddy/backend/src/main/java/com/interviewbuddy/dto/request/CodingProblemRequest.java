package com.interviewbuddy.dto.request;

import com.interviewbuddy.entity.CodingPlatform;
import com.interviewbuddy.entity.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class CodingProblemRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String constraintsText;

    @NotNull(message = "Difficulty is required")
    private DifficultyLevel difficulty;

    private String topic;

    private Long sheetId;
    private List<Long> sheetIds;
    private Long patternId;
    private String externalUrl;
    private CodingPlatform platform;

    private String starterCode;
    private Boolean isPublished;

    private List<ExampleInput> examples;
    private List<TestCaseInput> testCases;

    @Data
    public static class ExampleInput {
        private String inputText;
        private String outputText;
        private String explanation;
    }

    @Data
    public static class TestCaseInput {
        private String inputData;
        private String expectedOutput;
        private Boolean isSample;
    }
}
