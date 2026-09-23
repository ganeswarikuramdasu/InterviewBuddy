package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class LearningCategoryResponse {
    private Long id;
    private String name;
    private String description;
    private Integer displayOrder;
    private long resourceCount;
}
