package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CrtTopicResponse {
    private Long id;
    private Long categoryId;
    private String title;
    private String explanation;
    private String concepts;
    private String formulas;
    private String examples;
    private String tips;
    private Integer displayOrder;
    private long questionCount;
}
