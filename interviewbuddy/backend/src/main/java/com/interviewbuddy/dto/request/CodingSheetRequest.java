package com.interviewbuddy.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CodingSheetRequest {
    @NotBlank(message = "Sheet name is required")
    private String name;

    private String description;
    private Integer position;
}
