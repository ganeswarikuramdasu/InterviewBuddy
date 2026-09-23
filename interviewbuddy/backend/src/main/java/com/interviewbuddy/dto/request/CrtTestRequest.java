package com.interviewbuddy.dto.request;

import com.interviewbuddy.entity.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class CrtTestRequest {
    @NotNull(message = "Category id is required")
    private Long categoryId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @Positive(message = "Duration must be positive")
    private Integer durationMinutes;

    private DifficultyLevel difficulty;

    @NotEmpty(message = "At least one question is required")
    private List<Long> questionIds;

    private Boolean isPublished;
}
