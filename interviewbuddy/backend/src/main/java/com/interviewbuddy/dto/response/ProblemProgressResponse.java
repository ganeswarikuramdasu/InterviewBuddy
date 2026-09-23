package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProblemProgressResponse {
    private Long problemId;
    private String problemTitle;
    private String problemSlug;
    private String difficulty;
    private String platform;
    private String patternName;
    private String status;
    private String updatedAt;
}
