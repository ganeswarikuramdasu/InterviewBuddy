package com.interviewbuddy.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CodingPatternRequest {
    @NotBlank(message = "Pattern name is required")
    private String name;

    private String description;
    private Integer position;
}
