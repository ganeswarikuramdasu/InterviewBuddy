package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/** Used when serving a question to attempt: correct answer/explanation withheld until submission. */
@Data
@Builder
@AllArgsConstructor
public class CrtQuestionPracticeResponse {
    private Long id;
    private Long topicId;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String difficulty;
}
