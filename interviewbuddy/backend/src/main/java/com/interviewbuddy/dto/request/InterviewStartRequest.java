package com.interviewbuddy.dto.request;

import com.interviewbuddy.entity.DifficultyLevel;
import com.interviewbuddy.entity.InterviewType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class InterviewStartRequest {
    @NotBlank(message = "Role is required")
    private String role;

    @NotNull(message = "Interview type is required")
    private InterviewType interviewType;

    @NotNull(message = "Difficulty is required")
    private DifficultyLevel difficulty;

    @Min(value = 1, message = "At least 1 question required")
    @Max(value = 10, message = "At most 10 questions allowed")
    private Integer numberOfQuestions;

    private List<String> topics;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Max(value = 120, message = "Duration must be at most 120 minutes")
    private Integer durationMinutes;
}
