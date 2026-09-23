package com.interviewbuddy.dto.request;

import com.interviewbuddy.entity.StudyPlanType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class StudyPlanItemRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be under 100 characters")
    private String title;

    @NotNull(message = "Type is required")
    private StudyPlanType type;

    @NotNull(message = "Day of week is required")
    @Min(value = 0, message = "Day must be between 0 and 6")
    @Max(value = 6, message = "Day must be between 0 and 6")
    private Integer dayOfWeek;

    @Size(max = 20, message = "Time must be under 20 characters")
    private String time;

    @Min(value = 5, message = "Duration must be at least 5 minutes")
    @Max(value = 480, message = "Duration must be at most 480 minutes")
    private Integer durationMinutes;
}
