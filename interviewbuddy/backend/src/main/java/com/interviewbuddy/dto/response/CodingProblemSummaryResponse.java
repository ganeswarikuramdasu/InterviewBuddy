package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CodingProblemSummaryResponse {
    private Long id;
    private String title;
    private String slug;
    private String difficulty;
    private String topic;
    private String platform;
    private String externalUrl;
    private String patternName;
    private String sheetName;
    private List<Long> sheetIds;
    private String status;
}
