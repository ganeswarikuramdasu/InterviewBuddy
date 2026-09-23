package com.interviewbuddy.dto.request;

import com.interviewbuddy.entity.CodingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProblemStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private CodingStatus status;
}
