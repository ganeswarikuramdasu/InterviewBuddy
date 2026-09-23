package com.interviewbuddy.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class StudyGoalsRequest {

    @Min(value = 0, message = "Coding goal must be 0 or more")
    @Max(value = 50, message = "Coding goal must be 50 or less")
    private Integer codingPerWeek;

    @Min(value = 0, message = "Interview goal must be 0 or more")
    @Max(value = 20, message = "Interview goal must be 20 or less")
    private Integer interviewsPerWeek;

    @Min(value = 0, message = "Learning goal must be 0 or more")
    @Max(value = 50, message = "Learning goal must be 50 or less")
    private Integer learningPerWeek;
}
