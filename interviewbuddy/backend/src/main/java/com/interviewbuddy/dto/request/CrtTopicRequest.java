package com.interviewbuddy.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CrtTopicRequest {
    @NotNull(message = "Category id is required")
    private Long categoryId;

    @NotBlank(message = "Title is required")
    private String title;

    private String explanation;
    private String concepts;
    private String formulas;
    private String examples;
    private String tips;
    private Integer displayOrder;
}
