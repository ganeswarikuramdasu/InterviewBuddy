package com.interviewbuddy.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 120)
    private String fullName;

    private String phone;
    private String college;
    private String branch;
    private Integer graduationYear;
}
