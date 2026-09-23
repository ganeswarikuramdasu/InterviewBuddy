package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class CrtTestResultResponse {
    private Long attemptId;
    private Long testId;
    private String testTitle;
    private Integer score;
    private Integer totalQuestions;
    private Integer correctCount;
    private Integer incorrectCount;
    private Integer unansweredCount;
    private Double accuracy;
    private Integer timeTakenSeconds;
    private List<QuestionReview> questionReviews;

    @Data
    @Builder
    @AllArgsConstructor
    public static class QuestionReview {
        private Long questionId;
        private String questionText;
        private String selectedOption;
        private String correctOption;
        private boolean correct;
        private String explanation;
    }
}
