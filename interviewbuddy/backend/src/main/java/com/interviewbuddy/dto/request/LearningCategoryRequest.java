package com.interviewbuddy.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LearningCategoryRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    private Integer displayOrder;
}
