package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CrtCategoryResponse {
    private Long id;
    private String name;
    private String displayName;
    private String description;
    private long topicCount;
    private long questionCount;
}
