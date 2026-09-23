package com.interviewbuddy.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class CrtTestSubmitRequest {
    private List<Answer> answers;
    private Integer timeTakenSeconds;

    @Data
    public static class Answer {
        private Long questionId;
        private String selectedOption; // nullable => unanswered
    }
}
