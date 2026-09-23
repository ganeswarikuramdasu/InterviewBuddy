package com.interviewbuddy.dto.request;

import com.interviewbuddy.entity.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CrtQuestionRequest {
    @NotNull(message = "Topic id is required")
    private Long topicId;

    @NotBlank(message = "Question text is required")
    private String questionText;

    @NotBlank private String optionA;
    @NotBlank private String optionB;
    @NotBlank private String optionC;
    @NotBlank private String optionD;

    @NotBlank
    @Pattern(regexp = "[ABCD]", message = "Correct option must be one of A, B, C, D")
    private String correctOption;

    private String explanation;
    private DifficultyLevel difficulty;
}
