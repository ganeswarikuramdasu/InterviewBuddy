package com.interviewbuddy.dto.request;

import com.interviewbuddy.entity.DifficultyLevel;
import com.interviewbuddy.entity.InterviewType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InterviewQuestionAdminRequest {
    @NotBlank(message = "Role is required")
    private String role;

    @NotNull(message = "Interview type is required")
    private InterviewType interviewType;

    private DifficultyLevel difficulty;

    @NotBlank(message = "Question text is required")
    private String questionText;

    private String modelAnswerNotes;
}
