package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CrtTestResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private Integer durationMinutes;
    private String difficulty;
    private Boolean isPublished;
    private int questionCount;
}
