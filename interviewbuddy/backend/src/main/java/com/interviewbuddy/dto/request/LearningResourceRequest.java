package com.interviewbuddy.dto.request;

import com.interviewbuddy.entity.ResourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LearningResourceRequest {
    @NotNull(message = "Category id is required")
    private Long categoryId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Resource type is required")
    private ResourceType resourceType;

    private String contentUrl;
    private String contentBody;
    private Boolean isPublished;
}
