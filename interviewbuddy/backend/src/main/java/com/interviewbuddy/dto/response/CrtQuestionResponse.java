package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * Used for admin management and for post-submission review, where revealing
 * the correct option and explanation is appropriate.
 */
@Data
@Builder
@AllArgsConstructor
public class CrtQuestionResponse {
    private Long id;
    private Long topicId;
    private Long categoryId;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctOption;
    private String explanation;
    private String difficulty;
}
