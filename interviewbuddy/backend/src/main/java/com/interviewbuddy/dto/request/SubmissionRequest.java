package com.interviewbuddy.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubmissionRequest {
    @NotBlank(message = "Language is required")
    private String language;

    @NotBlank(message = "Source code is required")
    private String sourceCode;
}
