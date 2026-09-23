package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class LearningResourceResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private String resourceType;
    private String contentUrl;
    private String contentBody;
    private boolean completedByCurrentUser;
}
