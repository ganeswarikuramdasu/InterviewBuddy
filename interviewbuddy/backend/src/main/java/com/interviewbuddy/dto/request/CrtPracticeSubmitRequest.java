package com.interviewbuddy.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CrtPracticeSubmitRequest {
    @NotNull(message = "Question id is required")
    private Long questionId;

    @NotBlank(message = "Selected option is required")
    private String selectedOption;
}
